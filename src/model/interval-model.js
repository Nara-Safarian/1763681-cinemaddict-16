import AbstractObservable from '../utils/abstract-observable.js';
import {INTERVAL} from '../consts.js';

export default class IntervalModel extends AbstractObservable {
   #interval = INTERVAL.ALL_TIME;

   get interval() {
     return this.#interval;
   }

   setInterval = (updateType, interval) => {
     this.#interval = interval;
     this._notify(updateType, interval);
   }
}
