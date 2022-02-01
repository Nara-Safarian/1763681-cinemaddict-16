const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  getComments = (movieId) => this.#load({url: `comments/${movieId}`})
    .then(ApiService.parseResponse)

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  postComment = async (movieId, comment) => {
    const response = await this.#load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }


  deleteComment = async (commentId) => {
    const response = await this.#load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;

  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }

  #adaptToServer = (movie) => {
    const adaptedMovie = {
      id: movie.id,
      comments: movie.comments,
      'film_info': {
        title: movie.title,
        'alternative_title': movie.originalTitle,
        'total_rating': movie.rating,
        poster: movie.poster,
        'age_rating': movie.ageRating,
        director: movie.director,
        writers: movie.writers,
        actors: movie.actors,
        release: {
          date: movie.releaseDate.toISOString(),
          'release_country': movie.country
        },
        runtime: movie.runTime,
        genre: movie.genres,
        description: movie.description
      },
      'user_details': {
        watchlist: movie.isInWatchlist,
        'already_watched': movie.isWatched,
        'watching_date': movie.watchingDate,
        favorite: movie.isFavourite
      }
    };

    return adaptedMovie;
  }

  #adaptCommentToServer = (comment) => {
    const adaptedComment = {
      ...comment,
      date: comment.date.toISOString(),
      comment: comment.message,
    };

    delete adaptedComment.message;
    return adaptedComment;
  }
}
