import NavigationView from './view/navigation-view.js';
import UserProfileView from './view/user-profile-view.js';
import FooterStatisticsView from './view/footer.js';
import {generateFilmCard} from './mock/film-card.js';
import {FILM_CARDS} from './consts.js';
import {generateFilter} from './mock/filter.js';
import {RenderPosition, render} from './utils/render.js';
import FilmListPresenter from './presenter/film-list-presenter.js';

const filmCards = Array.from({length: FILM_CARDS}, generateFilmCard);
const filters = generateFilter(filmCards);

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new NavigationView(filters), RenderPosition.AFTERBEGIN);


render(siteMainElement, new FooterStatisticsView(filmCards.length), RenderPosition.AFTEREND);

const filmListPresenter = new FilmListPresenter(siteMainElement);
filmListPresenter.init(filmCards);
