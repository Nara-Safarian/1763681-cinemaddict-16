import UserProfileView from './view/user-profile-view.js';
import FooterStatisticsView from './view/footer.js';
import {RenderPosition, render} from './utils/render.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import FilmCardsModel from './model/films-model';
import FilterModel from './model/filter-model.js';
import IntervalModel from './model/interval-model.js';
import NavigationFilterPresenter from './presenter/navigation-filter-presenter.js';
import StatisticFilterPresenter from './presenter/statistic-filter-presenter.js';
import ApiService from './api-service.js';
import {getUserRank} from './utils/stats.js';

const AUTHORIZATION = 'Basic igd8kbdf9sjdg5';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict/';

const filterModel = new FilterModel();
const intervalModel = new IntervalModel();
const filmCardsModel = new FilmCardsModel(new ApiService(END_POINT, AUTHORIZATION));

const siteMainElement = document.querySelector('.main');

const filmListPresenter = new FilmListPresenter(siteMainElement, filmCardsModel, filterModel);
new NavigationFilterPresenter(siteMainElement, filterModel, filmCardsModel);
new StatisticFilterPresenter(siteMainElement, intervalModel, filmCardsModel, filterModel);

filmListPresenter.init();

filmCardsModel.init().finally(() => {
  const siteHeaderElement = document.querySelector('.header');
  const rank = getUserRank(filmCardsModel.filmCards);
  render(siteHeaderElement, new UserProfileView(rank), RenderPosition.BEFOREEND);
  render(siteMainElement, new FooterStatisticsView(filmCardsModel.filmCards.length), RenderPosition.AFTEREND);
});
