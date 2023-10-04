import useTitlebarArea from '@/utils/use_titlebar_area_rect';
import styled from 'styled-components';
import Cover, { Shape } from '@/components/cover';
import { CSSVariable } from '@/global_style';
import ellipsis from '@/style/ellipsis';
import { useEffect, useState } from 'react';
import getResizedImage from '@/server/asset/get_resized_image';
import { MINI_INFO_HEIGHT, UserDetail } from './constants';

const AVATAR_SIZE = 28;
const Style = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${MINI_INFO_HEIGHT}px;

  background-color: #fff;

  display: flex;
  align-items: center;
  gap: 10px;

  > .name {
    flex: 1;
    min-width: 0;

    ${ellipsis}
    font-size: 18px;
    font-weight: bold;
    color: ${CSSVariable.TEXT_COLOR_PRIMARY};
  }
`;

function MiniInfo({ user }: { user: UserDetail }) {
  const [paddingRight, setPaddingRight] = useState(0);
  const { right } = useTitlebarArea();

  useEffect(() => {
    setPaddingRight(right ? window.innerWidth - right : 0);
  }, [right]);

  return (
    <Style
      style={{
        padding: `0 ${paddingRight + 20}px 0 20px`,
      }}
    >
      <Cover
        src={getResizedImage({
          url: user.avatar,
          size: Math.ceil(AVATAR_SIZE * window.devicePixelRatio),
        })}
        size={AVATAR_SIZE}
        alt="user avatar"
        shape={Shape.CIRCLE}
      />
      <div className="name">{user.nickname}</div>
    </Style>
  );
}

export default MiniInfo;
