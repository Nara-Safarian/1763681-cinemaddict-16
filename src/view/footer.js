import {createComponentElement} from '../render.js';

const createFooterStatisticsTemplate = (filmNumber) => (
  `<footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
     <p>${filmNumber} movies inside</p>
    </section>
  </footer>`
);

export default class FooterStatisticsView {
  #element = null;
  #filmNumber = null;

  constructor(filmNumber) {
    this.#filmNumber = filmNumber;
  }

  get element() {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmNumber);
  }

  removeElement() {
    this.#element = null;
  }
}
