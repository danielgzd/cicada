import { CSSVariable } from '@/global_style';
import styled from 'styled-components';
import Cover from '@/components/cover';
import {
  MdOutlineCalendarToday,
  MdOutlineLocalFireDepartment,
  MdFilePresent,
  MdAccessTime,
  MdOutlinePostAdd,
} from 'react-icons/md';
import { MusicDetail } from './constants';

const Style = styled.div`
  position: relative;

  font-size: 0;

  > .info {
    position: absolute;
    left: 0;
    bottom: 0;
    max-width: 80%;

    padding: 10px 20px;
    background-color: rgb(255 255 255 / 0.75);

    > .name {
      font-size: 28px;
      font-weight: bold;
      color: ${CSSVariable.TEXT_COLOR_PRIMARY};
    }

    > .aliases {
      margin-top: 5px;

      font-size: 14px;
      color: ${CSSVariable.TEXT_COLOR_SECONDARY};
    }

    > .extra {
      margin-top: 5px;

      font-size: 12px;
      color: ${CSSVariable.TEXT_COLOR_SECONDARY};
      user-select: none;

      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 5px 10px;

      > .part {
        display: flex;
        align-items: center;
        gap: 3px;

        > .icon {
          font-size: 14px;
        }

        > .value {
          font-family: monospace;
        }
      }
    }
  }
`;
const formatDuration = (duration: number) => {
  const minute = Math.floor(duration / 60);
  const second = Math.floor(duration % 60);
  return `${minute > 9 ? minute : `0${minute}`}:${
    second > 9 ? second : `0${second}`
  }`;
};

function Info({ music }: { music: MusicDetail }) {
  const assetParts = music.asset.split('.');
  const assetFormat = assetParts[assetParts.length - 1];
  return (
    <Style>
      <Cover src={music.cover} size="100%" />
      <div className="info">
        <div className="name">{music.name}</div>
        {music.aliases.length ? (
          <div className="aliases">
            {music.aliases.map((alias, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="alias" key={index}>
                {alias}
              </div>
            ))}
          </div>
        ) : null}
        <div className="extra">
          {music.year ? (
            <div className="part" title="发行年份">
              <MdOutlineCalendarToday className="icon" />
              <div className="value">{music.year}</div>
            </div>
          ) : null}
          {music.duration ? (
            <div className="part" title="时长">
              <MdAccessTime className="icon" />
              <div className="value">{formatDuration(music.duration)}</div>
            </div>
          ) : null}
          {music.size ? (
            <div className="part" title="文件大小">
              <MdFilePresent className="icon" />
              <div className="value">
                {(music.size / 1024 / 1024).toFixed(2)}MB
              </div>
            </div>
          ) : null}
          <div className="part" title="文件类型">
            <MdFilePresent className="icon" />
            <div className="value">{assetFormat.toUpperCase()}</div>
          </div>
          <div className="part" title="加入乐单数量">
            <MdOutlinePostAdd className="icon" />
            <div className="value">{music.musicbillCount}</div>
          </div>
          <div className="part" title="热度">
            <MdOutlineLocalFireDepartment className="icon" />
            <div className="value">{music.heat}</div>
          </div>
        </div>
      </div>
    </Style>
  );
}

export default Info;
