export const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
export const isEnterKey= (evt) => evt.key === 'Enter';
export const sortDate = (dateA, dateB) => dateB.releaseDate - dateA.releaseDate;
export const sortRating = (ratingA, ratingB) => ratingB.rating - ratingA.rating;
