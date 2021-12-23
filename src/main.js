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
import {RenderPosition, render, remove} from './utils/render.js';
import FilmsListView from './view/films-list-view.js';
import FilmListContainerView from './view/film-list-container-view';
import NoFilmView from './view/no-films.js';
import {onEscKeyDown} from './utils/task.js';

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

  filmComponent.setReplaceFilmCardtoPopup(() => {
    replaceFilmCardToPopup();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', onKeyDownDocument);
  });

  filmPopupComponent.setReplacePopupToFilmCard(() => {
    replacePopupToFilmCard();
    document.removeEventListener('keydown', onKeyDownDocument);
    document.body.classList.remove('hide-overflow');
  });

  render(filmListElement, filmComponent, RenderPosition.BEFOREEND);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new NavigationView(filters), RenderPosition.AFTERBEGIN);

render(siteMainElement, new SortingView(), RenderPosition.BEFOREEND);

const filmsMenuContainer = new FilmsMenuView();
render(siteMainElement, filmsMenuContainer, RenderPosition.BEFOREEND);

const filmsListComponent = new FilmsListView();
render(filmsMenuContainer, filmsListComponent, RenderPosition.BEFOREEND);

const renderFilmCard = () => {

  const filmsElement = new FilmListContainerView();
  render(filmsListComponent, filmsElement, RenderPosition.BEFOREEND);

  if (filmCards.length === 0) {
    const noFilmComponent = new NoFilmView();
    render(filmsMenuContainer, noFilmComponent, RenderPosition.BEFOREEND);
  } else {
    for (let i = 0; i < Math.min(filmCards.length, FILM_CARDS_PER_STEP); i++) {
      renderPopup(filmsElement, filmCards[i], siteMainElement);
    }

    const showMoreButton = new ShowMoreButtonView();

    if (filmCards.length > FILM_CARDS_PER_STEP) {
      let renderedFilmCount = FILM_CARDS_PER_STEP;
      render(filmsListComponent, showMoreButton, RenderPosition.BEFOREEND);

      showMoreButton.setClickHandler(() => {
        filmCards
          .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_PER_STEP)
          .forEach((filmCard) => renderPopup(filmsElement, filmCard, siteMainElement));

        renderedFilmCount += FILM_CARDS_PER_STEP;

        if (renderedFilmCount >= filmCards.length) {
          remove(showMoreButton);
        }
      });
    }
  }
};

render(siteMainElement, new FooterStatisticsView(filmCards.length), RenderPosition.AFTEREND);

renderFilmCard();
