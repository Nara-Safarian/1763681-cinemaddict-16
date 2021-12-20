import {createComponentElement} from '../render.js';

const statisticsContainerTemplate = () => (
  '<section class="statistic"> </section>'
);

export default class statisticsContainerView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return statisticsContainerTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
