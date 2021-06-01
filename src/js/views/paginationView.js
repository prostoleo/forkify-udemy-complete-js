import icons from 'url:../../img/icons.svg';
import View from './View.js';

class paginationView extends View {
  //todo у всех view будут эти поля
  // _parentEl = document.querySelector('.search-results');
  _parentEl = document.querySelector('.pagination');

  //? для сообщения ошибки
  _errorMessage = `No recipes found for your query! Please try again`;
  //? по умолчанию
  _defaultMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  _generateMarkup() {
    // console.log('this._data: ', this._data);

    const curPage = this._data.page;
    // console.log('curPage: ', curPage);

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log('numPages: ', numPages);

    // debugger;

    //? страница 1
    if (curPage === 1 && numPages > 1)
      return `
    <button class="btn--inline pagination__btn--next" data-goTo="${
      curPage + 1
    }">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;

    //? страница последняя
    if (curPage === numPages && numPages > 1)
      return `
    <button class="btn--inline pagination__btn--prev" data-goTo="${
      curPage - 1
    }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    
    `;

    //? страница НЕ 1 и НЕ последняя
    // if (curPage !== 1 && curPage !== numPages && numPages > 1)
    if (curPage < numPages)
      return `
    <button class="btn--inline pagination__btn--prev" data-goTo="${
      curPage - 1
    }">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    <button class="btn--inline pagination__btn--next" data-goTo="${
      curPage + 1
    }">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;

    // страниц нет, так как число результатов меньше результатов на страницу
    if (numPages === 1) return '';
  }

  //* для перехода по кнопкам пагинации
  addHandlerMoveToMy(handler) {
    this._parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--inline');
      // console.log('btn: ', btn);

      if (!btn) return;

      const pageGoTo = +btn.dataset.goto;
      // console.log('pageGoTo: ', pageGoTo);

      handler(pageGoTo);
    });
  }
  //* для перехода по кнопкам пагинации

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--inline');

      // console.log('btn: ', btn);

      if (!btn) return;

      const pageGoTo = +btn.dataset.goto;
      // console.log('pageGoTo: ', pageGoTo);

      handler(pageGoTo);

      // handler(btn);
    });
  }
}
export default new paginationView();
