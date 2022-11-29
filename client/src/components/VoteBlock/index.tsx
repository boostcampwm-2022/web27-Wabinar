import { BiX } from '@react-icons/all-files/bi/BiX';
import classNames from 'classnames/bind';
import React, { useState, useRef } from 'react';

import Button from '../common/Button';
import style from './style.module.scss';

const cx = classNames.bind(style);

interface Option {
  id: number;
  option: string;
}

const initialOption: Option[] = [
  { id: 1, option: '짜장면' },
  {
    id: 2,
    option: '짬뽕',
  },
];

function VoteBlock() {
  const [options, setOptions] = useState<Option[]>(initialOption);
  const [isUnRegisterd, setIsUnRegisterd] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const onRegister = () => {
    if (!options.length) throw new Error('투표 항목은 최소 1개에요 ^^');

    if (!isUnRegisterd) return;

    setIsUnRegisterd(false);
  };

  const onAdd = () => {
    if (!inputRef.current || !inputRef.current.value) return;

    const { value: option } = inputRef.current;

    const lastId = options.at(-1)?.id;
    const nextId = lastId !== undefined ? lastId + 1 : 0;
    const newOption: Option = { id: nextId, option };

    setOptions([...options, newOption]);

    inputRef.current.value = '';
  };

  const onDelete = (targetId: number) => {
    const filteredOptions = options.filter(
      (option) => option.id !== Number(targetId),
    );

    setOptions(filteredOptions);
  };

  const onClose = () => {
    alert('투표 종료..!');
    /**투표 결과 보여줘야함 */
    setIsUnRegisterd(true);
  };

  return (
    <div className={style['vote-container']}>
      <h3 className={style.title}>투표</h3>
      <ul>
        {options.map(({ id, option }, index) => (
          <li className={style['option-item']} key={id} id={id.toString()}>
            <div className={style['box-fill']}>{index + 1}</div>
            <p className={style.option}>{option}</p>
            {isUnRegisterd && (
              <div
                className={cx('box-fill', { 'position-right': true })}
                onClick={() => onDelete(id)}
              >
                <BiX size="20" />
              </div>
            )}
          </li>
        ))}
      </ul>
      {isUnRegisterd && (
        <div className={style['option-item']}>
          <div className={style['box-fill']}></div>
          <input
            ref={inputRef}
            className={style['option-input']}
            placeholder="항목을 입력해주세요"
          ></input>
        </div>
      )}
      <div className={style['vote-buttons']}>
        {isUnRegisterd ? (
          <>
            <Button onClick={onAdd} text="항목 추가" />
            <Button onClick={onRegister} text="투표 등록" />
          </>
        ) : (
          <Button onClick={onClose} text="투표 종료" />
        )}
      </div>
    </div>
  );
}

export default VoteBlock;
