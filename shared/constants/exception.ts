export enum ExceptionCode {
  SUCCESS = 0,
  SERVER_ERROR = 1000,
  PARAMETER_ERROR,
  CAPTCHA_ERROR,
  NOT_AUTHORIZED,
  NOT_AUTHORIZED_FOR_ADMIN,
  USERNAME_ALREADY_REGISTERED,
  MUSICBILL_NOT_EXISTED,
  MUSIC_NOT_EXISTED,
  MUSIC_ALREADY_EXISTED_IN_MUSICBILL,
  MUSIC_NOT_EXISTED_IN_MUSICBILL,
  ASSET_OVERSIZE,
  WRONG_ASSET_TYPE,
  ASSET_NOT_EXISTED,
  SINGER_NOT_EXISTED,
  OVER_CREATE_MUSIC_TIMES_PER_DAY,
  INSTRUMENTAL_HAS_NO_LYRIC,
  SINGER_ALREADY_EXISTED,
  NO_NEED_TO_UPDATE,
  ALIAS_OVER_MAX_LENGTH,
  REPEATED_ALIAS,
  NICKNAME_HAS_USED_BY_OTHERS,
  USER_NOT_EXISTED,
  MUSIC_FORKED_BY_OTHER_CAN_NOT_BE_DELETED,
  CAN_NOT_COLLECT_MUSICBILL_REPEATLY,
  MUSICBILL_NOT_COLLECTED,
  OVER_USER_MUSICBILL_MAX_AMOUNT,
  CAN_NOT_DELETE_ADMIN,
  USER_IS_ADMIN_ALREADY,
  MUSIC_PLAY_RECORD_NOT_EXISTED,
  CAN_NOT_INVITE_MUSICBILL_OWNER,
  REPEATED_SHARED_MUSICBILL_INVITATION,
  NO_PERMISSION_TO_DELETE_MUSICBILL_SHARED_USER,
  SHARED_MUSICBILL_INVITATION_NOT_EXISTED,
}
