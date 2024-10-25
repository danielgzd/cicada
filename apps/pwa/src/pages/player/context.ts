import { createContext } from 'react';
import { RequestStatus } from '@/constants';
import {
  MusicWithSingerAliases,
  QueueMusic,
  Musicbill,
  StopTimer,
} from './constants';

interface Context {
  getMusicbillListStatus: RequestStatus;
  musicbillList: Musicbill[];

  audioLoading: boolean;
  audioPaused: boolean;
  audioDuration: number;
  audioBufferedPercent: number;

  playlist: (MusicWithSingerAliases & { index: number })[];

  playqueue: QueueMusic[];
  currentPlayqueuePosition: number;

  lyricPanelOpen: boolean;

  stopTimer: StopTimer | null;
}

const context = createContext<Context>({
  getMusicbillListStatus: RequestStatus.LOADING,
  musicbillList: [],

  audioLoading: false,
  audioPaused: true,
  audioDuration: 0,
  audioBufferedPercent: 0,

  playlist: [],

  playqueue: [],
  currentPlayqueuePosition: -1,

  lyricPanelOpen: false,

  stopTimer: null,
});

export default context;
