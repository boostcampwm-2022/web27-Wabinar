import { BiX } from '@react-icons/all-files/bi/BiX';
import classNames from 'classnames/bind';
import { ChangeEventHandler, useState } from 'react';
import { toast } from 'react-toastify';
import useDebounceInput from 'src/hooks/useDebounceInput';

import Button from '../common/Button';
import style from './style.module.scss';

const cx = classNames.bind(style);

interface Option {
  id: number;
  text: string;
}

const initialOption: Option[] = [{ id: 1, text: '' }];

function VoteBlock() {
  const [options, setOptions] = useState<Option[]>(initialOption);
  const [isStartedVote, setIsStartedVote] = useState<boolean>(false);

  const getNextId = () => {
    const lastId = options.at(-1)?.id;
    return lastId !== undefined ? lastId + 1 : 0;
  };

  const onRegister = () => {
    const slicedEmptyOptions = options.filter(({ text }) => text);

    if (!slicedEmptyOptions.length) {
      return toast('투표 항목은 최소 1개에요 ^^', { type: 'info' });
    }

    setOptions(slicedEmptyOptions);
    setIsStartedVote(true);
  };

  const onAdd = () => {
    const nextId = getNextId();
    const newOption: Option = { id: nextId, text: '' };
    setOptions([...options, newOption]);
  };

  const onDelete = (targetId: number) => {
    const filteredOptions = options.filter(
      (option) => option.id !== Number(targetId),
    );

    setOptions(filteredOptions);
  };

  const onEnd = () => {
    toast('투표가 종료되었어요 ^^');
    setIsStartedVote(false);
  };

  const debouncedSetOptions = useDebounceInput(setOptions);

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

  return (
    <div className={style['vote-container']}>
      <h3 className={style.title}>투표</h3>
      <ul>
        {options.map(({ id }, index) => (
          <li className={style['option-item']} key={id} data-id={id}>
            <div className={style['box-fill']}>{index + 1}</div>
            <input
              type="text"
              placeholder="항목을 입력해주세요"
              onChange={onChange}
              data-id={id}
            />
            {!isStartedVote && (
              <div
                className={cx('box-fill', 'position-right')}
                onClick={() => onDelete(id)}
              >
                <BiX size="20" />
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className={style['vote-buttons']}>
        {isStartedVote ? (
          <Button onClick={onEnd} text="투표 종료" />
        ) : (
          <>
            <Button onClick={onAdd} text="항목 추가" />
            <Button onClick={onRegister} text="투표 등록" />
          </>
        )}
      </div>
    </div>
  );
}

export default VoteBlock;
