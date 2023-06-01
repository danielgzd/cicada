/**
 * v0 --> v1
 * v1 --> v2 应删除重写
 * @author mebtte<hi@mebtte.com>
 */
import inquirer from 'inquirer';
import { getAssetDirectory, getDataVersionPath, updateConfig } from '@/config';
import { createSpinner, Spinner } from 'nanospinner';
import fs from 'fs';
import fsPromises from 'fs/promises';
import exitWithMessage from '@/utils/exit_with_message';
import { AssetType } from '#/constants';
import { getDB } from '@/db';
import generateRandomString from '#/utils/generate_random_string';
import { ID_LENGTH, MusicType } from '#/constants/music';
import {
  MUSICBILL_TABLE_NAME,
  MusicbillProperty,
  SHARED_MUSICBILL_TABLE_NAME,
  SharedMusicbillProperty,
  USER_TABLE_NAME,
  UserProperty,
} from '@/constants/db_definition';

async function combineMusicAsset() {
  const musicSqDirectory = `${getAssetDirectory()}/music_sq`;

  const musicAcDirectory = `${getAssetDirectory()}/music_ac`;
  const acs = await fsPromises.readdir(musicAcDirectory);
  for (const ac of acs) {
    await fsPromises.cp(
      `${musicAcDirectory}/${ac}`,
      `${musicSqDirectory}/${ac}`,
      { force: true },
    );
  }

  const musicHqDirectory = `${getAssetDirectory()}/music_hq`;
  const hqs = await fsPromises.readdir(musicHqDirectory);
  for (const hq of hqs) {
    await fsPromises.cp(
      `${musicHqDirectory}/${hq}`,
      `${musicSqDirectory}/${hq}`,
      { force: true },
    );
  }

  await Promise.all([
    fsPromises.rename(musicSqDirectory, getAssetDirectory(AssetType.MUSIC)),
    fsPromises.rm(musicAcDirectory, { force: true, recursive: true }),
    fsPromises.rm(musicHqDirectory, { force: true, recursive: true }),
  ]);
}

async function separateMusicAc() {
  const acMusicList = await getDB().all<{
    id: string;
    type: MusicType;
    name: string;
    ac: string;
    createUserId: string;
    createTimestamp: number;
    aliases: string;
    cover: string;
  }>(
    `
      SELECT
        *
      FROM music
      WHERE ac != ''
    `,
    [],
  );

  for (const acMusic of acMusicList) {
    const singers = await getDB().all<{ singerId: string }>(
      `
        SELECT
          singerId
        FROM music_singer_relation
        WHERE musicId = ?
      `,
      [acMusic.id],
    );
    const id = generateRandomString(ID_LENGTH, false);
    await getDB().run(
      `
        INSERT INTO music( id, type, name, sq, createUserId, createTimestamp, aliases, cover )
        VALUES( ?, ?, ?, ?, ?, ?, ?, ? )
        `,
      [
        id,
        acMusic.type,
        `${acMusic.name}[伴奏]`,
        acMusic.ac,
        acMusic.createUserId,
        acMusic.createTimestamp,
        acMusic.aliases,
        acMusic.cover,
      ],
    );
    await getDB().run(
      `
        INSERT INTO music_singer_relation( musicId, singerId )
        VALUES ${singers.map(() => '( ?, ? )').join(', ')}
      `,
      singers.map((s) => [id, s.singerId]).flat(Infinity),
    );
    if (acMusic.type === MusicType.SONG) {
      const lyrics = await getDB().all<{
        id: string;
        lrc: string;
        lrcContent: string;
      }>(
        `
          SELECT 
            id,
            lrc,
            lrcContent
          FROM lyric
          WHERE musicId = ?
        `,
        [acMusic.id],
      );
      if (lyrics.length) {
        await getDB().run(
          `
            INSERT INTO lyric( musicId, lrc, lrcContent )
            VALUES ${lyrics.map(() => '( ?, ?, ? )').join(', ')}
          `,
          lyrics.map((l) => [id, l.lrc, l.lrcContent]).flat(Infinity),
        );
      }
    }
  }
}

async function migrateMusicHqToSq() {
  const hqMusicList = await getDB().all<{
    id: string;
    hq: string;
  }>(
    `
      SELECT
        id,
        hq
      FROM music
      WHERE hq != ''
    `,
    [],
  );
  for (const hqMusic of hqMusicList) {
    await getDB().run(
      `
        UPDATE music SET sq = ?
        WHERE id = ?
      `,
      [hqMusic.hq, hqMusic.id],
    );
  }
}

async function dropMusicAcAndHq() {
  await Promise.all([
    getDB().run(
      `
        ALTER TABLE music DROP COLUMN ac
      `,
    ),
    getDB().run(
      `
        ALTER TABLE music DROP COLUMN hq
      `,
    ),
  ]);
}

async function renameMusicSq() {
  await getDB().run(
    `
      ALTER TABLE music RENAME COLUMN sq TO asset
    `,
  );
}

async function addMusicYear() {
  await getDB().run(
    `
      ALTER TABLE music ADD year INTEGER
    `,
  );
}

