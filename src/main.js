import {createFilmCardTemplate} from './view/film-card-view';
import {createFilmDetailsPopupTemplate} from './view/film-details-popup-view';
import {createFilmsTemplate} from './view/films-template-view';
import {createNavigationTemplate} from './view/navigation-view';
import {createShowMoreButtonTemplate} from './view/showmore-button-view';
import {createSortingTemplate} from './view/sort-view';
import {createStatisticFilterTemplate} from './view/statistic-filters-view';
import {createUserProfileTemplate} from './view/user-profile-view';
import {createUserRankTemplate} from './view/user-rank-view';

const renderComponentTemplate = (container, template, targetPlace) => {
  container.insertAdjacentHTML(targetPlace, template);
};

const renderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const headerElement = document.querySelector('.header');
renderComponentTemplate(headerElement, createUserProfileTemplate(), renderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
renderComponentTemplate(siteMainElement, createNavigationTemplate(), renderPosition.BEFOREEND);

renderComponentTemplate(siteMainElement, createSortingTemplate(), renderPosition.BEFOREEND);

renderComponentTemplate(siteMainElement, createStatisticFilterTemplate(), renderPosition.BEFOREEND);
const userRankElement = siteMainElement.querySelector('.statistic');
renderComponentTemplate(userRankElement, createUserRankTemplate(), renderPosition.AFTERBEGIN);

renderComponentTemplate(siteMainElement, createFilmsTemplate(), renderPosition.BEFOREEND);

const FILM_CARDS = 5;
const filmsElement = siteMainElement.querySelector('.films-list__container');
for (let i = 1; i <= FILM_CARDS; i++) {
  renderComponentTemplate(filmsElement, createFilmCardTemplate(), renderPosition.BEFOREEND);
}

const showMoreButtonElement = siteMainElement.querySelector('.films-list');
renderComponentTemplate(showMoreButtonElement, createShowMoreButtonTemplate(), renderPosition.BEFOREEND);

renderComponentTemplate(siteMainElement, createFilmDetailsPopupTemplate(), renderPosition.BEFOREEND);


