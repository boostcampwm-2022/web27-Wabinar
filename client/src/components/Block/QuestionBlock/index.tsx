import { BiCheckbox } from '@react-icons/all-files/bi/BiCheckbox';
import { BiCheckboxChecked } from '@react-icons/all-files/bi/BiCheckboxChecked';
import { BLOCK_EVENT } from '@wabinar/constants/socket-message';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import useSocketContext from 'src/hooks/context/useSocketContext';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface Question {
  id: number;
  isResolved: boolean;
  text: string;
}

interface QuestionBlockProps {
  id: string;
}

function QuestionBlock({ id }: QuestionBlockProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { momSocket: socket } = useSocketContext();

  const createQuestion = (questionText: string) => {
    const lastId = questions.at(-1)?.id;
    const nextId = lastId !== undefined ? lastId + 1 : 0;

    const question = {
      id: nextId,
      isResolved: false,
      text: questionText,
    };

    socket.emit(BLOCK_EVENT.ADD_QUESTIONS, id, question);
  };

  useEffect(() => {
    socket.on(`${BLOCK_EVENT.FETCH_QUESTIONS}-${id}`, (fetchedQuestions) => {
      setQuestions(fetchedQuestions ? [...fetchedQuestions] : []);
    });

    socket.on(`${BLOCK_EVENT.ADD_QUESTIONS}-${id}`, (questionToAdd) => {
      setQuestions((prev) => [...prev, questionToAdd]);
    });

    socket.emit(BLOCK_EVENT.FETCH_QUESTIONS, id);

    return () => {
      socket.off(`${BLOCK_EVENT.FETCH_QUESTIONS}-${id}`);
      socket.off(`${BLOCK_EVENT.ADD_QUESTIONS}-${id}`);
    };
  }, []);

  const onClick: React.MouseEventHandler<HTMLLIElement> = (e) => {
    const targetId = Number(e.currentTarget.id);

    const toggledQuestions = questions.map((q) => {
      if (q.id === targetId) {
        q.isResolved = !q.isResolved;
      }
      return q;
    });

    setQuestions(toggledQuestions);

    socket.emit(BLOCK_EVENT.RESOLVE_QUESTIONS, id, toggledQuestions);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const target = e.target as HTMLInputElement;
    const { value: question } = target;

    if (!question || e.nativeEvent.isComposing) return;

    createQuestion(question);
    target.value = '';
  };

  return (
    <div className={style['question-container']}>
      <h3 className={style.title}>질문 리스트</h3>
      <ul>
        {questions.map(({ id, isResolved, text: questionText }) => (
          <li
            className={style['question-item']}
            onClick={onClick}
            key={id}
            id={id.toString()}
          >
            {isResolved ? (
              <BiCheckboxChecked className={cx('check-box', { check: true })} />
            ) : (
              <BiCheckbox className={style['check-box']} />
            )}
            <p className={cx(questionText, { check: isResolved })}>
              {questionText}
            </p>
          </li>
        ))}
      </ul>
      <input
        className={style['question-input']}
        onKeyDown={onKeyDown}
        placeholder="항목을 입력해주세요"
      />
    </div>
  );
}

export default QuestionBlock;
