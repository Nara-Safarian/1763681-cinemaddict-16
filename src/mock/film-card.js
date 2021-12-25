import dayjs from 'dayjs';
import {getRandomInteger, getRandomFloat} from '../utils/common.js';

const generatePoster = () => {
  const poster = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg'
  ];

  const randomIndex = getRandomInteger (0, poster.length - 1);
  return poster[randomIndex];
};

const generateRating = () => getRandomFloat(1, 10);

const generateTitle = () => {
  const title = [
    'Made for Each Other',
    'Santa Claus Conquers the Martians',
    'The Great Flamarion',
    'The Man with the Golden Arm',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Sagebrush Trail',
    'The Dance of Life'
  ];

  const randomIndex = getRandomInteger (0, title.length - 1);
  return title[randomIndex];
};

const generateOriginalTitle = () => {
  const originalTitle = [
    'Made for Each Other',
    'Santa Claus Conquers the Martians',
    'The Great Flamarion',
    'The Man with the Golden Arm',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Sagebrush Trail',
    'The Dance of Life'
  ];

  const randomIndex = getRandomInteger (0, originalTitle.length - 1);
  return originalTitle[randomIndex];
};

const generateDirector = () => {
  const director = [
    'Anthony Mann',
    'Alfred Hitchcock',
    'Stanley Kubrick',
    'Billy Wilder',
    'David Lynch',
    'Orson Welles',
    'Christopher Nolan'
  ];

  const randomIndex = getRandomInteger (0, director.length - 1);
  return director[randomIndex];
};

const generateWriters = () => {
  const writers = [
    'Alfred Hitchcock',
    'Stanley Kubrick',
    'Anne Wigton',
    'David Lynch',
    'Orson Welles',
    'Christopher Nolan',
    'Heinz Herald',
    'Richard Weil'
  ];

  const randomIndex = getRandomInteger (0, writers.length - 1);
  return writers[randomIndex];
};

const generateActors = () => {
  const actors = [
    'Erich von Stroheim ,Mary Beth Hughes, Dan Duryea',
    'Leonardo DiCaprio, Jennifer Lawrence',
    'Timothée Chalamet, Armie Hammer',
    'Robert Pattinson, Elizabeth Debicki'
  ];

  const randomIndex = getRandomInteger (0, actors.length - 1);
  return actors[randomIndex];
};

export const generateReleaseDate = () => {
  const maxDaysGap = 50000;
  const daysGap = getRandomInteger(1, maxDaysGap);
  return dayjs().add(-daysGap, 'day').toDate();
};

const generateRunTime = () => {
  const hours = getRandomInteger(0, 4);
  const minutes = getRandomInteger(1, 59);
  let runTime = hours ? `${hours}h ` : '';
  runTime += `${minutes}m`;
  return runTime;
};

const generateCountry = () => {
  const country = [
    'USA',
    'UK',
    'France',
    'Italy',
    'Sweden',
    'Italy'
  ];

  const randomIndex = getRandomInteger (0, country.length - 1);
  return country[randomIndex];
};

const generateAgeRating = () => {
  const ageRating = [
    '0+',
    '6+',
    '13+',
    '17+'
  ];

  const randomIndex = getRandomInteger (0, ageRating.length - 1);
  return ageRating[randomIndex];
};


const generateCommentEmotion = () => {
  const emotion = [
    'angry.png',
    'puke.png',
    'sleeping.png',
    'smile.png'
  ];

  const randomIndex = getRandomInteger (0, emotion.length - 1);
  return emotion[randomIndex];
};

const generateCommentDate = () => {
  const maxDaysGap = 1000;
  const daysGap = getRandomInteger(1, maxDaysGap);
  return dayjs().add(-daysGap, 'day').toDate();
};

const generateCommentAuthor = () => {
  const author = [
    'John Doe',
    'Tim Macoveev',
    'John Doe',
    'Tim Macoveev'
  ];

  const randomIndex = getRandomInteger (0, author.length - 1);
  return author[randomIndex];
};

const generateCommentMessage = () => {
  const message = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?'
  ];

  const randomIndex = getRandomInteger (0, message.length - 1);
  return message[randomIndex];
};

const generateComment = () => ({
  emotion: generateCommentEmotion(),
  date: generateCommentDate(),
  author: generateCommentAuthor(),
  message: generateCommentMessage()
});

const generateComments = () => Array.from({length: getRandomInteger(0, 5)}, generateComment);

const generateGenre = () => {
  const genre = [
    'Musical',
    'Western',
    'Comedy',
    'Drama',
    'Film-Noir',
    'Mystery'
  ];

  const randomIndex = getRandomInteger (0, genre.length - 1);
  return genre[randomIndex];
};

const generateGenres = () => Array.from({length: getRandomInteger(1, 3)}, generateGenre);

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];

  const randomIndex = getRandomInteger (0, descriptions.length - 1);
  return descriptions[randomIndex];
};


export const generateFilmCard = () => ({
  poster: generatePoster(),
  rating: generateRating(),
  title: generateTitle(),
  originalTitle: generateOriginalTitle(),
  director: generateDirector(),
  writers: generateWriters(),
  actors: generateActors(),
  releaseDate: generateReleaseDate(),
  runTime: generateRunTime(),
  country: generateCountry(),
  genres: generateGenres(),
  description: generateDescription(),
  ageRating: generateAgeRating(),
  comments: generateComments(),
  isInWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavourite: Boolean(getRandomInteger(0, 1))
});
