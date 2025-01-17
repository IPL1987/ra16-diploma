import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listActions } from '../../../reducers';
import { statusTypes } from '../../../store/storeTypes';
import ErrorBubble from '../../shared/Error/error';

const CatalogCategories = ({ name }) => {

  const { items, selectedItem, status } = useSelector((state) => state[name]);
  const dispatch = useDispatch();

  // загружаем список разделов каталога
  useEffect(() => {
    dispatch(listActions[name].requestItems());
  }, [dispatch, name])

  // смена разделов каталога
  const handleChangeCatalog = (e, item) => {
    e.preventDefault();
    // вызываем selectItem из reducers[name] 
    // и сохраняем выбранный раздел в STORE
    dispatch(listActions[name].selectItem(item));
  }
  // сообщение об ошибке
  if (status === statusTypes.ERROR)
    return <ErrorBubble />

  return (
    <ul className="catalog-categories nav justify-content-center">
      {items?.length > 0 && (
        <li className="nav-item" key={`ch-0`}>
          <Link
            className={`nav-link ${selectedItem.id ? '' : 'active'}`}
            to=""
            onClick={(e) => handleChangeCatalog(e, {})}
          >
            Все
          </Link>
        </li>
      )}
      {items?.map((v) => (
        <li className="nav-item" key={`ch-${v.id}`}>
          <Link
            className={`nav-link ${v.id === selectedItem.id ? 'active' : ''}`}
            to=""
            onClick={(e) => handleChangeCatalog(e, v)}
          >
            {v.title}
          </Link>
        </li>
      ))}
    </ul>
  )
};

CatalogCategories.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.object
};

CatalogCategories.defaultProps = {
  name: 'categories'
}

export default CatalogCategories;