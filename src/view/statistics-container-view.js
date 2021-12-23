import AbstractView from './abstract-view.js';

const statisticsContainerTemplate = () => (
  '<section class="statistic"> </section>'
);

export default class statisticsContainerView extends AbstractView {
  get template () {
    return statisticsContainerTemplate();
  }
}
