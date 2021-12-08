const navigationFiltersMap = {
  Watchlist: (films) => films.filter((film) => film.isInWatchlist).length,
  History: (films) => films.filter((film) => film.isWatched).length,
  Favourites: (films) => films.filter((film) => film.isFavourite).length
};

export const generateFilter = (films) => Object.entries(navigationFiltersMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(films),
  }),
);

