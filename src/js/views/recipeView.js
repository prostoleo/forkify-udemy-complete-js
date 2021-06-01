//* импортируем родительский класс
import View from './View.js';

// import icons from '../img/icons.svg'; // parcel 1
//* для статичных модулей
// import icons from 'url:../img/icons.svg'; // parcel 2
import icons from 'url:../../img/icons.svg'; // parcel 2

//* для отображения дробей
import { Fraction } from 'fractional';

class recipeView extends View {
  //todo у всех view будут эти поля
  _parentEl = document.querySelector('.recipe');
  //? для сообщения ошибки
  _errorMessage = `We couldn't found that recipe! Please try another one!`;
  //? по умолчанию
  _defaultMessage = `Start by searching for a recipe or an ingredient. Have fun!`;

  //todo - функция для обработки событий
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach((ev) =>
      window.addEventListener(ev, handler)
    );
  }

  //todo обновляем коичество порций и ингредиентов - мой вариант
  addHandlerUpdateServingsMy(handler) {
    this._parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--tiny');

      if (!btn) return;

      handler(btn);
    });
  }

  //todo обновляем коичество порций и ингредиентов
  addHandlerUpdateServings(handler) {
    this._parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--tiny');

      if (!btn) return;

      //* получаем - к какому числу нужно обновить
      const updateTo = +btn.dataset.updateTo;
      // console.log('updateTo: ', updateTo);

      //* вызываем функцию если кол-во порций больше или равно 1
      updateTo >= 1 && handler(updateTo);
    });
  }

  //todo обновляем закладки при клике на кнопку - мой
  addHandlerAddToBookmarksMy(handler) {
    this._parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;

      const useEl = btn.querySelector('use');
      console.log('useEl: ', useEl);

      !useEl.getAttribute('href').includes('-fill')
        ? useEl.setAttribute('href', `${useEl.getAttribute('href')}-fill`)
        : useEl.setAttribute('href', useEl.getAttribute('href').slice(0, -5));

      // console.log('state.recipe: ', state.recipe);

      handler();
      // useEl.
    });
  }

  //todo обновляем закладки при клике на кнопку
  addHandlerAddToBookmarks(handler) {
    this._parentEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;

      handler();
    });
  }

  //todo генерируем html
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>
    <div class="recipe__details">
    <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--descrease-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>
        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg> 
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>
      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(this._generateMarkupIngredient)
            .join('')}          
        </ul>
      </div>
      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    // console.log('ing: ', ing);

    return (ing = `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ing.quantity ? new Fraction(ing?.quantity).toString() : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing?.unit ?? ''}</span>
          ${ing?.description ?? ''}
        </div>
      </li>
    `);
  }
}

export default new recipeView();
