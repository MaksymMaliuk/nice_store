import React, { FC } from 'react';
import './styles/main.scss';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CategoryPage } from './pages/CategoryPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { ContactsPage } from './pages/ContactsPage';
import { ItemPage } from './pages/ItemPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import styles from './App.module.scss';

export const App: FC = () => {
  return (
    <div className="App">
      <Header className={styles.header} />

      <main className={styles.main} >
        <Routes>
          <Route path='/' element={<HomePage />} />

          <Route path="category/:selectedCategory">
            <Route index element={<CategoryPage />} />
            <Route path=':itemId' element={<ItemPage />} />
          </Route>

          <Route path='favourites' element={<FavouritesPage />} />

          <Route path='contacts' element={<ContactsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <Footer className={styles.footer} />
    </div>
  );
};

export default App;
