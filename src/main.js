import FilmCardView from './view/film-card-view.js';
import FilmPopupView from './view/film-details-popup-view.js';
import FilmsMenuView from './view/films-template-view.js';
import NavigationView from './view/navigation-view.js';
import ShowMoreButtonView from './view/showmore-button-view.js';
import SortingView from './view/sort-view.js';
import UserProfileView from './view/user-profile-view.js';
import FooterStatisticsView from './view/footer.js';
import {generateFilmCard} from './mock/film-card.js';
import {FILM_CARDS, FILM_CARDS_PER_STEP} from './consts.js';
import {generateFilter} from './mock/filter.js';
import {RenderPosition, render} from './render.js';
import FilmsListView from './view/films-list-view.js';
import FilmListContainerView from './view/film-list-container-view';

const filmCards = Array.from({length: FILM_CARDS}, generateFilmCard);
const filters = generateFilter(filmCards);

const renderFilmCards = (filmListElement, filmCard, mainElement) => {
  const filmComponent = new FilmCardView(filmCard);
  const filmPopupComponent = new FilmPopupView(filmCard);

  const appendPopup = () => {
    mainElement.appendChild(filmPopupComponent.element);
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    appendPopup();
    document.body.classList.add('hide-overflow');
  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    mainElement.removeChild(filmPopupComponent.element);
    document.body.classList.remove('hide-overflow');
  });

  render(filmListElement, filmComponent.element, RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView().element, RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new NavigationView(filters).element, RenderPosition.AFTERBEGIN);

render(siteMainElement, new SortingView().element, RenderPosition.BEFOREEND);

const filmsMenuContainer = new FilmsMenuView();
render(siteMainElement, filmsMenuContainer.element, RenderPosition.BEFOREEND);

const filmsListComponent = new FilmsListView();
render(filmsMenuContainer.element, filmsListComponent.element, RenderPosition.BEFOREEND);

const filmsElement = new FilmListContainerView();
render(filmsListComponent.element, filmsElement.element, RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(filmCards.length, FILM_CARDS_PER_STEP); i++) {
  renderFilmCards(filmsElement.element, filmCards[i], siteMainElement);
}

render(siteMainElement, new FooterStatisticsView(filmCards.length).element, RenderPosition.AFTEREND);

const showMoreButton = new ShowMoreButtonView();

if (filmCards.length > FILM_CARDS_PER_STEP) {
  let renderedFilmCount = FILM_CARDS_PER_STEP;
  render(filmsListComponent.element, showMoreButton.element, RenderPosition.BEFOREEND);

  showMoreButton.element.addEventListener('click', () => {
    filmCards
      .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_PER_STEP)
      .forEach((filmCard) => renderFilmCards(filmsElement.element, filmCard, siteMainElement));

    renderedFilmCount += FILM_CARDS_PER_STEP;

    if (renderedFilmCount >= filmCards.length) {
      showMoreButton.element.remove();
    }

  });
}

