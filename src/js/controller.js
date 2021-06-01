'use strict';

// импорт model
import * as model from './model.js';
// console.log('model: ', model);

//todo импорт recipeView
import recipeView from './views/recipeView.js';
// console.log('recipeView: ', recipeView);

//todo импорт searchView
import searchView from './views/searchView.js';
// console.log('searchView: ', searchView);

//todo импорт resultsView
import resultsView from './views/resultsView.js';
// console.log('resultsView: ', resultsView);

//todo импорт paginationView
import paginationView from './views/paginationView.js';
// console.log('paginationView: ', paginationView);

//todo импорт bookmarksView
import bookmarksView from './views/bookmarksView.js';
// console.log('bookmarksView: ', bookmarksView);

//todo импорт addRecipeView
import addRecipeView from './views/addRecipeView.js';
// console.log('addRecipeView: ', addRecipeView);

// import icons from '../img/icons.svg'; // parcel 1
//* для статичных модулей
import icons from 'url:../img/icons.svg'; // parcel 2
// полифилл все
import 'core-js/stable';
// полифил асинхронным
import 'regenerator-runtime/runtime';

import { CLOSE_WINDOW_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

/* if (module.hot) {
  module.hot.accept();
} */

// import icons from 'url:../img/icons.svg';

const addRecipeIcon = document.querySelector(
  '.nav__btn-add-recipe > .nav__icon > use'
);
// console.log('searchIcon: ', searchIcon);

function setAttributesImg() {
  addRecipeIcon.setAttribute('href', `${icons}#icon-edit`);
}

// setAttributesImg();

///////////////////////////////////////

//todo показать рецепт
async function controlRecipes() {
  try {
    //* 0 -0 получаем хэш со страницы
    const id = window.location.hash.slice(1);
    // console.log('id: ', id);

    if (!id) return;

    //* 0) загрузка спиннера
    recipeView.renderSpinner();

    //* 0 -a) обновляем resultsView - чтобы отметить активный / выбранный рецепт
    resultsView.update(model.getSearchResultsPage());

    //* 0 - b) - рендерим bookmarksView
    bookmarksView.render(model.state.bookmarks);

    //* 1) загрузка рецепта
    await model.loadRecipe(id);

    // const { recipe } = model.state;

    //* 2) - рендерим рецепт
    recipeView.render(model.state.recipe);

    //* 3) - ловим ошбку
  } catch (error) {
    // alert(error);
    console.error(`${error.message}`);
    // recipeView.renderError(`💣💣💣 ${error}`);
    recipeView.renderError();

    // throw error;
  }
}

// controlRecipes();

//* 1 вар
/* window.addEventListener('hashchange', controlRecipes);
window.addEventListener('load', controlRecipes); */

//* 2 вариант
/* ['hashchange', 'load'].forEach((ev) =>
  window.addEventListener(ev, controlRecipes)
); */

//todo функция управления результатами поиска
/* async function controlSearchResultsMy(query) {
  try {
    await model.loadSearchResults(query);
    
    console.log('model.state.search.results: ', model.state.search.results);
  } catch (error) {
    console.error(error);
  }
} */

//todo функция управления результатами поиска
async function controlSearchResults() {
  try {
    //* 0 - рендерим спиннер
    resultsView.renderSpinner();

    //* 1 - получаем запрос
    const query = searchView.getQuery();

    if (!query) return;
    // добавляем запрос в model
    model.state.search.query = query;

    //* 2 - загружаем результаты поиска
    await model.loadSearchResults(query);

    //* 3 - рендерим результаты поиска
    // console.log('model.state.search.results: ', model.state.search.results);
    // resultsView.renderMy(model.state.search.results);
    // без пагинации
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //* 4 - вызываем пагинацию render
    paginationView.render(model.state.search);

    // debugger;
  } catch (error) {
    console.error(`💣💣💣 ${error}`);
  }
}

// controlSearchResults();

//todo контроль пагинации
function controlPaginationMy(page) {
  // console.log('page: ', page);

  //* вызываем заново рендер
  resultsView.render(model.getSearchResultsPage(page));

  //вызываем пагинацию render
  paginationView.render(model.state.search);
}

//todo контроль пагинации
function controlPagination(goToPage) {
  // console.log('Page test');

  // console.log('goToPage: ', goToPage);

  //* рендерим новые результаты поиска
  // resultsView.renderMy(model.state.search.results);
  // без пагинации
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //* вызываем новую пагинацию render
  paginationView.render(model.state.search);
}

//todo контроль количество подаваемых блюд
function controlServingsMy(btn) {
  // console.log('btn: ', btn);

  let prevServings = model.state.recipe.servings;
  // console.log('prevServings: ', prevServings);

  // let newServings;
  //* обновлять сервировки рецепта (в state)
  if (btn.classList.contains('btn--descrease-servings') && prevServings !== 1) {
    // newServings = model.state.recipe.servings--;
    // console.log('newServings: ', newServings);

    model.state.recipe.servings--;
  }

  if (btn.classList.contains('btn--increase-servings')) {
    // newServings = model.state.recipe.servings++;
    // console.log('newServings: ', newServings);

    model.state.recipe.servings++;
  }

  // console.log('model.state.recipe.servings: ', model.state.recipe.servings);
  let curServings = model.state.recipe.servings;
  console.log('curServings: ', curServings);

  //* если предыдущий и текущий равны - выходим из функции
  if (prevServings === curServings)
    return console.log(' не меняем recipeView ');

  //* обновляем ингредиенты
  updateIngredientsMy(
    model.state.recipe.ingredients,
    curServings / prevServings
  );

  //* обновить view
  recipeView.render(model.state.recipe);
}

function updateIngredientsMy(ingredients, multiplier) {
  /* console.log('ingredients: ', ingredients);
  console.log('multiplier: ', multiplier); */

  ingredients.forEach((ing) => {
    ing.quantity *= multiplier;
  });
}

//todo контроль количество подаваемых блюд
function controlServings(newServings) {
  //* обновить рецепт серивировки (в state)
  model.updateServings(newServings);

  //* обновить view - далее обновить вид
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

//todo контроль за добавлением закладки
function controlAddBookmark() {
  //* 1) - если рецепт НЕ отмечен - добавляем закладку, иначе - удаляем
  if (!model.state.recipe.bookmarked) {
    //* добавляем закладку в model
    model.addBookmark(model.state.recipe);
  } else {
    //* убираем закладку в model
    model.deleteBookmark(model.state.recipe);
  }

  /* console.log('model.state.recipe: ', model.state.recipe);
  console.log('model.state.bookmarks: ', model.state.bookmarks); */

  //* 2) - обновляем recipeView
  recipeView.update(model.state.recipe);

  //* 3) - рендерим bookmarksView
  bookmarksView.render(model.state.bookmarks);
}

//todo контроль закладок
function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

//todo контроль добавление рецепта (отправки формы)
async function controlAddRecipe(newRecipe) {
  try {
    //* рендерим спиннер
    addRecipeView.renderSpinner();

    console.log('newRecipe: ', newRecipe);

    //* загружаем рецепт
    await model.uploadRecipe(newRecipe);

    console.log('model.state.recipe: ', model.state.recipe);

    //* рендерим рецепт
    recipeView.render(model.state.recipe);

    //* отображаем сообщение
    addRecipeView.renderMessage();

    //* рендерим bookmarkView
    bookmarksView.render(model.state.bookmarks);

    //* изменяем id в url браузера - используем history API - pushState() метод позволяет изменить id без перезагрузки страницы
    //? pushState - имеет 3 параметра - data, title и url
    window.history.pushState(null, null, `#${model.state.recipe.id}`);

    //* закрываем форму
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, CLOSE_WINDOW_SEC * 1000);
  } catch (err) {
    console.error(`💣💣💣 ${err}`);
    addRecipeView.renderError(`${err.message}`);
  }
}

//todo вызывается при запуске приложения
function init() {
  //* вызываем рендер закладок
  bookmarksView.addHandlerRender(controlBookmarks);

  //* вызываем controlRecipes
  recipeView.addHandlerRender(controlRecipes);

  //* вызываем стандартное сообщение
  recipeView.renderMessage();

  //* вызываем для обновления сервировки и ингредиентов
  // recipeView.addHandlerUpdateServingsMy(controlServingsMy);

  recipeView.addHandlerUpdateServings(controlServings);

  //* вызываем для добавления в закладки
  // recipeView.addHandlerAddToBookmarksMy(controlAddBookmark);
  recipeView.addHandlerAddToBookmarks(controlAddBookmark);

  //* вызываем поиск по отправлению формы поиска - мой вар
  // searchView.addHandlerSearchMy(controlSearchResultsMy);
  //* вызываем поиск по отправлению формы поиска
  searchView.addHandlerSearch(controlSearchResults);

  //* вызываем addHandlerMoveTo из paginationView - слушаем клики на пагинацию
  paginationView.addHandlerMoveToMy(controlPaginationMy);
  // paginationView.addHandlerClick(controlPagination);

  //* вызываем addHandlerUpload из addRecipeView
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
