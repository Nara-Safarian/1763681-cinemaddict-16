import {FilterType} from '../consts';

export const filter = {
  [FilterType.ALL]: (filmCards) => filmCards.filter((filmCard) => filmCard),
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.isInWatchlist),
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.isWatched),
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.isFavourite),
};
