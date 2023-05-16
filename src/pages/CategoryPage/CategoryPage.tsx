import React, { FC, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SettingsInput } from '../../components/SettingsInput';
import { SettingsSelect } from '../../components/SettingsSelect';
import classNames from 'classnames';
import styles from './CategoryPage.module.scss';
import { List } from '../../components/List';
import { Categories } from '../../components/Categories';
import { Pagination } from '../../components/Pagination';
import { useQuery } from 'react-query';
import { ProductItem } from '../../types/types';
import { Loader } from '../../components/Loader';
import { BreadCrumbs } from '../../components/BreadCrumbs';
import { getAllProducts } from '../../api/products';
import { ToastContainer } from 'react-toastify';
import { Color } from '../../types/Color';

type Props = {
  className?: string;
  category: string;
};

type Response = {
  data: ProductItem[];
  pages: number;
};

export const CategoryPage: FC<Props> = ({ className, category }) => {
  const { selectedCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sort') || 'newest';
  const count = searchParams.get('count') || '6';

  function updateSearch(params: { [key: string]: string | null }) {
    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    setSearchParams(searchParams);
  }

  const onSortChange = (sort: string) => {
    updateSearch({ sort });
  };

  const onCountChange = (count: string) => {
    updateSearch({ count });
  };

  const onPageChange = (page: string) => {
    updateSearch({ page });
  };

  const getProducts = async () => {
    return await getAllProducts(category, searchParams.toString());
  };

  const { isLoading, data, refetch } = useQuery<Response>(
    'products',
    getProducts,
  );

  useEffect(() => {
    refetch();
  }, [searchParams]);

  useEffect(() => {
    const newMaxPages = data?.pages || 1;

    if (+page > newMaxPages) {
      onPageChange(newMaxPages.toString());
    }
  }, [data?.pages]);

  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);

  return (
    <>
      <BreadCrumbs />

      <main className={classNames(className, styles.main)}>
        <Categories />

        <div className={styles.content}>
          <p className={styles.title}>{selectedCategory}</p>

          <div className={styles.settings}>
            <SettingsInput className={styles.input} title="Product name" />

            <SettingsSelect
              className={styles.select}
              title="Sort by"
              selectedlValue={sort}
              options={['newest', 'oldest', 'cheapest']}
              setSelected={onSortChange}
            />

            <SettingsSelect
              className={styles.select}
              title="Items per page"
              selectedlValue={count}
              options={['6', '12', '18']}
              setSelected={onCountChange}
            />
          </div>

          {data && !isLoading ? (
            <List className={styles.list} products={data.data} />
          ) : (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}

          {data && (
            <Pagination
              className={styles.pagination}
              currentPage={page}
              setSelectedPage={onPageChange}
              maxPage={data.pages}
            />
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          toastStyle={{color: Color.Grey}}
        />
      </main>
    </>
  );
};
