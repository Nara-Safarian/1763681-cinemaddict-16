export const getUserRank = (filmCards) => {
  const watchedFilmsCount = filmCards.reduce((counter, filmCard) => {
    if (filmCard.isWatched) {
      return counter + 1;
    }
    return counter;
  }, 0);

  if (watchedFilmsCount > 20) {
    return 'Movie buff';
  }
  if (watchedFilmsCount > 10) {
    return 'Fan';
  }
  if (watchedFilmsCount > 0) {
    return 'Novice';
  }
  return '';
};

