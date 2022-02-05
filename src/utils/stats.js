const NOVICE_EDGE = 0;
const FAN_EDGE = 10;
const MOVIE_BUFF_EDGE = 20;

export const getUserRank = (filmCards) => {
  const watchedFilmsCount = filmCards.reduce((counter, filmCard) => {
    if (filmCard.isWatched) {
      return counter + 1;
    }
    return counter;
  }, 0);

  if (watchedFilmsCount > MOVIE_BUFF_EDGE) {
    return 'Movie buff';
  }
  if (watchedFilmsCount > FAN_EDGE) {
    return 'Fan';
  }
  if (watchedFilmsCount > NOVICE_EDGE) {
    return 'Novice';
  }
  return '';
};

