import AbstractView from './abstract-view.js';

const createFooterStatisticsTemplate = (filmNumber) => (
  `<footer class="footer">
    <section class="footer__logo logo logo--smaller">Cinemaddict</section>
    <section class="footer__statistics">
     <p>${filmNumber} movies inside</p>
    </section>
  </footer>`
);

export default class FooterStatisticsView extends AbstractView {
  #filmNumber = null;

  constructor(filmNumber) {
    super();
    this.#filmNumber = filmNumber;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmNumber);
  }
}
