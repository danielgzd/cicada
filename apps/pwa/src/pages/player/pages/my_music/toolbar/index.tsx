import styled from 'styled-components';
import IconButton from '@/components/icon_button';
import { MdOutlineAddBox } from 'react-icons/md';
import useNavigate from '@/utils/use_navigate';
import { Query } from '@/constants';
import Filter from './filter';
import { TOOLBAR_HEIGHT } from '../constants';

const Style = styled.div`
  position: absolute;
  width: 100%;
  height: ${TOOLBAR_HEIGHT};
  left: 0;
  bottom: 0;

  padding: 0 20px env(safe-area-inset-bottom, 0) 20px;

  display: flex;
  align-items: center;
  gap: 10px;

  backdrop-filter: blur(5px);
`;

function Toolbar() {
  const navigate = useNavigate();
  const openCreateMusicDialog = () =>
    navigate({
      query: {
        [Query.CREATE_MUSIC_DIALOG_OPEN]: 1,
      },
    });
  return (
    <Style>
      <IconButton onClick={openCreateMusicDialog}>
        <MdOutlineAddBox />
      </IconButton>
      <Filter />
    </Style>
  );
}

export default Toolbar;
