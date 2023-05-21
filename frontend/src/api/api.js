// Получение списка элементов:
export const getItemsList = async (url, params) => {
  const UrlParams = new URLSearchParams(params);
  const fullUrl = url + '?' + UrlParams;
  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  
  return await response.json();
}

// Получения информации по выбранному элементу:
export const getItemDetails = async (url, id) => {
  const response = await fetch(url + id);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

// Отравка данных на сервер:
export const postData = async (url, data) => {
  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  };
  const response = await fetch(url, headers);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}
