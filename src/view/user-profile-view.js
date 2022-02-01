import AbstractView from './abstract-view.js';

const createUserProfileTemplate = (rank) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserProfileView extends AbstractView {
  #rank = null;

  constructor(rank) {
    super();
    this.#rank = rank;
  }

  get template () {
    return createUserProfileTemplate(this.#rank);
  }
}
