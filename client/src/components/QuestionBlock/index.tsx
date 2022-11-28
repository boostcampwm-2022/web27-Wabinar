import { BiCheckbox } from '@react-icons/all-files/bi/BiCheckbox';
import { BiCheckboxChecked } from '@react-icons/all-files/bi/BiCheckboxChecked';
import classNames from 'classnames/bind';
import { check } from 'prettier';
import React, { useState } from 'react';

import style from './style.module.scss';

const cx = classNames.bind(style);

interface Question {
  id: number;
  isDone: boolean;
  question: string;
}

const initialQuestion: Question[] = [
  {
    id: 1,
    isDone: true,
    question: 'REACT가 뭔가요?',
  },
  {
    id: 2,
    isDone: false,
    question: '오늘의 안건은 뭔가요?',
  },
];

function QuestionBlock() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestion);
  const [input, setInput] = useState<string>('');

  const onClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const { questionId: targetId } = e.currentTarget.dataset;

    const nextQuestions = questions.map((question) => {
      if (question.id === Number(targetId)) {
        question.isDone = !question.isDone;
      }
      return question;
    });

    setQuestions(nextQuestions);
  };

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setInput(target.value);
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const target = e.target as HTMLInputElement;
      const { value: question } = target;
      if (question) {
        createQuestion(question);
        setInput('');
      }
    }
  };

  const createQuestion = (question: string) => {
    const nextId = questions.at(-1)?.id;

    setQuestions([
      ...questions,
      {
        id: nextId !== undefined ? nextId + 1 : 0,
        isDone: false,
        question,
      },
    ]);
  };

  return (
    <div className={style['question-container']}>
      <h3 className={style.title}>질문 리스트</h3>
      <ul>
        {questions.map(({ id, isDone, question }) => (
          <li
            className={style['question-item']}
            onClick={onClick}
            key={id}
            data-question-id={id}
          >
            {isDone ? (
              <BiCheckboxChecked className={cx('check-box', { check })} />
            ) : (
              <BiCheckbox className={style['check-box']} />
            )}
            <p className={cx(question, { check: isDone })}>{question}</p>
          </li>
        ))}
      </ul>
      <input
        className={style['question-input']}
        onInput={onInput}
        onKeyDown={onKeyDown}
        placeholder="항목을 입력해주세요"
        value={input}
      ></input>
    </div>
  );
}

export default QuestionBlock;
