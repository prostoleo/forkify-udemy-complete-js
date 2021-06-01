import { TIMEOUT_SEC } from './config';

//TODO модуль для функций - помощников

//todo общая функция для getJSON / sendJSON
export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          //* метод
          method: 'POST',
          //* информация о переданных данных
          headers: {
            // говорим что формат json
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(
          // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
          `${url}`
        );

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (error) {
    // console.error(`${error.message}`);

    //* чтобы ошибку можно было использовать в model - rethrow error
    throw error;
  }
}

//* функция для получения данных
/* export async function getJSON(url) {
  try {
    const fetchPro = fetch(
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40'
      `${url}`
    );

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (error) {
    // console.error(`${error.message}`);

    //* чтобы ошибку можно было использовать в model - rethrow error
    throw error;
  }
} */

//* фукнция для отправки данных
/* export async function sendJSON(url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      //* метод
      method: 'POST',
      //* информация о переданных данных
      headers: {
        // говорим что формат json
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);

    return data;
  } catch (error) {
    // console.error(`${error.message}`);

    //* чтобы ошибку можно было использовать в model - rethrow error
    throw error;
  }
} */

export function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}
