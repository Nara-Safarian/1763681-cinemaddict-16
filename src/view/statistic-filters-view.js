import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isToday from 'dayjs/plugin/isToday';
import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {GENRES, INTERVAL} from '../consts.js';
import {generateRunTime} from '../utils/date.js';

dayjs.extend(isBetween);
dayjs.extend(isBetween);
dayjs.extend(isToday);

const BAR_HEIGHT = 50;

const myChart = (statisticCtx, genresMap) => {
  statisticCtx.height = BAR_HEIGHT * GENRES.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(genresMap),
      datasets: [{
        data: Object.values(genresMap),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createYouWatchedTemplate = (watchedFilms) => `
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">You watched</h4>
    <p class="statistic__item-text">${watchedFilms} <span class="statistic__item-description">movie${watchedFilms === 1 ? '' : 's'}</span></p>
  </li>
`;


const createTotalDurationTemplate = (totalDurationHours, totalDurationMins) => `
  <li class="statistic__text-item">
    <h4 class="statistic__item-title">Total duration</h4>
    <p class="statistic__item-text">
      ${totalDurationHours === '0' ? '' : `${totalDurationHours}<span class="statistic__item-description">h</span>`}
      ${totalDurationMins} <span class="statistic__item-description">m</span>
    </p>
  </li>
`;

const createTopGenreTemplate = (name) => `
    <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${name}</p>
      </li>
    `;

const createIntervalsTemplate = (intervals, currentInterval) => intervals.map((interval) => {
  const {
    type,
    name
  } = interval;

  return `
      <input
        type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-${type}"
        value="${type}"
        ${currentInterval === type ? 'checked' : ''}
      >
      <label for="statistic-${type}" class="statistic__filters-label">${name}</label>
    `;
}).join('');

const createStatisticFilterTemplate = (genresData, intervals, currentInterval) => {
  const {topGenre, watchedFilms, totalRunTimeInMinutes} = genresData;
  const {
    hours: totalDurationHours,
    minutes: totalDurationMins
  } = generateRunTime(totalRunTimeInMinutes);

  const intervalsTemplate = createIntervalsTemplate(intervals, currentInterval);
  const youWatchedTemplate = createYouWatchedTemplate(watchedFilms);
  const totalDurationTemplate = createTotalDurationTemplate(totalDurationHours, totalDurationMins);
  const topGenreTemplate = createTopGenreTemplate(topGenre.name);


  return `<section class="statistic">
  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${intervalsTemplate}
  </form>

  <ul class="statistic__text-list">
      ${youWatchedTemplate}
      ${totalDurationTemplate}
      ${topGenre.count ? topGenreTemplate : ''}
  </ul>

  <div class="statistic__chart-wrap">
     <canvas class="statistic__chart" width="1000"></canvas>
  </div>
  </section>`;
};

export default class StatisticFilterView extends SmartView  {
  #genresChart = null;
  #genresData = null;
  #currentInterval = null;
  #intervals = null;
  #filteredFilmCards = null;

  constructor(intervals, currentInterval, filmCards) {
    super();

    this.#intervals = intervals;
    this.#currentInterval = currentInterval;
    this._data = {
      filmCards,
    };

    this.#filteredFilmCards = StatisticFilterView.getCurrentIntervalFilmCards(
      this.#intervals,
      this.#currentInterval,
      this._data.filmCards
    );
    this.#genresData = StatisticFilterView.getGenresData(this.#filteredFilmCards);
    this.#setCharts();
  }

  get template () {
    return createStatisticFilterTemplate(this.#genresData, this.#intervals, this.#currentInterval);
  }

  removeElement = () => {
    super.removeElement();
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    this.chart = myChart(statisticCtx, this.#genresData.sortedGenresMap);
  }

  static getCurrentIntervalFilmCards = (intervals, currentInterval, filmCards) => {
    if (currentInterval === INTERVAL.ALL_TIME) {
      return filmCards;
    }

    if (currentInterval === INTERVAL.TODAY) {
      return filmCards.filter((filmCard) => dayjs(filmCard.watchingDate).isToday());
    }

    const interval = intervals.find(({type}) => currentInterval === type);
    const dateFrom = dayjs().subtract(interval.substractDays, 'day').toDate();
    const dateTo = dayjs().toDate();

    return filmCards.filter((filmCard) =>
      dayjs(filmCard.watchingDate).isBetween(dateFrom, dateTo, null, '()')
    );
  }

  static getGenresData = (filmCards) => {
    const genresMap = {};
    GENRES.forEach((genre) => (genresMap[genre] = 0));
    let watchedFilms = 0;
    let totalRunTimeInMinutes = 0;

    filmCards.forEach((filmCard) => {
      if (!filmCard.isWatched) {
        return;
      }
      watchedFilms++;
      totalRunTimeInMinutes += filmCard.runTime;

      filmCard.genres.forEach((genre) => {
        genresMap[genre] += 1;
      });
    });

    const sortedGenresArray = Object.entries(genresMap).sort((a, b) => b[1] - a[1]);
    const [name, count] = sortedGenresArray[0];
    const sortedGenresMap = Object.fromEntries(sortedGenresArray);

    return {
      sortedGenresMap,
      topGenre: {
        name,
        count
      },
      watchedFilms,
      totalRunTimeInMinutes
    };
  }


  setIntervalChangeHandler = (callback) => {
    this._callback.intervalChange = callback;
    this.element.querySelector('form').addEventListener('change', this.#intervalChangeHandler);
  }

  #intervalChangeHandler = (evt) => {
    evt.preventDefault();
    const intervalType = evt.target.value;
    this._callback.intervalChange(intervalType);
  }
}
