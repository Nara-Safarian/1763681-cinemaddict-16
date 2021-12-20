import {createComponentElement} from '../render.js';

const filmListContainerTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmListContainerView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return filmListContainerTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
