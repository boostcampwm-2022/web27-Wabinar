export function debounce<T>(callback: (arg: T) => void, time: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function (arg: T) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(arg), time);
  };
}
