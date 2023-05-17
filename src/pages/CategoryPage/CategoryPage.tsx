import React, { FC, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { updateSearch } from '../../utils/helpers';

type Props = {
  className?: string;
  category: string;
};

type Response = {
  data: ProductItem[];
  pages: number;
};

export const CategoryPage: FC<Props> = ({ className, category }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') || '1';
  const sort = searchParams.get('sort') || 'newest';
  const count = searchParams.get('count') || '6';

  const onSortChange = (sort: string) => {
    updateSearch({ sort }, searchParams, setSearchParams);
  };

  const onCountChange = (count: string) => {
    updateSearch({ count }, searchParams, setSearchParams);
  };

  const onPageChange = (page: string) => {
    updateSearch({ page }, searchParams, setSearchParams);
  };

  const onQueryChange = (query: string) => {
    updateSearch({ query }, searchParams, setSearchParams);
  };

  const getProducts = async () => {
    return await getAllProducts(category, searchParams.toString());
  };

  const { isLoading, data, refetch } = useQuery<Response>(
    'products',
    getProducts,
  );

  const lenghtDataArray = data?.data.length;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);

  useEffect(() => {
    refetch();
  }, [searchParams]);

  useEffect(() => {
    const newMaxPages = data?.pages || 1;

    if (+page > newMaxPages) {
      onPageChange(newMaxPages.toString());
    }
  }, [data?.pages]);

  return (
    <>
      <BreadCrumbs />

      <main className={classNames(className, styles.main)}>
        <Categories />

        <div className={styles.content}>

          <div className={styles.settings}>
            <SettingsInput 
              className={styles.input} 
              title="Product name" 
              setQuery={onQueryChange}  
            />
            
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

          {(data && !isLoading && lenghtDataArray !== 0) ? (
            <List className={styles.list} products={data.data} />
          ):(
            <div className={styles.emptyList}>
              <div className={styles.emptyListIcon}/>
              <div className={styles.emptyListTitle}>
                No models were found matching the specified parameters
              </div>
            </div>
          )}

          {isLoading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}

          {data && lenghtDataArray !== 0 &&(
            <Pagination
              className={styles.pagination}
              currentPage={page}
              setSelectedPage={onPageChange}
              maxPage={data.pages}
            />
          )}
        </div>
      </main>
    </>
  );
};
