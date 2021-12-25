export const isEscapeKey = (evt) => evt.key === 'Escape';

export const onEscKeyDown = (evt, parent, child) => {
  if ((evt.key === 'Escape' || evt.key === 'Esc')) {
    evt.preventDefault();
    parent.removeChild(child);
  }
};
