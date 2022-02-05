import {createComponentElement} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT_MS = 600;
const MS_DIVIDER = 1000;

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element () {
    if (!this.#element) {
      this.#element = createComponentElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error ('Abstract method not implemented: get template');
  }

  removeElement () {
    this.#element = null;
  }

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT_MS / MS_DIVIDER}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      if (callback) {
        callback();
      }
    }, SHAKE_ANIMATION_TIMEOUT_MS);
  }
}
