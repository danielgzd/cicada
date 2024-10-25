import {
  memo,
  useState,
  ChangeEvent,
  KeyboardEvent,
  CSSProperties,
  useRef,
  useEffect,
} from 'react';
import { PLAYER_PATH, ROOT_PATH } from '@/constants/route';
import useNavigate from '@/utils/use_navigate';
import Input from '@/components/input';
import { Query } from '@/constants';
import { useLocation } from 'react-router-dom';
import parseSearch from '@/utils/parse_search';
import { t } from '@/i18n';
import capitalize from '#/utils/capitalize';
import eventemitter, { EventType } from '../eventemitter';
import { useTheme } from '@/global_states/theme';

const style: CSSProperties = {
  // @ts-expect-error: existed css property
  WebkitAppRegion: 'no-drag',
  width: 180,
};

function Wrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { miniMode } = useTheme();

  const ref = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState(
    () => parseSearch<Query.KEYWORD>(location.search)[Query.KEYWORD] || '',
  );
  const onKeywordChange = (event: ChangeEvent<HTMLInputElement>) =>
    setKeyword(event.target.value);

  const onSearch = () => {
    if (miniMode) {
      return navigate({
        path: ROOT_PATH.PLAYER + PLAYER_PATH.SEARCH,
      });
    }

    return navigate({
      path: ROOT_PATH.PLAYER + PLAYER_PATH.SEARCH,
      query: {
        [Query.KEYWORD]: window.encodeURIComponent(
          keyword.replace(/\s+/g, ' ').trim(),
        ),
        [Query.PAGE]: 1,
      },
    });
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  useEffect(() => {
    const unlistenFocus = eventemitter.listen(
      EventType.FOCUS_SEARCH_INPUT,
      () => ref.current?.focus(),
    );
    return unlistenFocus;
  }, []);

  return (
    <Input
      ref={ref}
      style={style}
      type="search"
      value={keyword}
      onChange={onKeywordChange}
      onKeyDown={onKeyDown}
      placeholder={capitalize(t('search'))}
    />
  );
}

export default memo(Wrapper);
