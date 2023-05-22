import { put, call, takeLatest, all } from 'redux-saga/effects';
import * as api from '../api/api';
import { reducerNames } from '../const/reducerNames';
import { URL } from '../const/URL';
import { itemActions, listActions, postActions } from '../reducers';

// Универсальная Функция-генератор-работник (worker) для обработки событий массива элементов
function* handleTemplateRequestItemsSaga(name, actions, action) {

  try {
    // формирование URL из URL сервера и URL для конкретного подмножества reducer-ов (name)
    const reducerInfo = reducerNames.reducersListData.find((v) => v.name === name);
    const fullUrl = URL.server + (reducerInfo === undefined ? '' : reducerInfo.url);
    // вызов универсальной API-функции
    const data = yield call(api.getItemsList, fullUrl, action.payload.data);
    // SUCCESS - данные есть
    if (data.length >= 6) {
      // формируем новое событие - setItemsSuccess и сохраняем в STORE новый список элементов
      yield put(actions.setItemsSuccess(data));
    }
    // SUCCESS - данных нет или мало
    else {
      // формируем новое событие setItemsIdle и сохраняем в STORE последние новые данные
      yield put(actions.setItemsIdle(data));
    }
    return data;
  }
  catch (e) {
    // ERROR - формируем новое событие - setItemsError
    yield put(actions.setItemsError(e.message));
  }
}

// Универсальная Функция-генератор-работник (worker) для обработки событий выбранного элемента
function* handleTemplateRequestItemDetailsSaga(name, actions, action) {

  try {
    // формирование URL из URL сервера и URL для конкретного подмножества reducer-ов (name)
    const reducerInfo = reducerNames.reducersItemData.find((v) => v.name === name);
    const fullUrl = URL.server + (reducerInfo === undefined ? '' : reducerInfo.url);
    // вызов универсальной API-функции
    const data = yield call(api.getItemDetails, fullUrl, action.payload.data);
    // SUCCESS - формируем новое событие - setItemDetailsSuccess и сохраняем в STORE новый список элементов
    yield put(actions.setItemDetailsSuccess(data));
    return data;
  }
  catch (e) {
    // ERROR - формируем новое событие - setItemDetailsError 
    yield put(actions.setItemDetailsError(e.message));
  }
}

// Универсальная Функция-генератор-работник (worker) для обработки событий POST-запросов
function* handleTemplatePostDataSaga(name, actions, action) {

  try {
    // формирование URL из URL сервера и URL для конкретного подмножества reducer-ов (name)
    const reducerInfo = reducerNames.postData.find((v) => v.name === name);
    const fullUrl = URL.server + (reducerInfo === undefined ? '' : reducerInfo.url);
    // вызов универсальной API-функции
    const data = yield call(api.postData, fullUrl, action.payload.data);
    // SUCCESS - данные есть
    // формируем новое событие - setItemsSuccess и сохраняем в STORE новый список элементов
    yield put(actions.postDataSuccess(data));
    return data;
  }
  catch (e) {
    // ERROR - формируем новое событие - setItemsError
    yield put(actions.postDataError(e.message));
  }
}

// Корневая saga
// Из массива событий (rootActions = {name: {actionCreators()...}, ...})
// создаются наблюдатели (watchers) для каждого элемента
// НАБЛЮДАЮТСЯ СОБЫТИЯ:
//   requestItems в ListSaga (оно должно быть у всех элементов в listActions)
//   requestItemDetails в itemSaga (оно должно быть у всех элементов в itemActions)

export default function* saga() {
  yield all(
    [
      ...Object.keys(postActions).map((v) => takeLatest(postActions[v].postDataRequest, handleTemplatePostDataSaga, v, postActions[v])),
      ...Object.keys(itemActions).map((v) => takeLatest(itemActions[v].requestItemDetails, handleTemplateRequestItemDetailsSaga, v, itemActions[v])),
      ...Object.keys(listActions).map((v) => takeLatest(listActions[v].requestItems, handleTemplateRequestItemsSaga, v, listActions[v])),
    ]
  );
}