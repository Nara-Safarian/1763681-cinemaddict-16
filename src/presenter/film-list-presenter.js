import FilmsMenuView from '../view/films-template-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortingView from '../view/sort-view.js';
import NoFilmView from '../view/no-films.js';
import ShowMoreButtonView from '../view/showmore-button-view.js';
import FilmListContainerView from '../view/film-list-container-view';
import {RenderPosition, render, remove} from '../utils/render.js';
import {FILM_CARDS_PER_STEP} from '../consts.js';
import FilmPresenter from './film-presenter.js';

export default class FilmListPresenter {
  #mainContainer = null;

  #sortMenuComponent = new SortingView();
  #filmsListContainer = new FilmListContainerView();
  #filmsMenuComponent = new FilmsMenuView();
  #filmsListTitleComponent = new FilmsListView();
  #noFilmComponent = new NoFilmView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #filmCardsList = [];
  #renderFilmCardsPerStep = FILM_CARDS_PER_STEP;

  constructor(mainContainer) {
    this.#mainContainer = mainContainer;
  }

  init = (filmCardsList) => {
    this.#filmCardsList = [...filmCardsList];

    this.#renderMenuSorting();
    this.#renderFilmsMenu();
    this.#renderFilmListTitle();
    this.#renderFilmCard();
  }

  #renderMenuSorting = () => {
    render(this.#mainContainer, this.#sortMenuComponent, RenderPosition.AFTERBEGIN);
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

  #renderPopup =  (filmListElement, filmCard, mainElement) => {
    const filmPresenter = new FilmPresenter(mainElement);
    filmPresenter.init(filmListElement, filmCard);
  }

  #renderFilmCard = () => {
    this.#renderFilmsListContainer();

    if (this.#filmCardsList.length === 0) {
      this.#renderNoFilms();
    } else {
      for (let i = 0, end = Math.min(this.#filmCardsList.length, FILM_CARDS_PER_STEP); i < end; i++) {
        this.#renderPopup(this.#filmsListContainer, this.#filmCardsList[i], this.#mainContainer);
      }

      this.#renderShowMoreButton();
    }
  }

  #renderFilmCards = (from, to) => {
    this.#filmCardsList
      .slice(from, to)
      .forEach((filmCard) => this.#renderPopup(this.#filmsListContainer, filmCard, this.#mainContainer));
  }

  #renderNoFilms = () => {
    render(this.#filmsMenuComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }


  #handleShowMoreButtonClick = () => {
    this.#renderFilmCards(this.#renderFilmCardsPerStep, this.#renderFilmCardsPerStep + FILM_CARDS_PER_STEP);
    this.#renderFilmCardsPerStep += FILM_CARDS_PER_STEP;

    if (this.#renderFilmCardsPerStep >= this.#filmCardsList.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    if (this.#filmCardsList.length > this.#renderFilmCardsPerStep) {
      render(this.#filmsListTitleComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  }
}
