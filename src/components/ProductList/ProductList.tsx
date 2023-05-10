import React, { FC } from 'react';
import productList from './ProductList.module.scss';
import { Button } from '../Button';
import { ProductCard } from '../ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import { Phone } from '../types/types';

import 'swiper/css';
import 'swiper/css/scrollbar';
import { Link } from 'react-router-dom';

type ProductListProps = {
  title: string;
  products: Phone[];
};

export const ProductList: FC<ProductListProps> = ({ title, products }) => {
  return (
    <section className={productList.productList}>
      <h2 className={productList.title}>
        {title}
      </h2>

      <Swiper
        freeMode={true}
        slidesPerView={1.5}
        grabCursor={true}
        modules={[FreeMode]}
        className={productList.products}
        spaceBetween={32}
        breakpoints={{
          490: {
            slidesPerView: 1.9,
          },

          650: {
            slidesPerView: 2.5,
          },

          768: {
            spaceBetween: 20,
            slidesPerView: 2.9,
          },

          900: {
            slidesPerView: 3.5,
          },

          1200: {
            slidesPerView: 5,
          }
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard phone={product} />
          </SwiperSlide>
        ))}

      </Swiper>

      <Link to='category/phones'>
        <Button
          text={'Shop Now'}
          size={'large'}
          type={'secondary'}
        />
      </Link>

    </section >
  );
};