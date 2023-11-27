import { Key } from './constants';

const zhCN: {
  [key in Key]: string;
} = {
  cicada: '知了',
  cicada_description: '一个子托管的多用户音乐服务',
  incompatible_tips: '你的浏览器无法兼容知了, 因为缺少以下功能',
  setting: '设置',
  confirm: '确认',
  cancel: '取消',
  language: '语言',
  continue: '继续',
  username: '用户名',
  captcha: '验证码',
  change_language_question: '更换语言将会重新加载应用, 是否继续?',
  relative_volume: '相对音量',
  music_play_record_short: '播放记录',
  my_music: '我的音乐',
  exploration: '发现',
  musicbill: '乐单',
  user_management: '用户管理',
  logout: '退出登录',
  logout_question: '确定退出登录吗?',
  search: '搜索',
  shared_musicbill_invitation: '共享乐单邀请',
  public_musicbill_collection: '收藏的公开乐单',
  previous_step: '上一步',
  welcome_back: '欢迎回来',
  create_at: '创建于',
  no_music_in_musicbill: '乐单暂无音乐',
  find_in_musicbill: '乐单内查找',
  user_created: '用户已创建',
  create_user: '创建用户',
  remark: '备注',
  create: '创建',
  empty_captcha_warning: '请输入验证码',
  wrong_captcha: '错误的验证码',
  delete_user: '删除用户',
  delete_user_question: '确定删除用户吗?',
  delete_user_question_content:
    '删除用户后, 其创建的音乐/歌手将会转移到你的账号下',
  set_as_admin: '设为管理员',
  set_as_admin_question: '确定设为管理员吗?',
  set_as_admin_question_content:
    '成为管理员后账号将无法被删除, 以及拥有和你一样的权限且无法被撤销管理员身份',
  save: '保存',
  maximum_amount_of_musicbill: '乐单最大数量',
  maximum_amount_of_creating_music_per_day: '每天创建音乐最大数量',
  music_play_record_indate: '音乐播放记录保留天数',
  should_be_greater_than: '%s1 应该大于 %s2',
  should_be_greater_than_or_equal_to: '%s1 应该大于等于 %s2',
  should_be_less_than_or_equal_to: '%s1 应该小于等于 %s2',
  length_of: '%s1 长度',
  nickname: '昵称',
  join_time: '加入时间',
  zero_means_unlimited: '0 表示无限制',
  delete_music: '删除音乐',
  delete: '删除',
  music_forked_by_other_can_not_be_deleted: '被二次创作的音乐无法被删除',
  year_of_issue: '发行年份',
  edit_year_of_issue: '编辑发行年份',
  year_of_issue_limit: '发行年份应在 %s1 - %s2 之间',
  edit_avatar: '编辑头像',
  empty_avatar_warning: '请选择一个头像',
  reset_avatar: '重置头像',
  reset_avatar_question: '确定重置头像吗?',
  edit_name: '编辑名字',
  name: '名字',
  empty_name_warning: '请输入名字',
  edit_alias: '编辑别名',
  alias: '别名',
  view_modify_record: '查看修改记录',
  no_musicbill: '暂无乐单',
  no_data: '暂无数据',
  no_suitable_music_play_record: '暂无相关的音乐播放记录',
  no_suitable_music: '暂无相关音乐',
  no_suitable_musicbill: '暂无相关乐单',
  no_shared_musicbill_invitation: '暂无共享乐单邀请',
  invitation_will_be_canceled_automatically_after_days:
    '邀请将在 %s1 天后自动取消',
  create_music: '创建音乐',
  no_music: '暂无音乐',
  no_modify_record: '暂无修改记录',
  no_public_musicbill: '暂无公开乐单',
  edit_cover: '编辑封面',
  empty_cover_warning: '请选择封面',
  reset_cover: '重置封面',
  reset_cover_question: '确定重置封面吗?',
  edit_lyric: '编辑歌词',
  lyric: '歌词',
  text_of_lrc: 'LRC 格式文本',
  modify_singer: '修改歌手',
  singer: '歌手',
  emtpy_singers_warning: '请选择歌手',
  modify_file_of_music: '修改音乐文件',
  file_of_music: '音乐文件',
  empty_file_warning: '请选择一个文件',
  one_of_formats: '以下格式的一种: %s1',
  modify_fork_from: '修改二次创作来源',
  fork_from: '二次创作来源',
  add: '添加',
  image_select_placeholder: '选择 jpeg/png 格式的图片',
  pwa_update_question: '检查到新版本, 是否马上加载?',
  music: '音乐',
  public_musicbill: '公开乐单',
  pick_from_playlist_randomly: '随机从播放列表选取',
  relocate_to_here: '重定位到此处',
  empty_playqueue: '空的播放队列',
  empty_playlist: '空的播放列表',
  next_music: '下一首',
  failed_to_play: '播放发生错误',
  auto_play_next_after_seconds: '%s1 秒后自动播放下一首',
  can_not_connect_to_server_temporarily: '暂时无法连接到服务器',
  music_type_short: '类型',
  music_type_song: '歌曲',
  music_type_instrument: '乐曲',
  music_file: '音乐文件',
  singer_list: '歌手列表',
  supported_formats: '支持的格式',
  invite: '邀请',
  shared_user: '共享用户',
  username_is_invalid: '非法的用户名',
  invitation_has_been_sent: '邀请已发送',
  origin: '服务器地址',
  add_origin: '添加服务器',
  failed_to_get_server_metadata: '无法连接到当前服务器',
  password: '密码',
  login: '登录',
  or: '或者',
  existing_server: '现有服务器',
  select: '选择',
  jump_to: '跳转到',
  switch_user: '切换用户',
  switch_user_question: '切换用户将会清空播放列表和播放队列, 是否继续?',
  existing_user: '现有用户',
  update_musicbill_order_error: '更新乐单顺序失败',
  last_active_time: '上次活动时间',
  today: '今天',
  yesterday: '昨天',
  admin: '管理员',
  unknown: '未知',
  edit_nickname: '编辑昵称',
  empty_nickname_warning: '请输入昵称',
  change_password: '修改密码',
  new_password: '新的密码',
  confirm_new_password: '确认新的密码',
  passwords_do_not_match: '两次密码不一致',
  password_has_changed: '密码已修改',
  enable_2fa: '启用 2FA',
  disable_2fa: '禁用 2FA',
  '2fa_instruction':
    '使用例如 Microsoft Authenticator / Google Authenticator 等验证器扫描二维码',
  '2fa_token': '2FA 凭证',
  lack_of_2fa_token: '缺少 2FA 凭证',
  '2fa_has_disabled': '2FA 已被禁用',
  create_musicbill: '创建乐单',
  empty_musicbill_warning: '空的乐单',
  create_music_by_yourself: '自己创建音乐',
  create_musicbill_by_yourself: '自己创建乐单',
  no_suitable_musicbill_warning: '找不到想要的乐单?',
  no_suitable_music_warning: '找不到想要的音乐?',
  no_suitable_singer_warning: '找不到想要的歌手?',
  no_suitable_singer: '暂无相关歌手',
  create_singer: '创建歌手',
  repeated_name_singer_warning: '已有重名歌手, 是否重复创建?',
  create_singer_by_yourself: '自己创建歌手',
  created: '已创建',
  accept: '接受',
  shared_musicbill_invitation_instruction: '%s1 邀请你共享乐单 %s2',
  invite_user: '邀请用户',
  leave_shared_musicbill_short: '退出',
  leave_shared_musicbill: '退出共享乐单',
  owner: '所有者',
  invitation_has_sent: '邀请已经发送',
  remove_user_from_shared_musicbill_question: '确定从共享乐单中移除该用户吗?',
  delete_musicbill: '删除乐单',
  set_musicbill_as_public: '设为公开乐单',
  set_musicbill_as_private: '设为私有乐单',
  question_of_setting_musicbill_as_public: '确定设为公开乐单吗?',
  instruction_of_setting_musicbill_as_public:
    '公开的乐单将会出现在个人主页上, 且其他用户可以进行搜索和收藏',
  question_of_setting_musicbill_as_private: '确定设为私有乐单吗?',
  instruction_of_setting_musicbill_as_private:
    '设为隐藏将会从个人主页移除该乐单, 其他用户无法搜索和收藏, 且会从用户的收藏列表中移除',
  music_created: '创建的音乐',
  join_at: '%s1 加入',
  music_list_are_added_to_playlist: '%s1 首音乐添加到播放列表',
  music_list_are_added_to_playlist_unsuccessfully: '播放列表已包含这些音乐',
  next_music_info: '下一首播放 %s1',
  failed_to_get_musicbill_list: '获取乐单列表失败',
  save_time_of_singer_modify_record_instruction:
    '歌手修改记录保留时间为 %s1 天',
  singers_name_copied: '歌手名已复制',
  no_music_singer_warning: '该歌手暂未收录音乐',
  manage: '管理',
  manage_origins: '服务器地址管理',
  origin_users_count: '%s1 用户已登录',
  delete_origin_question: '确定删除该服务器地址以及已登录用户吗?',
  sort_musicbill: '歌单排序',
  retry: '重试',
  warning_of_exiting_by_keyboard: '请先暂停音乐再使用快捷键退出',
  unknown_singer: '未知歌手',
  someone_created_at: '%s1 创建于 %s2',
  quit_shared_musicbill_question: '确定退出该共享乐单吗?',
};

export default zhCN;
