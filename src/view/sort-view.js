import {createComponentElement} from '../render.js';

const createSortingTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button sort__button--active">Sort by rating</a></li>
  </ul>`
);

export default class SortingView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createSortingTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
