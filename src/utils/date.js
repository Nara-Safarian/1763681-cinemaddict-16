import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const generateReleaseDate = (date) => dayjs(date).format('D MMMM YYYY');

export const generateCommentDate = (date) => dayjs(date).fromNow();

export const generateYear = (date) => dayjs(date).format('YYYY');

export const generateRunTime = (minutes) => {
  const time = dayjs.duration(minutes, 'minutes');
  return {
    hours: time.format('H'),
    minutes: time.format('m'),
  };
};

export const generateFormattedRuntime = (minutes) => {
  const time = generateRunTime(minutes);
  return minutes < 60 ? `${time.minutes}m` : `${time.hours}h ${time.minutes}m`;
};
