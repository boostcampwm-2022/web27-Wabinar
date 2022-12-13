import { BiX } from '@react-icons/all-files/bi/BiX';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import classNames from 'classnames/bind';
import Button from 'common/Button';
import { ChangeEventHandler, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { VoteMode } from 'src/constants/block';
import useSocketContext from 'src/hooks/context/useSocketContext';
import useUserContext from 'src/hooks/context/useUserContext';
import useDebounceInput from 'src/hooks/useDebounceInput';
import { Option } from 'src/types/block';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface VoteBlockProps {
  id: string;
  mode: VoteMode;
  setVoteMode: React.Dispatch<React.SetStateAction<VoteMode>>;
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}

function VoteBlockTemplate({
  id,
  mode,
  setVoteMode,
  options,
  setOptions,
}: VoteBlockProps) {
  const [isCreateMode, isRegisteringMode, isRegisteredMode, isEndMode] = [
    mode === VoteMode.CREATE,
    mode === VoteMode.REGISTERING,
    mode === VoteMode.REGISTERED,
    mode === VoteMode.END,
  ];

  const { user } = useUserContext();
  const { momSocket: socket } = useSocketContext();

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  const debouncedSetOptions = useDebounceInput(setOptions);

  const getNextId = () => {
    const lastId = options.at(-1)?.id;
    return lastId !== undefined ? lastId + 1 : 0;
  };

  const getIsDuplicate = (arr: string[]) => {
    return new Set(arr).size !== arr.length;
  };

  const onRegister = () => {
    const validOptions = options.filter(({ text }) => text);
    if (!validOptions.length) {
      return toast('투표 항목은 최소 1개에요 ^^', { type: 'info' });
    }

    const isDuplicate = getIsDuplicate(validOptions.map(({ text }) => text));
    if (isDuplicate) {
      return toast('중복된 항목이 있어요 ^^', { type: 'info' });
    }

    setOptions(validOptions);
    setVoteMode(VoteMode.REGISTERED);

    socket.emit(BLOCK_EVENT.REGISTER_VOTE, id, validOptions);

    toast('투표 등록 완료 ^^', { type: 'info' });
  };

  const onAdd = () => {
    const nextId = getNextId();
    const newOption: Option = { id: nextId, text: '', count: 0 };
    setOptions([...options, newOption]);
  };

  const onDelete = (targetId: number) => {
    const filteredOptions = options.filter(
      (option) => option.id !== Number(targetId),
    );

    setOptions(filteredOptions);
  };

  const onEnd = () => {
    socket.emit(BLOCK_EVENT.END_VOTE, id);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { id } = target.dataset;
    const value = target.value;

    const newOption = options.map((option) => {
      if (option.id === Number(id)) {
        return { ...option, text: value };
      }
      return option;
    });

    debouncedSetOptions(newOption);
  };

  const onSelect = (targetId: number) => {
    if (!isRegisteredMode) return;

    setSelectedOptionId(targetId);

    socket.emit(BLOCK_EVENT.UPDATE_VOTE, id, targetId, user?.id);
  };

  useEffect(() => {
    socket.on(`${BLOCK_EVENT.UPDATE_VOTE}-${id}`, (participantCount) => {
      setParticipantCount(participantCount);
    });

    socket.on(
      `${BLOCK_EVENT.END_VOTE}-${id}`,
      ({ options, participantCount }) => {
        setVoteMode(VoteMode.END);
        setOptions(options);
        setParticipantCount(participantCount);
        toast('투표가 종료되었어요 ^^');
      },
    );

    return () => {
      socket.off(BLOCK_EVENT.UPDATE_VOTE);
      socket.off(BLOCK_EVENT.END_VOTE);
    };
  }, [setParticipantCount]);

  const getPercent = (count: number) => {
    return (count / participantCount) * 100;
  };

  const getVoteResultText = (count: number) => {
    return `(${count}/${participantCount}) ${getPercent(count).toFixed(2)}%`;
  };

  return (
    <div className={style['vote-container']}>
      <h3 className={style.title}>{'투표'}</h3>
      {(isRegisteredMode || isEndMode) && (
        <span className={style['participant-cnt']}>
          {participantCount}명 참여
        </span>
      )}
      {
        <ul>
          {isCreateMode ? (
            <li className={style['option-item']}>
              <div className={style['box-fill']}>{'^^'}</div>
              <div>등록될 때까지 기다려주세요</div>
            </li>
          ) : (
            options.map(({ id, text, count }, index) => (
              <li
                className={cx('option-item', {
                  'selected-item':
                    (isRegisteredMode || isEndMode) && id === selectedOptionId,
                })}
                key={id}
                onClick={() => onSelect(id)}
              >
                {isEndMode && (
                  <div
                    className={style['vote-result-bar']}
                    style={{
                      width: `${getPercent(count)}%`,
                      backgroundColor: color.highlight100,
                    }}
                  ></div>
                )}

                <div className={style['box-fill']}>{index + 1}</div>
                <input
                  type="text"
                  className={cx('option-input', {
                    selected: isRegisteredMode,
                  })}
                  placeholder="항목을 입력해주세요"
                  onChange={onChange}
                  data-id={id}
                  readOnly={isRegisteredMode || isEndMode}
                  defaultValue={text}
                />
                {isRegisteringMode && (
                  <Button
                    icon={<BiX size="20" color="white" />}
                    ariaLabel="항목 삭제"
                    onClick={() => onDelete(id)}
                  />
                )}
                {isEndMode && (
                  <div className={style['vote-result-text']}>
                    {getVoteResultText(count)}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      }
      <div className={style['vote-buttons']}>
        {isRegisteringMode && (
          <>
            <Button onClick={onAdd} text="항목 추가" />
            <Button onClick={onRegister} text="투표 등록" />
          </>
        )}
        {isRegisteredMode && <Button onClick={onEnd} text="투표 종료" />}
        {isEndMode && <Button text="투표 초기화" />}
      </div>
    </div>
  );
}

export default VoteBlockTemplate;
