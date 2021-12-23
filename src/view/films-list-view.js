import AbstractView from './abstract-view.js';


const crerateFilmsListTemplate = () => (
  `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
);

export default class FilmsListView extends AbstractView {
  get template () {
    return crerateFilmsListTemplate();
  }
}

