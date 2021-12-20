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
import NoFilmView from './view/no-films.js';
import {onEscKeyDown} from './utils';

const filmCards = Array.from({length: FILM_CARDS}, generateFilmCard);
const filters = generateFilter(filmCards);

const renderPopup = (filmListElement, filmCard, mainElement) => {
  const filmComponent = new FilmCardView(filmCard);
  const filmPopupComponent = new FilmPopupView(filmCard);

  const replaceFilmCardToPopup = () => {
    mainElement.appendChild(filmPopupComponent.element);
  };

  const replacePopupToFilmCard = () => {
    mainElement.removeChild(filmPopupComponent.element);
  };

  const onKeyDownDocument = (evt) => {
    onEscKeyDown(evt, mainElement, filmPopupComponent.element);
    document.removeEventListener('keydown', onKeyDownDocument);
    document.body.classList.remove('hide-overflow');
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    replaceFilmCardToPopup();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onKeyDownDocument);
  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
    replacePopupToFilmCard();
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

const renderFilmCard = () => {

  const filmsElement = new FilmListContainerView();
  render(filmsListComponent.element, filmsElement.element, RenderPosition.BEFOREEND);

  if (filmCards.length === 0) {
    const noFilmComponent = new NoFilmView();
    render(filmsMenuContainer.element, noFilmComponent.element, RenderPosition.BEFOREEND);
  } else {
    for (let i = 0; i < Math.min(filmCards.length, FILM_CARDS_PER_STEP); i++) {
      renderPopup(filmsElement.element, filmCards[i], siteMainElement);
    }

    const showMoreButton = new ShowMoreButtonView();

    if (filmCards.length > FILM_CARDS_PER_STEP) {
      let renderedFilmCount = FILM_CARDS_PER_STEP;
      render(filmsListComponent.element, showMoreButton.element, RenderPosition.BEFOREEND);

      showMoreButton.element.addEventListener('click', () => {
        filmCards
          .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_PER_STEP)
          .forEach((filmCard) => renderPopup(filmsElement.element, filmCard, siteMainElement));

        renderedFilmCount += FILM_CARDS_PER_STEP;

        if (renderedFilmCount >= filmCards.length) {
          showMoreButton.element.remove();
        }
      });
    }
  }
};

render(siteMainElement, new FooterStatisticsView(filmCards.length).element, RenderPosition.AFTEREND);

renderFilmCard();
