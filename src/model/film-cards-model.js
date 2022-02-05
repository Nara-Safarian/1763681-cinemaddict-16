import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../consts.js';

export default class FilmCardsModel extends AbstractObservable {
  #apiService = null;
  #filmCards = [];
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set filmCards(filmCards) {
    this.#filmCards = [...filmCards];
  }

  get filmCards() {
    return this.#filmCards;
  }

  get filmCardsCount() {
    return this.#filmCards.length;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try {
      const filmCards = await this.#apiService.movies;
      this.#filmCards = filmCards.map(this.#adaptToClient);
    } catch(err) {
      this.#filmCards = [];
    }

    this._notify(UpdateType.INIT);
  }

  getComments = async (filmCard) => {
    try {
      const comments = await this.#apiService.getComments(filmCard.id);
      this.#comments = comments.map(this.#adaptCommentToClient);
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.PATCH, filmCard);
  }

  updateFilmCard = async (updateType, updatedMovie) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === updatedMovie.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }
    try {
      const response = await this.#apiService.updateMovie(updatedMovie);
      const updatedFilmCard = this.#adaptToClient(response);
      this.#filmCards = [
        ...this.#filmCards.slice(0, index),
        updatedFilmCard,
        ...this.#filmCards.slice(index + 1),
      ];

      this._notify(updateType, updatedFilmCard);
    } catch(err) {
      throw new Error('Can\'t update Film Card');
    }
  }

  addComment = async(updateType, {movieId, comment}) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === movieId);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }

    try {
      const {movie, comments} = await this.#apiService.postComment(movieId, comment);
      this.comments = comments.map(this.#adaptCommentToClient);

      const updatedFilmCard = this.#adaptToClient(movie);
      this.#filmCards = [
        ...this.#filmCards.slice(0, index),
        updatedFilmCard,
        ...this.#filmCards.slice(index + 1),
      ];

      this._notify(updateType, updatedFilmCard);
    } catch(err) {
      throw new Error('Can\'t update Film Card');
    }
  }

  deleteComment = async(updateType, {commentId, filmCard}) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }

    try {
      await this.#apiService.deleteComment(commentId);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this._notify(updateType, filmCard);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

  #adaptToClient = (movie) => {
    const userDetails = movie['user_details'];
    const filmInfo = movie['film_info'];
    const releaseInfo = filmInfo['release'];

    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      poster: filmInfo['poster'],
      rating: filmInfo['total_rating'],
      title: filmInfo['title'],
      originalTitle: filmInfo['alternative_title'],
      director: filmInfo['director'],
      writers: filmInfo['writers'],
      actors: filmInfo['actors'],
      runTime: filmInfo['runtime'],
      genres: filmInfo['genre'],
      description: filmInfo['description'],
      ageRating: filmInfo['age_rating'],
      releaseDate: releaseInfo['date'] === null ? new Date() : new Date(releaseInfo['date']),
      country: releaseInfo['release_country'],
      isWatched: userDetails['already_watched'],
      isInWatchlist: userDetails['watchlist'],
      isFavourite: userDetails['favorite'],
      watchingDate: userDetails['watching_date'],
    };

    return adaptedMovie;
  }

  #adaptCommentToClient = (comment) => {
    const adaptedComment = {
      ...comment,
      date: new Date(comment.date),
      message: comment.comment
    };

    delete adaptedComment.comment;
    return adaptedComment;
  }
}

