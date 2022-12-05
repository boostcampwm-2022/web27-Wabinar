import React from 'react';

export const debounce = (
  handler: React.EventHandler<React.SyntheticEvent>,
  delay: number,
): React.EventHandler<React.SyntheticEvent> => {
  let timer: NodeJS.Timeout;

  return (e: React.SyntheticEvent) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(handler, delay, e);
  };
};
