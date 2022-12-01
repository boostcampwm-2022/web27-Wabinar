interface Question {
  id: number;
  isResolved: boolean;
  text: string;
}

// TODO: db 사용으로 바꾸기, 지금은 메모리 사용
const questions: Question[] = [];

export function fetch() {
  return questions;
}

export function add(question: Question) {
  questions.push(question);
}

export function toggleResolved(id: number, resolved: boolean) {
  // TODO: 일일이 id를 찾는 것보다 더 좋은 방법이 있으면 고치기
  const targetIdx = questions.findIndex((item) => item.id === id);

  questions[targetIdx].isResolved = resolved;
}
