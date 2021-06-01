import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class bookmarksView extends View {
  //todo у всех view будут эти поля
  // _parentEl = document.querySelector('.search-results');
  _parentEl = document.querySelector('.bookmarks__list');

  //? для сообщения ошибки
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it.`;
  //? по умолчанию
  _defaultMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  //todo сразу отображаем закладки
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  //todo генерируем html для preview каждый в общем
  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join('');
  }
}
export default new bookmarksView();
