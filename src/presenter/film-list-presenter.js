import FilmsMenuView from '../view/films-template-view.js';
import FilmsListView from '../view/films-list-view.js';
import SortingView from '../view/sort-view.js';
import NoFilmView from '../view/no-films.js';
import ShowMoreButtonView from '../view/showmore-button-view.js';
import FilmListContainerView from '../view/film-list-container-view';
import {RenderPosition, render, remove} from '../utils/render.js';
import {FILM_CARDS_PER_STEP} from '../consts.js';
import FilmPresenter, {State as FilmPresenterViewState} from './film-presenter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../consts.js';
import {sortDate, sortRating} from '../utils/task.js';
import {filter} from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';

export default class FilmListPresenter {
  #mainContainer = null;
  #filmCardsModel = null;
  #filterModel = null;

  #sortMenuComponent = null;
  #filmsListContainer = new FilmListContainerView();
  #filmsMenuComponent = new FilmsMenuView();
  #filmsListTitleComponent = new FilmsListView();
  #loadingComponent = new LoadingView();
  #noFilmComponent = null;
  #showMoreButtonComponent = null;

  #renderedFilmCardCount = FILM_CARDS_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentPopupFilmCardId = null;
  #currentPopupScrollTop = 0;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(mainContainer, filmCardsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#filterModel = filterModel;

    this.#filmCardsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filmCards() {
    this.#filterType = this.#filterModel.filter;
    const filmCards = this.#filmCardsModel.filmCards;
    const filteredFilmCards = filter[this.#filterType](filmCards);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilmCards.sort(sortDate);
      case SortType.RATING:
        return filteredFilmCards.sort(sortRating);
    }
    return filteredFilmCards;
  }

  get comments() {
    return this.#filmCardsModel.comments;
  }

  init = () => {
    render(this.#mainContainer, this.#filmsListContainer, RenderPosition.BEFOREEND);
    render(this.#filmsListContainer, this.#filmsMenuComponent, RenderPosition.BEFOREEND);

    this.#renderFilmsMenu();
    this.#renderFilmListTitle();
    this.#addFirstFilmCards();
  }

  #onPopupOpen = (filmCard) => {
    this.#currentPopupFilmCardId = filmCard.id;
    this.#filmCardsModel.getComments(filmCard);
  }

  #onPopupClose = () => {
    this.#currentPopupFilmCardId = null;
    this.#currentPopupScrollTop = 0;
  }

  #onDestroyOpenedPopup = (currentPopupScrollTop) => {
    this.#currentPopupScrollTop = currentPopupScrollTop;
  }

  #handlePopupModeChange = () => {
    this.#filmPresenter.forEach((filmCard) => filmCard.resetView());
  }

  #handleViewAction = async(actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CARD:
        this.#filmPresenter.get(update.id).setViewState(FilmPresenterViewState.UPDATING);
        try {
          await this.#filmCardsModel.updateFilmCard(updateType, update);
        } catch (e) {
          this.#filmPresenter.get(update.id).setViewState(FilmPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_COMMENT:
        this.#filmPresenter.get(update.movieId).setViewState(FilmPresenterViewState.ADDING_COMMENT);
        try {
          await this.#filmCardsModel.addComment(updateType, update);
        } catch (e) {
          this.#filmPresenter.get(update.movieId).setViewState(FilmPresenterViewState.ABORTING);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmPresenter.get(update.filmCard.id).setViewState(FilmPresenterViewState.DELETING);
        try {
          await this.#filmCardsModel.deleteComment(updateType, update);
        } catch (e) {
          this.#filmPresenter.get(update.filmCard.id).setViewState(FilmPresenterViewState.ABORTING);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data, this.comments);
        break;
      case UpdateType.MINOR:
        this.#clearFilmsBoard();
        this.#addFirstFilmCards();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsBoard({resetRenderedFilmCount: true, resetSortType: true});
        if (data) {
          this.#addFirstFilmCards();
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#addFirstFilmCards();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsBoard({resetRenderedFilmCount: true});
    this.#addFirstFilmCards();
  }

  #renderLoading = () => {
    render(this.#mainContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #renderMenuSorting = () => {
    this.#sortMenuComponent = new SortingView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

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

  #renderFilmCard = (filmCard) => {
    const filmPresenter = new FilmPresenter(
      this.#mainContainer,
      this.#filmsListContainer,
      this.#handleViewAction,
      this.#handlePopupModeChange,
      () => this.#onPopupOpen(filmCard),
      this.#onPopupClose,
      this.#onDestroyOpenedPopup
    );
    filmPresenter.init(filmCard, this.comments);
    this.#filmPresenter.set(filmCard.id, filmPresenter);
  }

  #clearFilmsBoard = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortMenuComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCardCount = FILM_CARDS_PER_STEP;
    } else {
      const filmCardsCount = this.filmCards.length;
      this.#renderedFilmCardCount = Math.min(filmCardsCount, this.#renderedFilmCardCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #addFirstFilmCards = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const filmCardsCount = this.filmCards.length;
    const filmCards = this.filmCards.slice(0, Math.min(filmCardsCount, this.#renderedFilmCardCount));
    if (filmCardsCount > 0) {
      this.#renderMenuSorting();
    }

    this.#renderFilmsListContainer(filmCards);

    if (filmCardsCount === 0) {
      this.#renderEmptyView();
      return;
    }

    for (let i = 0, end = Math.min(filmCardsCount, this.#renderedFilmCardCount); i < end; i++) {
      this.#renderFilmCard(filmCards[i]);
    }

    this.#renderShowMoreButton();

    if (this.#currentPopupFilmCardId) {
      const openedFilmCard = this.#filmPresenter.get(this.#currentPopupFilmCardId);
      if (openedFilmCard) {
        openedFilmCard.showPopup(this.#currentPopupScrollTop);
      }
    }
  }

  #addMoreFilmCards = (filmCards) => {
    filmCards.forEach((filmCard) => this.#renderFilmCard(filmCard));
  }

  #renderEmptyView = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);
    render(this.#filmsMenuComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #handleShowMoreButtonClick = () => {
    const filmCardsCount = this.filmCards.length;
    const newRenderedFilmCardCount = Math.min(filmCardsCount, this.#renderedFilmCardCount + FILM_CARDS_PER_STEP);
    const filmCards = this.filmCards.slice(this.#renderedFilmCardCount, newRenderedFilmCardCount);

    this.#addMoreFilmCards(filmCards);
    this.#renderedFilmCardCount = newRenderedFilmCardCount;

    if (this.#renderedFilmCardCount >= filmCardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    const filmCardsCount = this.filmCards.length;

    if (filmCardsCount > this.#renderedFilmCardCount) {
      render(this.#filmsListTitleComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
    }
  }
}
