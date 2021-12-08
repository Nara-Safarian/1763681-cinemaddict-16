import {createFilmCardTemplate} from './view/film-card-view';
import {createFilmDetailsPopupTemplate} from './view/film-details-popup-view';
import {createFilmsTemplate} from './view/films-template-view';
import {createNavigationTemplate} from './view/navigation-view';
import {createShowMoreButtonTemplate} from './view/showmore-button-view';
import {createSortingTemplate} from './view/sort-view';
import {createStatisticFilterTemplate} from './view/statistic-filters-view';
import {createUserProfileTemplate} from './view/user-profile-view';
import {createUserRankTemplate} from './view/user-rank-view';
import {createFooterTemplate} from './view/footer';
import {generateFilmCard} from './mock/film-card';
import {renderPosition, FILM_CARDS, FILM_CARDS_PER_STEP} from './consts.js';
import {generateFilter} from './mock/filter';

const filmCards = Array.from({length: FILM_CARDS}, generateFilmCard);
const filters = generateFilter(filmCards);

const renderComponentTemplate = (container, template, targetPlace) => {
  container.insertAdjacentHTML(targetPlace, template);
};


const headerElement = document.querySelector('.header');
renderComponentTemplate(headerElement, createUserProfileTemplate(), renderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
renderComponentTemplate(siteMainElement, createNavigationTemplate(filters), renderPosition.BEFOREEND);

renderComponentTemplate(siteMainElement, createSortingTemplate(), renderPosition.BEFOREEND);

renderComponentTemplate(siteMainElement, createStatisticFilterTemplate(), renderPosition.BEFOREEND);

const userRankElement = siteMainElement.querySelector('.statistic');
renderComponentTemplate(userRankElement, createUserRankTemplate(), renderPosition.AFTERBEGIN);

renderComponentTemplate(siteMainElement, createFilmsTemplate(), renderPosition.BEFOREEND);

const filmsElement = siteMainElement.querySelector('.films-list__container');
for (let i = 0; i < Math.min(filmCards.length, FILM_CARDS_PER_STEP); i++) {
  renderComponentTemplate(filmsElement, createFilmCardTemplate(filmCards[i]), renderPosition.BEFOREEND);
}

renderComponentTemplate(siteMainElement, createFilmDetailsPopupTemplate(filmCards[0]), renderPosition.BEFOREEND);
const closePopupBtnElement = siteMainElement.querySelector('.film-details__close-btn');
closePopupBtnElement.addEventListener('click', () => {
  const popupElement = siteMainElement.querySelector('.film-details');
  popupElement.remove();
});

const footerElement = document.querySelector('.footer');
renderComponentTemplate(footerElement, createFooterTemplate(filmCards.length), renderPosition.BEFOREEND);

const showMoreButtonElement = siteMainElement.querySelector('.films-list');

if (filmCards.length > FILM_CARDS_PER_STEP) {
  let renderedFilmCount = FILM_CARDS_PER_STEP;
  renderComponentTemplate(showMoreButtonElement, createShowMoreButtonTemplate(), renderPosition.BEFOREEND);

  const showMoreButton = showMoreButtonElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', () => {
    filmCards
      .slice(renderedFilmCount, renderedFilmCount + FILM_CARDS_PER_STEP)
      .forEach((filmCard) => renderComponentTemplate(filmsElement, createFilmCardTemplate(filmCard), renderPosition.BEFOREEND));

    renderedFilmCount += FILM_CARDS_PER_STEP;

    if (renderedFilmCount >= filmCards.length) {
      showMoreButton.remove();
    }

  });
}

