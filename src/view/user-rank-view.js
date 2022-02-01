import AbstractView from './abstract-view.js';

const createUserRankTemplate = (rank) => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>`
);

export default class UserRankView extends AbstractView {
  #rank = null;

  constructor(rank) {
    super();
    this.#rank = rank;
  }

  get template () {
    return createUserRankTemplate(this.#rank);
  }

}
