import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-details-popup-view.js';
import {RenderPosition, render} from '../utils/render.js';
import {onEscKeyDown} from '../utils/task.js';

export  default class FilmPresenter {
  #popupContainer = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  constructor(mainElement) {
    this.#popupContainer = mainElement;
  }

  init = (filmListElement, filmCard) => {
    this.#filmComponent = new FilmCardView(filmCard);
    this.#filmPopupComponent = new FilmPopupView(filmCard);

    this.#filmComponent.setReplaceFilmCardtoPopup(this.#handleOpenPopup);
    this.#filmPopupComponent.setReplacePopupToFilmCard(this.#handleReturnToFilmCards);

    render(filmListElement, this.#filmComponent, RenderPosition.BEFOREEND);
  }

  #handleOpenPopup = () => {
    this.#replaceFilmCardToPopup();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onKeyDownDocument);
  }

  #handleReturnToFilmCards = () => {
    this.#replacePopupToFilmCard();
    document.removeEventListener('keydown', this.#onKeyDownDocument);
    document.body.classList.remove('hide-overflow');
  }

  #replaceFilmCardToPopup = () => {
    this.#popupContainer.appendChild(this.#filmPopupComponent.element);
  }

  #replacePopupToFilmCard = () => {
    this.#popupContainer.removeChild(this.#filmPopupComponent.element);
  }

  #onKeyDownDocument = (evt) => {
    onEscKeyDown(evt, this.#popupContainer, this.#filmPopupComponent.element);
    document.removeEventListener('keydown', this.#onKeyDownDocument);
    document.body.classList.remove('hide-overflow');
  }
}
