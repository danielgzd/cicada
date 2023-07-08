/* eslint-disable react/destructuring-assignment */
import { ReactEventHandler, PureComponent } from 'react';
import throttle from 'lodash/throttle';
import uploadMusicPlayRecord from '@/server/base/upload_music_play_record';
import { CacheName } from '@/constants/cache';
import settingState from '@/global_states/setting';
import { Setting } from '@/constants/setting';
import definition from '@/definition';
import { EFFECTIVE_PLAY_PERCENT } from '#/constants';
import logger from '@/utils/logger';
import eventemitter, { EventType } from '../eventemitter';
import { QueueMusic, Music } from '../constants';
import onError from './on_error';

const style = {
  display: 'none',
};
const onWaiting = () => eventemitter.emit(EventType.AUDIO_WAITING, null);
const onCanPlayThrough: ReactEventHandler<HTMLAudioElement> = (event) => {
  const { duration } = event.target as HTMLAudioElement;
  return eventemitter.emit(EventType.AUDIO_CAN_PLAY_THROUGH, { duration });
};
const onPlay = () => eventemitter.emit(EventType.AUDIO_PLAY, null);
const onPause = () => eventemitter.emit(EventType.AUDIO_PAUSE, null);
const onEnded = () => eventemitter.emit(EventType.ACTION_NEXT, null);

interface Props {
  queueMusic: QueueMusic;
  setting: Setting;
}

class Audio extends PureComponent<Props, {}> {
  audio: HTMLAudioElement | null;

  constructor(props: Props) {
    super(props);

    this.audio = null;
  }

  componentDidMount() {
    this.audio!.volume = this.props.setting.playerVolume;

    eventemitter.listen(EventType.ACTION_SET_TIME, this.onActionSetTime);
    eventemitter.listen(EventType.ACTION_TOGGLE_PLAY, this.onActionTogglePlay);
    eventemitter.listen(EventType.ACTION_PLAY, this.onActionPlay);
    eventemitter.listen(EventType.ACTION_PAUSE, this.onActionPause);

    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('beforeunload', this.beforeUnload);
  }

  getSnapshotBeforeUpdate(prevProps: Props) {
    const { queueMusic } = this.props;
    if (prevProps.queueMusic.pid !== queueMusic.pid) {
      this.uploadPlayRecord(prevProps.queueMusic);
      this.createCache(prevProps.queueMusic);
    }
    return null;
  }

  componentDidUpdate(prevProps: Props) {
    const { setting, queueMusic } = this.props;

    if (prevProps.setting.playerVolume !== setting.playerVolume) {
      this.audio!.volume = setting.playerVolume;
    }

    if (prevProps.queueMusic.pid !== queueMusic.pid) {
      this.audio!.currentTime = 0;
      this.audio!.play();
      eventemitter.emit(EventType.AUDIO_TIME_UPDATED, {
        currentMillisecond: 0,
      });
    }
  }

  componentWillUnmount() {
    eventemitter.unlisten(EventType.ACTION_SET_TIME, this.onActionSetTime);
    eventemitter.unlisten(
      EventType.ACTION_TOGGLE_PLAY,
      this.onActionTogglePlay,
    );
    eventemitter.unlisten(EventType.ACTION_PLAY, this.onActionPlay);
    eventemitter.unlisten(EventType.ACTION_PAUSE, this.onActionPause);

    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('beforeunload', this.beforeUnload);

    this.uploadPlayRecord(this.props.queueMusic);
  }

  onActionSetTime = ({ second }: { second: number }) =>
    window.setTimeout(() => {
      this.audio!.currentTime = second;
      this.audio!.play();
      eventemitter.emit(EventType.AUDIO_TIME_UPDATED, {
        currentMillisecond: second * 1000,
      });
    }, 0);

  onActionTogglePlay = () =>
    this.audio!.paused ? this.audio!.play() : this.audio!.pause();

  onActionPlay = () => this.audio!.play();

  onActionPause = () => this.audio!.pause();

  onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      eventemitter.emit(
        this.audio!.paused ? EventType.AUDIO_PAUSE : EventType.AUDIO_PLAY,
        null,
      );
    }
  };

  onTimeUpdate = throttle(() => {
    const { currentTime } = this.audio!;
    return eventemitter.emit(EventType.AUDIO_TIME_UPDATED, {
      currentMillisecond: currentTime * 1000,
    });
  }, 300);

  setAudio = (audio: HTMLAudioElement | null) => {
    if (audio) {
      // eslint-disable-next-line no-param-reassign
      audio.volume = this.props.setting.playerVolume;
    }
    this.audio = audio;
  };

  getPlayedSeconeds = () => {
    const { played } = this.audio!;
    let playedSeconeds = 0;
    for (let i = 0, { length } = played; i < length; i += 1) {
      const start = played.start(i);
      const end = played.end(i);
      playedSeconeds += end - start;
    }
    return playedSeconeds;
  };

  uploadPlayRecord = (music: Music) => {
    const { duration } = this.audio!;
    const playedSeconds = this.getPlayedSeconeds();
    return uploadMusicPlayRecord({
      musicId: music.id,
      percent: duration ? playedSeconds / duration : 0,
    });
  };

  beforeUnload = () => this.uploadPlayRecord(this.props.queueMusic);

  /**
   * workbox 不支持缓存媒体
   * 需要手动进行缓存
   * 详情查看 https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video
   * @author mebtte<hi@mebtte.com>
   */
  createCache(music: Music) {
    const { duration } = this.audio!;
    const playedSeconds = this.getPlayedSeconeds();
    const percent = duration ? playedSeconds / duration : 0;

    if (
      window.caches &&
      ((definition.WITH_SW && percent > EFFECTIVE_PLAY_PERCENT) ||
        definition.DEVELOPMENT)
    ) {
      window.caches.open(CacheName.ASSET_MEDIA).then(async (cache) => {
        const exist = await cache.match(music.asset);
        if (!exist) {
          cache
            .add(music.asset)
            .catch((error) =>
              logger.error(error, `Failed to cache music "${music.asset}"`),
            );
        }
      });
    }
  }

  render() {
    const { queueMusic } = this.props;
    const { pid, asset } = queueMusic;
    return (
      <audio
        key={pid}
        ref={this.setAudio}
        style={style}
        src={asset}
        autoPlay
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
        onWaiting={onWaiting}
        onCanPlayThrough={onCanPlayThrough}
        onTimeUpdate={this.onTimeUpdate}
        onError={onError}
        crossOrigin="anonymous"
      />
    );
  }
}

export default settingState.withState('setting', Audio);
