export const FILM_CARDS_PER_STEP = 5;
export const COMMENT_LENGTH = 140;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const UserAction = {
  UPDATE_FILM_CARD: 'UPDATE_FILM_CARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
  STATISTICS: 'statistics',
};

export const GENRE = {
  'DRAMA': 'Drama',
  'THRILLER': 'Thriller',
  'ANIMATION': 'Animation',
  'ADVENTURE': 'Adventure',
  'FAMILY': 'Family',
  'SCI-FI': 'Sci-Fi',
  'ACTION': 'Action',
  'HORROR': 'Horror',
  'COMEDY': 'Comedy',
};

export const GENRES = Object.values(GENRE);

export const INTERVAL = {
  'ALL_TIME': 'all-time',
  'TODAY': 'today',
  'WEEK': 'week',
  'MONTH': 'month',
  'YEAR': 'year',
};
