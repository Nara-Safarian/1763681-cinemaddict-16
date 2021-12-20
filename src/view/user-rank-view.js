import {createComponentElement} from '../render.js';

const createUserRankTemplate = () => (
  `<p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">Movie buff</span>
  </p>`
);

export default class UserRankView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createUserRankTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
