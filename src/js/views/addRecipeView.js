import icons from 'url:../../img/icons.svg';
import View from './View.js';

class addRecipeView extends View {
  //todo у всех view будут эти поля
  // _parentEl = document.querySelector('.search-results');
  _parentEl = document.querySelector('.upload');
  _defaultMessage = 'Recipe was successfully uploaded 😉';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  //todo так как нужно слушать сразу при зарузке страницы модальное окно, то вызываем функцию в конструкторе
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  //todo открытие модальног
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  //todo закрытие модальног
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //todo открывать закрывать окно
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //todo отправить форму
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      //* form data API - для забора всей инфы из формы и делаем из него обьъект через spread оператор
      const dataArr = [...new FormData(this)];
      // console.log('data: ', data);

      //* превращает из массива массивов в объект
      const data = Object.fromEntries(dataArr);
      // console.log('data: ', data);

      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new addRecipeView();
