import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class resultsView extends View {
  //todo у всех view будут эти поля
  // _parentEl = document.querySelector('.search-results');
  _parentEl = document.querySelector('.results');

  //? для сообщения ошибки
  _errorMessage = `No recipes found for your query! Please try again`;
  //? по умолчанию
  _defaultMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  /* //todo генерируем html для preview каждый в общем
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  //todo генерируем html для preview каждый в отдельности
  _generateMarkupPreview(rec) {
    //? нужно добавить класс active - выбранному элементу
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        rec.id === id ? 'preview__link--active' : ''
      }" href="#${rec.id}">
        <figure class="preview__fig">
          <img src="${rec.image}" alt="${rec.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${rec.title}</h4>
          <p class="preview__publisher">${rec.publisher}</p>
          <!--<div class="preview__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>-->
        </div>
      </a>
    </li>
  `;
  } */
  //todo генерируем html для preview каждый в общем
  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join('');
  }
}
export default new resultsView();
