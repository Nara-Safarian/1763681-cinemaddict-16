import SmartView from './smart-view.js';
import {EMOTIONS} from '../consts.js';
import {generateCommentDate, generateReleaseDate, generateFormattedRuntime} from '../utils/date.js';

const createComment = ({emotion, author, message, date}) => `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${message}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${generateCommentDate(date)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>
  `;

const createEmotionsTemplate = (currentEmotion) => EMOTIONS.map((emotion) => `
    <input
      class="film-details__emoji-item visually-hidden"
      name="comment-emoji"
      type="radio"
      id="emoji-${emotion}"
      value="${emotion}"
      ${currentEmotion === emotion ? 'checked' : ''}
    >
    <label
      class="film-details__emoji-label"
      for="emoji-${emotion}"
      >
        <img
          src="./images/emoji/${emotion}.png"
          width="30"
          height="30"
          alt="emoji"
        >
    </label>
  `).join('');


const createFilmDetailsPopupTemplate = (filmCardPopup) => {
  const {
    title,
    rating,
    originalTitle,
    director,
    writers,
    actors,
    releaseDate,
    runTime,
    country,
    genres,
    poster,
    description,
    ageRating,
    isInWatchlist,
    isWatched,
    isFavourite,
    message = 'Great movie!',
    emotion = EMOTIONS[0],
    comments
  } = filmCardPopup;

  const addToWatchlist = isInWatchlist
    ? 'film-details__control-button--active'
    : '';

  const markAsWatched = isWatched
    ? 'film-details__control-button--active'
    : '';

  const addToFavourites = isFavourite
    ? 'film-details__control-button--active'
    : '';

  const genresTitle = `Genre${genres.length > 0 ? 's' : ''}`;

  const commentsHtml = comments.map((comment) => createComment(comment));

  const emotionsTemplate = createEmotionsTemplate(emotion);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${generateReleaseDate(releaseDate)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${generateFormattedRuntime(runTime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTitle}</td>
              <td class="film-details__cell">
                ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${addToWatchlist}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${markAsWatched}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${addToFavourites}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        ${commentsHtml.length === 0 ? '' : `
            <ul class="film-details__comments-list">
              ${commentsHtml.join('')}
            </ul>`}

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            <img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${message}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emotionsTemplate}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopupView extends SmartView {
  constructor(filmCard) {
    super();
    this._data = FilmPopupView.parseFilmCardToData(filmCard);
    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsPopupTemplate(this._data);
  }

  setReplacePopupToFilmCard = (callback) => {
    this._callback.replacePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#replaceToFilmCard);
  }

  #replaceToFilmCard = (evt) => {
    evt.preventDefault();
    this._callback.replacePopup();
  }

  setAddToWatchlistClickHandler = (callback) =>{
    this._callback.addToWatchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchClickHandler);
  }

  setMarkAsWatchedClickHandler = (callback) =>{
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setAddToFavouritesClickHandler = (callback) =>{
    this._callback.addAddToFavouritesClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #addToWatchClickHandler = () => {
    this._callback.addToWatchlistClick();
  }

  #watchedClickHandler = () => {
    this._callback.markAsWatchedClick();
  }

  #favoriteClickHandler = () => {
    this._callback.addAddToFavouritesClick();
  }

  reset = (filmCard) => {
    delete this._data.message;
    delete this._data.emotion;
    this.updateData(
      FilmPopupView.parseFilmCardToData(filmCard)
    );
  }

  restoreState = () => {
    this.element.scrollTop = this._data.scrollTop || 0;
    this.#restoreHandlers();
  }

  #restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setReplacePopupToFilmCard(this._callback.replacePopup);
    this.setAddToWatchlistClickHandler(this._callback.addToWatchlistClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setAddToFavouritesClickHandler(this._callback.addAddToFavouritesClick);
  }

  static parseFilmCardToData = (filmCard) => ({...filmCard})
  static parseDataToFilmCard = (data) => ({...data})

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#messageInputHandler);

    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#emotionChangeHandler);

    this.element.addEventListener('scroll', this.#popupScrollHandler);
  }

  #messageInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      message: evt.target.value,
    }, true);
  }

  #emotionChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      emotion: evt.target.value,
    });
  }

  #popupScrollHandler = () => {
    this.updateData({
      scrollTop: this.element.scrollTop,
    }, true);
  }
}
