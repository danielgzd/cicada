import { Key } from './constants';

const zhHans: {
  [key in Key]: string;
} = {
  cicada: '知了',
  success: '成功',
  server_error: '服务器错误',
  parameter_error: '参数错误',
  captcha_error: '图形验证码错误',
  not_authorized: '未验证权限',
  not_authorized_for_admin: '未验证管理员权限',
  username_already_registered: '用户名已被注册',
  musicbill_not_existed: '乐单不存在',
  music_not_existed: '音乐不存在',
  music_already_existed_in_musicbill: '乐单已经包含该音乐',
  music_not_existed_in_musicbill: '乐单未包含该音乐',
  asset_oversize: '资源过大',
  wrong_asset_type: '错误的资源类型',
  asset_not_existed: '资源不存在',
  singer_not_existed: '歌手不存在',
  over_create_music_times_per_day: '超过每天创建音乐最大数量',
  instrumental_has_no_lyric: '乐曲没有歌词',
  singer_already_existed: '歌手已经存在',
  no_need_to_update: '无需更新',
  alias_over_max_length: '别名超过最大长度',
  repeated_alias: '重复的别名',
  nickname_has_used_by_others: '昵称已被其他用户使用',
  user_not_existed: '用户不存在',
  music_forked_by_other_can_not_be_deleted: '被二次创作的音乐无法被删除',
  can_not_collect_musicbill_repeatly: '无法重复收藏乐单',
  musicbill_not_collected: '未收藏该乐单',
  over_user_musicbill_max_amount: '超过乐单最大数量',
  can_not_delete_admin: '无法删除管理员',
  user_is_admin_already: '用户已经是管理员',
  music_play_record_not_existed: '音乐播放记录不存在',
  can_not_invite_musicbill_owner: '无法邀请乐单拥有者',
  repeated_shared_musicbill_invitation: '重复的共享乐单邀请',
  no_permission_to_delete_musicbill_shared_user: '没有权限删除共享乐单用户',
  shared_musicbill_invitation_not_existed: '共享乐单邀请不存在',
  welcome_to: '欢迎使用%s1',
};

export default zhHans;
