import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { storageActions } from '../../../reducers';
import './main.css';

const Cart = ({ name }) => {

  // проброс Storage из State и dispatch
  const cart = useSelector((state) => state[name].items);
  const dispatch = useDispatch();

  // удаление элемента из корзины по одному за клик
  const handleRemoveItem = (id, size) => {
    // поиск аналогичного элемента в корзине
    const index = cart.findIndex((item) => item.id === id && item.size === size);

    // если найден то удаляем элемент из массива
    if (cart[index].count === 1) {
      // вызоваем setItems с новым массивом без удаляемого элемента
      dispatch(storageActions[name].setItems([...cart.filter((item, idx) => idx !== index)], name));
    } else {
      // уменьшаем количество элементов на 1
      let curItem = {
        ...cart[index],
        count: cart[index].count - 1
      }
      // вызоваем setItems с новым массивом с новым элементом
      dispatch(storageActions[name].setItems([...cart.filter((item, idx) => idx !== index), curItem], name));
    }
  }

  // расчет стоимости покупок в корзине
  const total = cart.reduce((res, item) => (res + item.count * item.price), 0);

  return (
    <section className="cart">
      <h2 className="text-center">Корзина</h2>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Артикул</th>
            <th scope="col">Название</th>
            <th scope="col">Размер</th>
            <th scope="col">Кол-во</th>
            <th scope="col">Цена</th>
            <th scope="col">Итоговая стоимость</th>
            <th scope="col">Действия</th>
          </tr>
        </thead>
        {cart?.length ? (
          <tbody>
            {cart.map((v, key) => (
              <tr key={`cart-${v.id}-${key}`}>
                <th scope="row">{v.sku}</th>
                <td><NavLink to={`/products/${v.id}`}>{v.title}</NavLink></td>
                <td>{v.size}</td>
                <td>{v.count}</td>
                <td>{v.price.toLocaleString()} руб.</td>
                <td>{(v.price * v.count).toLocaleString()} руб.</td>
                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemoveItem(v.id, v.size)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5" className="text-right">Общая стоимость</td>
              <td>{total.toLocaleString()} руб.</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="100%" className="text-center">
                Корзина пуста
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </section >
  )
};

Cart.propTypes = {
  name: PropTypes.string.isRequired,
};

Cart.defaultProps = {
  name: 'storage_cart',
}

export default Cart;