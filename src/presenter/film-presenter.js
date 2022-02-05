import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import {RenderPosition, render, remove, replace} from '../utils/render.js';
import {isEscapeKey} from '../utils/task.js';
import {UserAction, UpdateType} from '../consts.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  OPENED: 'OPENED',
};

export const State = {
  UPDATING: 'UPDATING',
  DELETING: 'DELETING',
  ADDING_COMMENT: 'ADDING_COMMENT',
  ABORTING: 'ABORTING',
};

export default class FilmPresenter {
  #mainElement = null;
  #changeData = null;
  #changeMode = null;
  #popupOpen = null;
  #popupClose = null;
  #onDestroyOpenedPopup = null;

  #filmComponent = null;
  #filmPopupComponent = null;
  #filmCard = null;
  #mode = Mode.DEFAULT

  #filmListElement = null;
  #currentScrollTop = 0;

  constructor(mainElement, filmListElement, changeData, changeMode, popupOpen, popupClose, onDestroyOpenedPopup) {
    this.#mainElement = mainElement;
    this.#filmListElement = filmListElement;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#popupOpen = popupOpen;
    this.#popupClose = popupClose;
    this.#onDestroyOpenedPopup = onDestroyOpenedPopup;
  }

  init = (filmCard, comments) => {
    this.#filmCard = filmCard;
    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(filmCard);
    this.#filmComponent.setReplaceFilmCardtoPopup(this.#handleOpenPopup);
    this.#filmComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#filmComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#filmComponent.setAddToFavouritesClickHandler(this.#handleAddToFavouritesClick);

    this.#filmPopupComponent = new FilmPopupView(filmCard, comments);
    this.#filmPopupComponent.setReplacePopupToFilmCard(this.#handleReturnToFilmCards);
    this.#filmPopupComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#filmPopupComponent.setMarkAsWatchedClickHandler(this.#handleMarkAsWatchedClick);
    this.#filmPopupComponent.setAddToFavouritesClickHandler(this.#handleAddToFavouritesClick);
    this.#filmPopupComponent.setDeleteCommentClickHandler(this.#handleCommentDeleteClick);
    this.#filmPopupComponent.setCommentSubmitHandler(this.#handleCommentSubmit);


    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListElement, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mainElement.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mainElement.contains(prevFilmPopupComponent.element)) {
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      this.#filmPopupComponent.element.scrollTop = this.#currentScrollTop;
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  destroy = () => {
    if (this.#mode === Mode.OPENED) {
      const scrollTop = this.#filmPopupComponent.element.scrollTop;
      this.#onDestroyOpenedPopup(scrollTop);
    }

    document.removeEventListener('keydown', this.#onKeyDownDocument);
    remove(this.#filmPopupComponent);
    remove(this.#filmComponent);
  }

  setAborting = () => {
    this.#filmComponent.shake();
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      if (state === State.ABORTING) {
        this.setAborting();
      }
      return;
    }

    const resetFormState = () => {
      this.#filmPopupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.ADDING_COMMENT:
      case State.UPDATING:
        this.#filmPopupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this.#filmPopupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#filmComponent.shake(resetFormState);
        this.#filmPopupComponent.shake(resetFormState);
        break;
    }
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#handleReturnToFilmCards();
    }
  }

  showPopup = (scrollTop = 0) => {
    this.#handleOpenPopup();
    this.#filmPopupComponent.element.scrollTop = scrollTop;
    this.#currentScrollTop = scrollTop;
  }

  #handleOpenPopup = () => {
    this.#changeMode();
    this.#popupOpen();
    this.#mainElement.appendChild(this.#filmPopupComponent.element);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onKeyDownDocument);
    this.#mode = Mode.OPENED;
  }

  #handleAddToWatchlistClick = () => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.MINOR,
      {...this.#filmCard, isInWatchlist: !this.#filmCard.isInWatchlist},
    );
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleMarkAsWatchedClick = () => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.MINOR,
      {...this.#filmCard, isWatched: !this.#filmCard.isWatched},
    );
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleAddToFavouritesClick = () => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    this.#changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.MINOR,
      {...this.#filmCard, isFavourite: !this.#filmCard.isFavourite},
    );
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleCommentDeleteClick = async(data) => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    await this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      data,
    );
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleCommentSubmit = async(movieId, comment) => {
    const scrollTop = this.#filmPopupComponent.element.scrollTop;
    await this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {movieId, comment},
    );
    this.#filmPopupComponent.element.scrollTop = scrollTop;
  }

  #handleReturnToFilmCards = () => {
    this.#popupClose();
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
