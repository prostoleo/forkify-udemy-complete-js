//* из конфига
import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';

//* для работы async функций
import { async } from 'regenerator-runtime';

//* из helpers
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  // page: 1,
  bookmarks: [],
};

//todo создание объекта рецепта
function createRecipeObject(data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //* создаем свойство key если оно существует
    ...(recipe.key && { key: recipe.key }),
  };
}

//todo загрузка рецепта - бизнес логика приложения
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    console.log('data: ', data);

    state.recipe = createRecipeObject(data);

    //* если существующий рецепт равен какому-то рецепту, который есть в закладках - то добавляем его в закладки
    if (state.bookmarks.some((b) => b.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log('state.recipe: ', state.recipe);

    // ловим ошибку
  } catch (error) {
    console.error(`💣💣💣 ${error}`);

    throw error;
  }
}

//todo функция для загрузки результатов поиска
export async function loadSearchResults(query) {
  try {
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    console.log('data: ', data);

    //* присваиваем в массив search
    state.search.results = data.recipes.map((rec) => {
      //* форматируем каждый объект чтобы выглядел как нужно
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        //* создаем свойство key если оно существует
        ...(rec.key && { key: rec.key }),
      };
    });

    // state.search = [data.recipes];
    // console.log('state.search.results: ', state.search.results);

    //* чтобы при новом поиске отображалась сначала 1 страница
    state.search.page = 1;
  } catch (error) {
    console.error(`💣💣💣 ${error}`);

    throw error;
  }
}

//todo функция для пагинации - отображения только текущих резльтатов в зависимости от страницы
export function getSearchResultsPage(page = state.search.page) {
  // console.log('page: ', page);
  //* сохраняем текущий номер страницы
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  //* возвращаем часть результатов
  return state.search.results.slice(start, end);
}

//* обновляем кол-во сервировки
export async function updateServings(newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
}

//todo добавляем закладки в localStorage
function persistBookmarks() {
  localStorage.setItem('bookmarks-forkify', JSON.stringify(state.bookmarks));
}

//todo добавление закладки
export function addBookmark(recipe) {
  //* добавление закладки
  state.bookmarks.push(recipe);

  //* отметить текщий рецепт как закладку если он одинаков с получаемым
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  //* сохраняем закладки
  persistBookmarks();
}

//todo удаление закладки
export function deleteBookmark(recipe) {
  //* удаление закладки мой метод
  state.bookmarks = state.bookmarks.filter(
    (bookmark) => bookmark.id !== recipe.id
  );

  // удаление закладки
  /* const index = state.bookmarks.findIndex(
    (bookmark) => bookmark.id === recipe.id
  );
  state.bookmarks.splice(index, 1); */

  //* отметить текущий рецепт как НЕ закладку если он одинаков с получаемым
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  //* сохраняем закладки
  persistBookmarks();
}

//todo инициализация
function init() {
  //* достаем из localStorage
  const storage = localStorage.getItem('bookmarks-forkify');

  //* если данные есть - закидываем в state
  if (storage) state.bookmarks = JSON.parse(storage);
}

init();
console.log('state.bookmarks: ', state.bookmarks);

function clearBookmarks() {
  localStorage.clear('bookmarks-forkify');
}

// clearBookmarks();

//====================================================
//TODO для загрузки рецепта
export async function uploadRecipe(newRecipe) {
  try {
    // console.log('Object.entries(newRecipe): ', Object.entries(newRecipe));

    //* делаем массив из ингредиентов в нужном формате - мой вариант
    /* const ingredients = Object.entries(newRecipe)
    .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map((entry) => entry.slice(1))
    .map((entry) => {
      console.log('entry: ', entry, typeof entry);
      let str = entry + '';
      console.log('str: ', str);
      console.log('str.split(', '): ', str.split(','));
      // entry.split(',');
      // return entry;
      str = str.split(',');

      return {
        quantity: str[0] ? +str[0] : null,
        unit: str[1] ? str[1] : '',
        description: str[2],
      };
    }); */

    //* формируем массив ингредиентов
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        //* desctructure
        const ingArr = ing[1].split(',').map((el) => el.trim());

        //* валидация
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format'
          );

        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '',
          description,
        };
      });

    console.log('ingredients: ', ingredients);

    //* формируем объект данных для отправки
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    console.log('recipe: ', recipe);

    //* получаем данные обратно от API
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    console.log('data: ', data);

    //* добавляем в текущий рецепт

    state.recipe = createRecipeObject(data);

    //* добавляем созданные рецепт в закладки
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}
