import icons from 'url:../../img/icons.svg'; // parcel 2

export default class View {
  //? для рецепта / данных
  _data;

  //* JSDOCS - комменитруем функции
  /**
   * Рендерит полученный объект в DOM
   * @param {Object | Object[]} data // Данные для рендера рецепта
   * @param {boolean} [render=true] // Если ложно создает строку html вместо рендера в DOM
   * @returns {undefined | string} Html возвращен если render = false
   * @this {Object} View instance
   */
  //todo получаем данные из controller от model - model.state.recipe
  render(data, render = true) {
    //* если не получили данных - отображаем ошибку
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    //* присваиваем данные
    this._data = data;

    //* получаем html
    const markup = this._generateMarkup();

    if (!render) return markup;

    //* очищаем контейнер и прикрепляем markup
    this._clear();

    if (!markup) return;

    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  //todo получаем данные из controller от model - model.state.recipe и обновляем только те текстовые элементы и атрибуты, которые изменились
  update(data) {
    //* присваиваем данные
    this._data = data;

    //* получаем html
    const newMarkup = this._generateMarkup();

    //* меняем markup строку в DOM объект но не привязываем его к реальной странице
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    //* все новые элементы виртуального DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log('newElements: ', newElements);

    //* текущие элементы
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));
    // console.log('curElements: ', curElements);

    //* сравниваем 2 массива
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //* проверяем - одинаковое ли содержимое этих узлов?
      // console.log(curEl, newEl.isEqualNode(curEl));

      //* где DOM должен был поменяться И содержимое узла первого ребенка только текст - там меняем контент

      //! важно nodeValue возвращает текст только в случае если узел является текстом, иначе возвращает (почти всегда null)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl?.firstChild?.nodeValue.trim() !== ''
      ) {
        /* console.log(
          'newEl.firstChild.nodeValue.trim(): 💣',
          newEl.firstChild.nodeValue.trim()
        ); */
        curEl.textContent = newEl?.firstChild?.nodeValue.trim();
      }

      //* меняем атрибуты элементов если содержимое элемента отличается от старого
      if (!newEl.isEqualNode(curEl)) {
        /* console.log(
          'Array.from(newEl.attributes): ',
          Array.from(newEl.attributes)
        ); */
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });

    //* заменяем старый DOM на новый
  }

  //todo очищаем parentEl
  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._defaultMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  //todo рендерим спиннер
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
