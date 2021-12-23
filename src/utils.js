export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (min, max) => {
  const randomDigit = Math.random() * (max - min) + min;
  return Math.round(randomDigit * 10) / 10;
};

export const isEscapeKey = (evt) => evt.key === 'Escape';

export const onEscKeyDown = (evt, parent, child) => {
  if ((evt.key === 'Escape' || evt.key === 'Esc')) {
    evt.preventDefault();
    parent.removeChild(child);
  }
};
