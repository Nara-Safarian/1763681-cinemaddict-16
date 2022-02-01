import StatisticFilterView from '../view/statistic-filters-view.js';
import UserRankView from '../view/user-rank-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {INTERVAL, UpdateType} from '../consts.js';
import {getUserRank} from '../utils/stats.js';

export default class StatisticFilterPresenter {
   #statisticFilterComponent = null;
   #intervalModel = null;
   #filmCardsModel = null;
   #mainContainer = null;
   #userRankComponent = null;
   #filterModel = null;

   constructor(mainContainer, intervalModel, filmCardsModel, filterModel) {
     this.#mainContainer = mainContainer;
     this.#intervalModel = intervalModel;
     this.#filmCardsModel = filmCardsModel;
     this.#filterModel = filterModel;

     this.#filterModel.addObserver(this.#handleFilterModel);
   }

   get intervals() {
     this.#intervalModel.addObserver(this.#handleIntervaEvent);

     return [
       {
         type: INTERVAL.ALL_TIME,
         name: 'All time',
       },
       {
         type: INTERVAL.TODAY,
         name: 'Today',
         subtractDays: 0
       },
       {
         type: INTERVAL.WEEK,
         name: 'Week',
         substractDays: 6
       },
       {
         type: INTERVAL.MONTH,
         name: 'Month',
         substractDays: 29
       },
       {
         type: INTERVAL.YEAR,
         name: 'Year',
         substractDays: 364
       },
     ];
   }

   destroy = () => {
     this.#intervalModel.setInterval(UpdateType.MINOR, INTERVAL.ALL_TIME);
     if (!this.#statisticFilterComponent) {
       return;
     }
     if (this.#userRankComponent !== null) {
       remove(this.#userRankComponent);
     }
     remove(this.#statisticFilterComponent);

     this.#userRankComponent = null;
     this.#statisticFilterComponent = null;

     this.#intervalModel.removeObserver(this.#handleIntervaEvent);
   }

   #renderRankView = (rank) => {
     if (!rank) {
       return;
     }
     this.#userRankComponent = new UserRankView(rank);
     render(this.#statisticFilterComponent, this.#userRankComponent, RenderPosition.AFTERBEGIN);
   }

   init = () => {
     const intervals = this.intervals;
     const prevStatisticFilterComponent = this.#statisticFilterComponent;

     this.#statisticFilterComponent = new StatisticFilterView(
       intervals,
       this.#intervalModel.interval,
       this.#filmCardsModel.filmCards
     );

     this.#statisticFilterComponent.setIntervalChangeHandler(this.#intervalChangeHandler);
     const rank = getUserRank(this.#filmCardsModel.filmCards);
     if (prevStatisticFilterComponent === null) {
       render(this.#mainContainer, this.#statisticFilterComponent, RenderPosition.BEFOREEND);
       this.#renderRankView(rank);
       return;
     }

     replace(this.#statisticFilterComponent, prevStatisticFilterComponent);
     this.#renderRankView(rank);

     remove(prevStatisticFilterComponent);
   }

   #intervalChangeHandler = (type) => {
     this.#intervalModel.setInterval(UpdateType.MINOR, type);
   }

   #handleIntervaEvent = () => {
     this.init();
   }

   #handleFilterModel = (updateType, filter) => {
     if (filter) {
       this.destroy();
       return;
     }
     this.init();
   }
}
