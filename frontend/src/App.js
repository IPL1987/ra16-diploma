import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './layouts/Footer/footer';
import Header from './layouts/Header/header.jsx';
import Main from './layouts/Main/main';
import MainPage from './layouts/MainPage/mainPage';
import CatalogPage from './layouts/CatalogPage/catalogPage';
import CartPage from './layouts/CartPage/cartPage';
import ItemPage from './layouts/ItemPage/itemPage';
import AboutPage from './layouts/AboutPage/aboutPage';
import ContactsPage from './layouts/ContactsPage/contactsPage';
import ErrorPage from './layouts/ErrorPage/errorPage';
import { MenuData } from './const/menu';
import { PayData } from './const/payData';
import { ContactsData } from './const/contacts';
import './main.css';

const App = () => (
  <div className="container">
    <Router>
      <Header menu={MenuData} searchUrl="/catalog" />
      <Main>
        <Routes>
          <Route path="/">
            <Route index element={<MainPage />} />
            <Route path="/products/:id" element={<ItemPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contacts" element={<ContactsPage data={ContactsData} />} />
            <Route path="/about" element={<AboutPage data={ContactsData} />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Main>
      <Footer menu={MenuData} payData={PayData} contacts={ContactsData} />
    </Router>
  </div>
);

export default App;