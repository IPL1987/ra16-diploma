import { createSlice } from '@reduxjs/toolkit'
import { statusTypes } from '../store/storeTypes';

// InitialState:
const defaultState = {
  item: {},
  status: statusTypes.IDLE
};

// ГЕНЕРАТОР функций-генераторов и функций-обработчиков
const generateItemDetailsReducer = ({ name, url, initialState = defaultState }) => createSlice({
  name: name,
  initialState: initialState,
  reducers: {

    // запрос на получение деталей одного элемента (с удалением всех старых данных)
    // статус: LOADING
    // payload: ID
    // Доп параметр (data), который передается в качестве параметра ActionCreator-у, 
    // попадает в action.payload.data
    // В результате в middleware доступны данные:
    // action.type - тип события
    // action.payload.name - имя reducer-ветки (rootActions[name] и rootResucers[name])
    // action.payload.url - URL backend-сервера для запросов этой ветки reducer-ов
    // action.payload.data - доп. параметры для формирования запроса к серверу
    requestItemDetails: {
      reducer: (state, action) => {
        //state.item = action.payload.data;
        state.status = statusTypes.LOADING;
      },
      prepare: (data) => ({
        payload: {
          name,
          url,
          data
        }
      })
    },

    // заполнение информации о выбранном элементе в случае успеха (с удалением старой информации)
    // статус: SUCCESS
    // payload: {...}
    // Middleware запрос НЕ ПЕРЕХВАТЫВАЕТ
    setItemDetailsSuccess(state, action) {
      state.item = action.payload;
      state.status = statusTypes.SUCCESS;
    },

    // Неуспешное получение информации о выбранном элементе (с удалением старой информации)
    // статус: ERROR
    // payload: -
    // Middleware запрос НЕ ПЕРЕХВАТЫВАЕТ
    setItemDetailsError(state, action) {
      state.item = {};
      state.status = statusTypes.ERROR;
    },
  },
});


export default generateItemDetailsReducer;