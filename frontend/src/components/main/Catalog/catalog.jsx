import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { listActions } from '../../../reducers';
import { statusTypes } from '../../../store/storeTypes';
import CatalogCategories from './CatalogCategories';
import Loading from '../../shared/Loading/loading';
import ItemCard from '../../shared/ItemCard/itemCard';
import CatalogSearchForm from './CatalogSearchForm';
import './main.css';
import ErrorBubble from '../../shared/Error/error';

const Catalog = ({ name, withSearch = false }) => {

  const categoryReducerName = 'categories';

  // получение запроса из строки поиска (URL)
  const [searchParams] = useSearchParams();
  const queryString = searchParams.get('q');

  // проброс state и dispatch из items
  const { items, status } = useSelector((state) => state[name]);
  // проброс state из categories (выбранный раздел)
  const { selectedItem } = useSelector((state) => state[categoryReducerName]);
  const dispatch = useDispatch();

  // сохранение строки поиска
  const [searchQuery, setSearchQuery] = useState(queryString);

  // Генерация обьекта поиска
  const prepareRequestParams = (offset = 0) => {
    let result = { offset };
    if (selectedItem.id !== undefined)
      result = {
        ...result,
        categoryId: selectedItem.id
      };
    if (searchQuery && searchQuery.length > 0)
      result = {
        ...result,
        q: searchQuery
      };

    return result;
  }

  const handleGetMoreItems = (params, update = false) => {
    dispatch(listActions[name].requestItems(params, update));
  }

  // отображаем список товаров при загрузке компонента
  // и при смене раздела каталога
  useEffect(() => {
    handleGetMoreItems(prepareRequestParams());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem, selectedItem.id, searchQuery])

  // сохраняем локально строки поиска
  const handleChangeSearchString = (query) => {
    let res = query.trim();
    setSearchQuery(res);
  }

  return (
    <section className="catalog">
      <h2 className="text-center">
        Каталог
      </h2>

      {withSearch &&
        <CatalogSearchForm
          handleChange={handleChangeSearchString}
          value={searchQuery} />
      }
      <CatalogCategories name={categoryReducerName} />
      {status === statusTypes.LOADING && items?.length === 0 ? (
        <Loading />
      ) :
        status === statusTypes.ERROR ? (
          <ErrorBubble />
        ) : (
          <div>
            {items?.length > 0 ? (
              <div className="row">
                {items.map((v) => (

                  <div className="col-4" key={`ts_col_${v.id}`}>
                    <ItemCard item={v} key={`ts_item_${v.id}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <span>Товаров не найдено...</span>
              </div>
            )}
            <div className="text-center more-info">
              {status === statusTypes.LOADING ? (
                <Loading />
              ) :
                status !== statusTypes.IDLE && (
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleGetMoreItems(prepareRequestParams(items.length), true)}
                  >
                    Загрузить ещё
                  </button>
                )}
            </div>
          </div>
        )}
    </section>
  )
};

Catalog.propTypes = {
  name: PropTypes.string.isRequired,
  withSearch: PropTypes.bool
};

Catalog.defaultProps = {
  name: 'items',
  withSearch: false
}

export default Catalog;