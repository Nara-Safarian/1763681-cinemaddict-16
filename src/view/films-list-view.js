import {createComponentElement} from '../render.js';


const crerateFilmsListTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
);

export default class FilmsListView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return crerateFilmsListTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}

