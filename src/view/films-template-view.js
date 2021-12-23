import AbstractView from './abstract-view.js';

const createFilmsTemplate = () => (
  '<section class="films"> </section>'
);

export default class FilmsMenuView extends AbstractView {
  get template () {
    return createFilmsTemplate();
  }
}
