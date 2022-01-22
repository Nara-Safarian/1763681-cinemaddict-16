import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-details-popup-view.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {isEscapeKey} from '../utils/task.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export  default class FilmPresenter {
  #mainElement = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmPopupComponent = null;
  #filmCard = null;
  #mode = Mode.DEFAULT

  #filmListElement = null;

  constructor(mainElement, filmListElement, changeData, changeMode) {
    this.#mainElement = mainElement;
    this.#filmListElement = filmListElement;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (filmCard) => {
    this.#filmCard = filmCard;
    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmPopupView(filmCard);

    this.#filmComponent.setReplaceFilmCardtoPopup(this.#handleOpenPopup);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#filmComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#filmComponent.setAddToFavouritesClickHandler(this.#handleAddToFavouritesClick);
    this.#filmPopupComponent.setReplacePopupToFilmCard(this.#handleReturnToFilmCards);
    this.#filmPopupComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#filmPopupComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#filmPopupComponent.setAddToFavouritesClickHandler(this.#handleAddToFavouritesClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListElement, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mainElement.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mainElement.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleReturnToFilmCards();
    }
  }

  #handleOpenPopup = () => {
    this.#changeMode();
    this.#mainElement.appendChild(this.#filmPopupComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onKeyDownDocument);
    this.#mode = Mode.OPENED;
  }

  #handleAddToWatchlistClick = () => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    this.#changeData({...this.#filmCard, isInWatchlist: !this.#filmCard.isInWatchlist});
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleMarkAsWatchedClick = () => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    this.#changeData({...this.#filmCard, isWatched: !this.#filmCard.isWatched});
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleAddToFavouritesClick = () => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    this.#changeData({...this.#filmCard, isFavourite: !this.#filmCard.isFavourite});
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleReturnToFilmCards = () => {
    this.#filmPopupComponent.reset(this.#filmCard);
    this.#mainElement.removeChild(this.#filmPopupComponent.element);
    document.removeEventListener('keydown', this.#onKeyDownDocument);
    document.body.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
  }

  #onKeyDownDocument = (evt) => {
    if (!isEscapeKey(evt)) {
      return;
    }

    evt.preventDefault();
    this.#filmPopupComponent.reset(this.#filmCard);
    this.#handleReturnToFilmCards();
  }
}
