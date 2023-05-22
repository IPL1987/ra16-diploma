import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loading from '../../shared/Loading/loading';
import ErrorBubble from '../../shared/Error/error';
import { itemActions, storageActions } from '../../../reducers';
import { statusTypes } from '../../../store/storeTypes';
import './main.css';
import ItemImages from '../../shared/ItemImages/itemImages';

const ItemDetails = ({ name }) => {

  const cartStorageName = 'storage_cart';

  // проброс Storage из State
  const cart = useSelector((state) => state[cartStorageName].items);

  // проброс state и dispatch для ITEM
  const { item, status } = useSelector((state) => state[name]);

  const dispatch = useDispatch();

  // параметры из URL
  const { id } = useParams();

  const navigate = useNavigate();

  // Выбраннный размер
  const [selectedSize, setSelectedSize] = useState('');

  // Количество товара
  const [count, setCount] = useState(1);

  // загрузка данных для карточки товара
  useEffect(() => {
    dispatch(itemActions[name].requestItemDetails(id, name));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Выбор размера
  const handleUpdateSelectedSizeList = (size) => {
    // убираем имеющийся
    if (selectedSize === size)
      setSelectedSize('');
    else {
      // иначе сохраняем выбранный размер в localState
      setSelectedSize(size);
    }
  }

  // Добавление количества товара в корзине (до 10 штук)
  const handleIncCount = () => {
    setCount(count < 10 ? count + 1 : count);
  }

  // Уменьшени е количества едениц товара
  const handleDecCount = () => {
    setCount(count > 1 ? count - 1 : count);
  }

  // Добавление в корзину
  const handleAddToCart = () => {
    // добавляемый элемент
    const cartItem = {
      id: item.id,
      title: item.title,
      sku: item.sku,
      size: selectedSize,
      price: item.price,
      count: count
    }

    // Проверка ранее добавленного, такого же товара в корзине
    const index = cart.findIndex((item) => item.id === cartItem.id && item.size === cartItem.size);
    if (index === -1) {
      // Если нет такого элемента нет, добавляем новый
      // через dispatch, чтобы сработало событие, сработал middleware,
      // который запишет новые данные в Storage
      dispatch(storageActions[cartStorageName].setItems([...cart, cartItem], cartStorageName));
    } else {
      // Изменяем количество элементов
      let curItem = {
        ...cart[index],
        count: cart[index].count + cartItem.count
      }
      dispatch(storageActions[cartStorageName].setItems([...cart.filter((item, idx) => idx !== index), curItem], cartStorageName));
    }

    // Переходим в корзину
    navigate('/cart');
  }

  // LOADING  - глобальная загрузка
  if (status === statusTypes.LOADING)
    return (
      <section className="catalog-item">
        <Loading />
      </section>
    )

  // ERROR  - сообщение об ошибке
  if (status === statusTypes.ERROR)
    return (
      <section className="catalog-item">
        <ErrorBubble />
      </section>
    )

  return (
    <section className="catalog-item">
      <h2 className="text-center">{item.title}</h2>
      <div className="row">
        <div className="col-5 item-card-photo">
          <ItemImages
            images={item.images}
            title={item.title}
          />
          {item.oldPrice && (
            <span className="item-card-price-old">{item.oldPrice.toLocaleString()} р.</span>
          )}
          {item.price && (
            <span className={`item-card-price${item.oldPrice ? '-new' : ''}`}>{item.price?.toLocaleString()} р.</span>
          )}
        </div>
        <div className="col-7">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Артикул</td>
                <td>{item.sku}</td>
              </tr>
              <tr>
                <td>Производитель</td>
                <td>{item.manufacturer}</td>
              </tr>
              <tr>
                <td>Цвет</td>
                <td>{item.color}</td>
              </tr>
              <tr>
                <td>Материалы</td>
                <td>{item.material}</td>
              </tr>
              <tr>
                <td>Сезон</td>
                <td>{item.season}</td>
              </tr>
              <tr>
                <td>Повод</td>
                <td>{item.reason}</td>
              </tr>
            </tbody>
          </table>
          <div className="text-center">
            <p>
              Размеры в наличии:
              {item.sizes?.map((v) => (
                <button key={`sz-${v.size}`}
                  className={`catalog-item-size ${v.size === selectedSize ? 'selected' : ''} ${v.available ? '' : 'disabled'}`}
                  disabled={!v.available}
                  onClick={() => handleUpdateSelectedSizeList(v.size)}
                >
                  {v.size}
                </button>
              ))}
            </p>
            <p>Количество: <span className="btn-group btn-group-sm pl-2">
              <button className="btn btn-secondary" disabled={selectedSize.length === 0} onClick={handleDecCount}>-</button>
              <span className={`btn btn-outline-primary ${selectedSize.length === 0 ? 'text-gray' : 'text-darkgray'}`} disabled={selectedSize.length === 0}>{count}</span>
              <button className="btn btn-secondary" disabled={selectedSize.length === 0} onClick={handleIncCount}>+</button>
            </span>
            </p>
          </div>
          <button
            className="btn btn-danger btn-block btn-lg"
            disabled={selectedSize.length === 0}
            onClick={handleAddToCart}
          >
            В корзину
          </button>
        </div>
      </div>
    </section>
  )
};

ItemDetails.propTypes = {
  name: PropTypes.string.isRequired,
  withSearch: PropTypes.bool
};

ItemDetails.defaultProps = {
  name: 'itemDetails',
}

export default ItemDetails;