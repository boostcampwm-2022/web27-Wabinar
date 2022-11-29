import { BiCheckbox } from '@react-icons/all-files/bi/BiCheckbox';
import { BiCheckboxChecked } from '@react-icons/all-files/bi/BiCheckboxChecked';
import classNames from 'classnames/bind';
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

  const toggleQuestion = (question: Question): Question => {
    /** TODO api 붙이기 */
    question.isDone = !question.isDone;
    return question;
  };

  const createQuestion = (question: string) => {
    /** TODO api 붙이기 */
    const lastId = questions.at(-1)?.id;

    const nextId = lastId !== undefined ? lastId + 1 : 0;

    const newQuestion = {
      id: nextId,
      isDone: false,
      question,
    };

    setQuestions([...questions, newQuestion]);
  };

  const onClick: React.MouseEventHandler<HTMLLIElement> = (e) => {
    const { id: targetId } = e.currentTarget;

    const nextQuestions = questions.map((question) =>
      question.id === Number(targetId) ? toggleQuestion(question) : question,
    );

    setQuestions(nextQuestions);
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
        {questions.map(({ id, isDone, question }) => (
          <li
            className={style['question-item']}
            onClick={onClick}
            key={id}
            id={id.toString()}
          >
            {isDone ? (
              <BiCheckboxChecked className={cx('check-box', { check: true })} />
            ) : (
              <BiCheckbox className={style['check-box']} />
            )}
            <p className={cx(question, { check: isDone })}>{question}</p>
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
