import { Language } from '#/constants';
import { useSetting } from '@/global_states/setting';
import type { Key } from './constants';

let translation: { [key in Key]: string };
switch (useSetting.getState().language) {
  case Language.ZH_HANS: {
    ({ default: translation } = await import('./zh_hans'));
    break;
  }
  default: {
    ({ default: translation } = await import('./en'));
  }
}

export function t(key: Key, ...args: string[]) {
  let value = translation[key] || key;

  if (args.length) {
    for (let i = 0; i < args.length; i += 1) {
      value = value.replace(`%s${i + 1}`, args[i]);
    }
  }

  return value;
}

export const LANGUAGE_MAP: Record<
  Language,
  {
    label: string;
  }
> = {
  [Language.EN]: { label: 'English' },
  [Language.ZH_HANS]: { label: '简体中文' },
};

export type { Key };
