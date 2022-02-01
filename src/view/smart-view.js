import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView{
  _data = {};

  updateElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    if (parent === null) {
      this.restoreState();
      return;
    }

    parent.replaceChild(newElement, prevElement);

    this.restoreState();
  }

  updateData = (update, justDataUpdating) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreState() {
    throw new Error('Abstract method not implemented: restoreState');
  }
}
