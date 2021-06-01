// import icons from '../img/icons.svg'; // parcel 1
//* для статичных модулей
// import icons from 'url:../img/icons.svg'; // parcel 2
import icons from 'url:../../img/icons.svg'; // parcel 2

//* для отображения дробей
import { Fraction } from 'fractional';

class searchView {
  //todo у всех view будут эти поля
  // _parentEl = document.querySelector('.search-results');
  _parentEl = document.querySelector('.search');

  //todo - функция для отображения поиска
  /* addHandlerSearchMy(handler) {
    this._parentEl.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const query = e.currentTarget
      .querySelector('input')
      .value.trim()
      .toLowerCase();
      console.log('query: ', query);
      
      if (!query) return;
      
      handler(query);
    });
  } */

  getQuery() {
    const query = this._parentEl.querySelector('input').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('input').value = '';
  }

  //todo - функция для отображения поиска
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', (e) => {
      e.preventDefault();

      handler();
    });
  }
}

export default new searchView();
