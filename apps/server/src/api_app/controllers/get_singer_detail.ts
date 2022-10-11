import { AssetType } from '#/constants';
import { ExceptionCode } from '#/constants/exception';
import excludeProperty from '#/utils/exclude_property';
import db from '@/db';
import { Music, Property as MusicProperty } from '@/db/music';
import {
  getSingerById,
  getSingerListInMusicIds,
  Property as SingerProperty,
} from '@/db/singer';
import { getUserById, Property as UserProperty } from '@/db/user';
import { getAssetUrl } from '@/platform/asset';
import { Context } from '../constants';

export default async (ctx: Context) => {
  const { id } = ctx.query as { id: unknown };
  if (typeof id !== 'string' || !id.length) {
    return ctx.except(ExceptionCode.PARAMETER_ERROR);
  }

  const singer = await getSingerById(id, [
    SingerProperty.NAME,
    SingerProperty.ALIASES,
    SingerProperty.AVATAR,
    SingerProperty.CREATE_TIMESTAMP,
    SingerProperty.CREATE_USER_ID,
  ]);
  if (!singer) {
    return ctx.except(ExceptionCode.SINGER_NOT_EXIST);
  }

  const [createUser, musicList] = await Promise.all([
    getUserById(singer.createUserId, [
      UserProperty.ID,
      UserProperty.AVATAR,
      UserProperty.NICKNAME,
    ]),
    db.all<
      Pick<
        Music,
        | MusicProperty.ID
        | MusicProperty.TYPE
        | MusicProperty.NAME
        | MusicProperty.ALIASES
        | MusicProperty.COVER
        | MusicProperty.SQ
        | MusicProperty.HQ
        | MusicProperty.AC
      >
    >(
      `
        select
          m.id,
          m.type,
          m.name,
          m.aliases,
          m.cover,
          m.sq,
          m.hq,
          m.ac
        from music as m
        left join music_singer_relation as msr
          on m.id = msr.musicId
        where msr.singerId = ?
      `,
      [id],
    ),
  ]);

  const musicIdMapSingers: {
    [key: string]: {
      id: string;
      name: string;
      aliases: string;
      avatar: string;
    }[];
  } = {};
  if (musicList.length) {
    const allSingerList = await getSingerListInMusicIds(
      Array.from(new Set(musicList.map((m) => m.id))),
      [
        SingerProperty.ID,
        SingerProperty.NAME,
        SingerProperty.ALIASES,
        SingerProperty.AVATAR,
      ],
    );
    allSingerList.forEach((s) => {
      if (!musicIdMapSingers[s.musicId]) {
        musicIdMapSingers[s.musicId] = [];
      }
      musicIdMapSingers[s.musicId].push({
        ...excludeProperty(s, ['musicId']),
        avatar: getAssetUrl(s.avatar, AssetType.SINGER_AVATAR),
      });
    });
  }

  return ctx.success({
    ...excludeProperty(singer, [SingerProperty.CREATE_USER_ID]),
    avatar: getAssetUrl(singer.avatar, AssetType.SINGER_AVATAR),
    createUser: {
      ...createUser,
      avatar: getAssetUrl(createUser!.avatar, AssetType.USER_AVATAR),
    },
    musicList: musicList.map((m) => ({
      ...m,
      cover: getAssetUrl(m.cover, AssetType.MUSIC_COVER),
      sq: getAssetUrl(m.sq, AssetType.MUSIC_SQ),
      hq: getAssetUrl(m.hq, AssetType.MUSIC_HQ),
      ac: getAssetUrl(m.ac, AssetType.MUSIC_AC),
      singers: musicIdMapSingers[m.id] || [],
    })),
  });
};