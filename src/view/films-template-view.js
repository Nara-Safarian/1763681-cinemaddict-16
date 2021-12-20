import {createComponentElement} from '../render.js';

const createFilmsTemplate = () => (
  '<section class="films"> </section>'
);

export default class FilmsMenuView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createFilmsTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
