import AbstractView from './abstract-view.js';
import {FilterType} from '../consts.js';

const createFilter = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const isActive = currentFilterType === type;

  return `
    <a
      href="#${name}"
      class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}"
      data-filter-type="${type}"
    >
      ${name}
      ${type === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}
    </a>
  `;
};

const createNavigationTemplate = (filters, currentFilterType, isStatisticsClicked) => {
  const filtersHtml = filters.map((filter) => createFilter(filter, currentFilterType));

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersHtml.join('')}
      </div>
      <a
        href="#stats"
        class="main-navigation__additional ${isStatisticsClicked ? 'main-navigation__item--active' : ''}"
      >
        Stats
      </a>
    </nav>`
  );
};

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #isStatisticsClicked = false;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#isStatisticsClicked = !currentFilterType;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilter, this.#isStatisticsClicked);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A' && evt.target.parentNode.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    const filterType = evt.target.dataset.filterType || evt.target.parentNode.dataset.filterType;
    if (!filterType) {
      return;
    }
    this._callback.filterTypeChange(filterType);
  }

  setStatisticsClickHandler = (callback) => {
    this._callback.statisticsClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#statisticsClickHandler);
  }

  #statisticsClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.statisticsClick();
  }
}
