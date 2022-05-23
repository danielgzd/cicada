import { useEffect, useState } from 'react';
import * as React from 'react';

import u, { User } from '@/global_state/user';
import token from '@/global_state/token';
import toast from '@/platform/toast';
import logger from '@/platform/logger';
import dialog from '@/platform/dialog';
import Label from '@/components/label';
import Input from '@/components/input';
import { NICKNAME_MAX_LENGTH } from '@/constants/user';
import Dialog, { Title, Content, Action } from '@/components/dialog';
import globalEventemitter, { EventType } from '@/platform/global_eventemitter';
import Button, { Type as ButtonType } from '@/components/button';
import updateUser, { Key } from '@/server/update_user';
import Avatar from './avatar';
import { PART_SPACE } from './constants';

const labelStyle = {
  marginBottom: PART_SPACE,
};
const inputStyle = {
  width: '100%',
};
const onSignout = () =>
  dialog.confirm({
    title: '确定退出登录吗?',
    onConfirm: () => token.set(''),
  });

function ProfileDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  const [nickname, setNickname] = useState(user.nickname);
  const onNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNickname(event.target.value);

  const [loading, setLoading] = useState(false);
  const onUpdate = async () => {
    if (!nickname) {
      return toast.error('请输入昵称');
    }
    setLoading(true);
    try {
      let needUpdate = false;

      if (nickname !== user.nickname) {
        await updateUser({ key: Key.NICKNAME, value: nickname });
        needUpdate = true;
      }

      if (needUpdate) {
        u.set({
          ...user,
          nickname,
        });
      }

      onClose();
    } catch (error) {
      logger.error(error, { description: '更新个人资料失败' });
      toast.error(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setNickname(user.nickname);
    }
  }, [open, user]);

  useEffect(() => {
    const openListener = () => setOpen(true);
    globalEventemitter.on(EventType.OPEN_PROFILE_DIALOG, openListener);
    return () =>
      void globalEventemitter.off(EventType.OPEN_PROFILE_DIALOG, openListener);
  }, []);

  return (
    <Dialog open={open}>
      <Title>个人资料</Title>
      <Content>
        <Avatar user={user} />
        <Label label="ID" style={labelStyle}>
          <Input value={user.id} disabled style={inputStyle} />
        </Label>
        <Label label="邮箱" style={labelStyle}>
          <Input value={user.email} disabled style={inputStyle} />
        </Label>
        <Label label="注册时间" style={labelStyle}>
          <Input
            value={user.joinTimestamp.toString()}
            disabled
            style={inputStyle}
          />
        </Label>
        <Label label="昵称" style={labelStyle}>
          <Input
            value={nickname}
            onChange={onNicknameChange}
            style={inputStyle}
            disabled={loading}
            maxLength={NICKNAME_MAX_LENGTH}
          />
        </Label>
      </Content>
      <Action>
        <div className="left">
          <Button
            label="退出登录"
            type={ButtonType.DANGER}
            disabled={loading}
            onClick={onSignout}
          />
        </div>
        <Button label="关闭" onClick={onClose} disabled={loading} />
        <Button
          label="更新资料"
          type={ButtonType.PRIMARY}
          onClick={onUpdate}
          loading={loading}
        />
      </Action>
    </Dialog>
  );
}

export default React.memo(ProfileDialog);