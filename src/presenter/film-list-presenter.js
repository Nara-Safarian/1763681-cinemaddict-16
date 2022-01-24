import FilmsMenuView from '../view/films-template-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortingView from '../view/sort-view.js';
import NoFilmView from '../view/no-films.js';
import ShowMoreButtonView from '../view/showmore-button-view.js';
import FilmListContainerView from '../view/film-list-container-view';
import {RenderPosition, render, remove} from '../utils/render.js';
import {FILM_CARDS_PER_STEP} from '../consts.js';
import FilmPresenter from './film-presenter.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../consts.js';
import {sortDate, sortRating} from '../utils/task.js';

export default class FilmListPresenter {
  #mainContainer = null;

  #sortMenuComponent = new SortingView();
  #filmsListContainer = new FilmListContainerView();
  #filmsMenuComponent = new FilmsMenuView();
  #filmsListTitleComponent = new FilmsListView();
  #noFilmComponent = new NoFilmView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCardsList = [];
  #renderedFilmCardCount = FILM_CARDS_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedFilmCardsList = [];

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (filmCardsList) => {
    this.#filmCardsList = [...filmCardsList];
    this.#sourcedFilmCardsList = [...filmCardsList];

    this.#renderMenuSorting();
    this.#renderFilmsMenu();
    this.#renderFilmListTitle();
    this.#addFirstFilmCards();
  }

  #handlePopupModeChange = () => {
    this.#filmPresenter.forEach((filmCard) => filmCard.resetView());
  }

  #handleCardsChange = (updatedCard) => {
    this.#filmCardsList = updateItem(this.#filmCardsList, updatedCard);
    this.#sourcedFilmCardsList = updateItem(this.#sourcedFilmCardsList, updatedCard);
    this.#filmPresenter.get(updatedCard.id).init(updatedCard);
  }

  #sortFilmCards = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#filmCardsList.sort(sortDate);
        break;
      case SortType.RATING:
        this.#filmCardsList.sort(sortRating);
        break;
      default:
        this.#filmCardsList = [...this.#sourcedFilmCardsList];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilmCards(sortType);
    this.#clearFilmCardsList();
    this.#addFirstFilmCards();
  }

  #renderMenuSorting = () => {
    render(this.#mainContainer, this.#sortMenuComponent, RenderPosition.AFTERBEGIN);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderFilmsMenu = () => {
    render(this.#mainContainer, this.#filmsMenuComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmListTitle = () => {
    render(this.#filmsMenuComponent, this.#filmsListTitleComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsListContainer = () => {
    render(this.#filmsListTitleComponent, this.#filmsListContainer, RenderPosition.BEFOREEND);
  }

  #renderFilmCard = (filmListElement, filmCard, mainElement) => {
    const filmPresenter = new FilmPresenter(mainElement, filmListElement, this.#handleCardsChange, this.#handlePopupModeChange);
    filmPresenter.init(filmCard);
    this.#filmPresenter.set(filmCard.id, filmPresenter);
  }

  #addFirstFilmCards = () => {
    this.#renderFilmsListContainer();

    if (this.#filmCardsList.length === 0) {
      this.#renderEmptyView();
    } else {
      for (let i = 0, end = Math.min(this.#filmCardsList.length, FILM_CARDS_PER_STEP); i < end; i++) {
        this.#renderFilmCard(this.#filmsListContainer, this.#filmCardsList[i], this.#mainContainer);
      }

      this.#renderShowMoreButton();
    }
  }

  #addMoreFilmCards = (from, to) => {
    this.#filmCardsList
      .slice(from, to)
      .forEach((filmCard) => this.#renderFilmCard(this.#filmsListContainer, filmCard, this.#mainContainer));
  }

  #renderEmptyView = () => {
    render(this.#filmsMenuComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }


  #handleShowMoreButtonClick = () => {
    this.#addMoreFilmCards(this.#renderedFilmCardCount, this.#renderedFilmCardCount + FILM_CARDS_PER_STEP);
    this.#renderedFilmCardCount += FILM_CARDS_PER_STEP;

    if (this.#renderedFilmCardCount >= this.#filmCardsList.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    if (this.#filmCardsList.length > this.#renderedFilmCardCount) {
      render(this.#filmsListTitleComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  }

  #clearFilmCardsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCardCount = FILM_CARDS_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }
}
