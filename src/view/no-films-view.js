import AbstractView from './abstract-view.js';
import {FilterType} from '../consts.js';

const NoFilmCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (filterType) => {
  const noFilmCardsValue = NoFilmCardsTextType[filterType];
  return (
    `<section class="films-list">
      <h2 class="films-list__title">${noFilmCardsValue}</h2>
    </section>`
  );
};

export default class NoFilmView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template () {
    return createNoFilmsTemplate(this._data);
  }
}
