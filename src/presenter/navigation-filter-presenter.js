import NavigationView from '../view/navigation-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../consts.js';

export default class NavigationFilterPresenter {
   #filterContainer = null;
   #filterModel = null;
   #filmCardsModel = null;

   #navigationFilterComponent = null;

   constructor(filterContainer, filterModel, filmCardsModel) {
     this.#filterContainer = filterContainer;
     this.#filterModel = filterModel;
     this.#filmCardsModel = filmCardsModel;

     this.#filmCardsModel.addObserver(this.#handleModelEvent);
     this.#filterModel.addObserver(this.#handleModelEvent);
   }

   get filters() {
     const filmCards = this.#filmCardsModel.filmCards;

     return [
       {
         type: FilterType.ALL,
         name: 'All movies'
       },
       {
         type: FilterType.WATCHLIST,
         name: 'Watchlist',
         count: filter[FilterType.WATCHLIST](filmCards).length,
       },
       {
         type: FilterType.HISTORY,
         name: 'History',
         count: filter[FilterType.HISTORY](filmCards).length,
       },
       {
         type: FilterType.FAVORITES,
         name: 'Favorites',
         count: filter[FilterType.FAVORITES](filmCards).length,
       },
     ];
   }

   init = () => {
     const filters = this.filters;
     const prevNavigationFilterComponent = this.#navigationFilterComponent;

     this.#navigationFilterComponent = new NavigationView(filters, this.#filterModel.filter);
     this.#navigationFilterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
     this.#navigationFilterComponent.setStatisticsClickHandler(this.#handleStatisticsClick);

     if (prevNavigationFilterComponent === null) {
       render(this.#filterContainer, this.#navigationFilterComponent, RenderPosition.BEFOREBEGIN);
       return;
     }

     replace(this.#navigationFilterComponent, prevNavigationFilterComponent);
     remove(prevNavigationFilterComponent);
   }

   #handleModelEvent = () => {
     this.init();
   }

   #handleFilterTypeChange = (filterType) => {
     if (this.#filterModel.filter === filterType) {
       return;
     }

     this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
   }

   #handleStatisticsClick = () => {
     this.#filterModel.setFilter(UpdateType.MAJOR, '');
   }
}