async function addUserLastActiveTimestamp() {
  await getDB().run(
    `
      ALTER TABLE user ADD lastActiveTimestamp INTEGER NOT NULL DEFAULT 0
    `,
  );
}

function createSharedMusicbill() {
  return getDB().run(
    `
      CREATE TABLE ${SHARED_MUSICBILL_TABLE_NAME} (
        ${SharedMusicbillProperty.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
        ${SharedMusicbillProperty.MUSICBILL_ID} TEXT NOT NULL REFERENCES ${MUSICBILL_TABLE_NAME} ( ${MusicbillProperty.ID} ),
        ${SharedMusicbillProperty.SHARED_USER_ID} TEXT NOT NULL REFERENCES ${USER_TABLE_NAME} ( ${UserProperty.ID} ),
        ${SharedMusicbillProperty.SHARE_TIMESTAMP} INTEGER NOT NULL,
        ${SharedMusicbillProperty.INVITE_USER_ID} TEXT NOT NULL REFERENCES ${USER_TABLE_NAME} ( ${UserProperty.ID} ),
        ${SharedMusicbillProperty.ACCEPTED} INTEGER NOT NULL DEFAULT 0,

        UNIQUE( ${SharedMusicbillProperty.MUSICBILL_ID}, ${SharedMusicbillProperty.SHARED_USER_ID} ) ON CONFLICT REPLACE
      )
    `,
  );
}

function addUserMusicPlayRecordIndate() {
  return getDB().run(
    `
      ALTER TABLE user ADD musicPlayRecordIndate INTEGER NOT NULL DEFAULT 0
    `,
  );
}

async function dropMusicbillExport() {
  await getDB().run(
    `
      ALTER TABLE user DROP COLUMN exportMusicbillMaxTimePerDay
    `,
  );
  await getDB().run(
    `
      DROP TABLE musicbill_export
    `,
  );
}

async function writeNewVersion() {
  await fsPromises.writeFile(getDataVersionPath(), '1');
}

export default async ({ data }: { data: string }) => {
  updateConfig({ data });

  if (!fs.existsSync(getDataVersionPath())) {
    return exitWithMessage(`[ ${data} ] 不是合法的数据目录`);
  }
  const dataVersion = Number(
    fs.readFileSync(getDataVersionPath()).toString().replace(/\s/gm, ''),
  );
  if (dataVersion !== 0) {
    return exitWithMessage('当前版本的知了只支持升级 v0 版本的数据');
  }

  const answer: { confirmed: boolean } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message:
        '升级数据将会对数据目录进行修改, 升级过程中断将会导致数据异常, 请先备份数据, 是否继续?',
      default: false,
    },
  ]);
  if (!answer.confirmed) {
    return;
  }

  let spinner: Spinner;

  spinner = createSpinner();
  spinner.start({ text: '正在合并音乐资源...' });
  await combineMusicAsset();
  spinner.success({ text: '音乐资源已合并' });

  spinner = createSpinner();
  spinner.start({ text: '正在分离伴奏...' });
  await separateMusicAc();
  spinner.success({ text: '伴奏已分离' });

  spinner = createSpinner();
  spinner.start({ text: '正在迁移 music.hq 到 music.sq...' });
  await migrateMusicHqToSq();
  spinner.success({ text: 'music.hq 已迁移到 music.sq' });

  spinner = createSpinner();
  spinner.start({ text: '正在删除 music.ac 和 music.hq...' });
  await dropMusicAcAndHq();
  spinner.success({ text: '已删除 music.ac 和 music.hq' });

  spinner = createSpinner();
  spinner.start({ text: '正在重命名 music.sq 为 music.asset...' });
  await renameMusicSq();
  spinner.success({ text: 'music.sq 已重命名为 music.asset' });

  spinner = createSpinner();
  spinner.start({ text: '正在添加 music.year...' });
  await addMusicYear();
  spinner.success({ text: '已添加 music.year' });

  spinner = createSpinner();
  spinner.start({ text: '正在添加 user.lastActiveTimestamp...' });
  await addUserLastActiveTimestamp();
  spinner.success({ text: 'user.lastActiveTimestamp 已添加' });

  spinner = createSpinner();
  spinner.start({ text: '正在添加 user.musicPlayRecordIndate...' });
  await addUserMusicPlayRecordIndate();
  spinner.success({ text: 'user.musicPlayRecordIndate 已添加' });

  spinner = createSpinner();
  spinner.start({ text: '正在创建 shared_musicbill...' });
  await createSharedMusicbill();
  spinner.success({ text: 'shared_musicbill 已创建' });

  spinner = createSpinner();
  spinner.start({ text: '正在移除 musicbill_export...' });
  await dropMusicbillExport();
  spinner.success({ text: 'musicbill_export 已移除' });

  spinner = createSpinner();
  spinner.start({ text: '正在写入新的版本号...' });
  await writeNewVersion();
  spinner.success({ text: '已写入新的版本号' });

  createSpinner().success({ text: '数据已从 v0 升级到 v1' });
  return process.exit();
};
