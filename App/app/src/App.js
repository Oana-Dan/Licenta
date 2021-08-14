import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Favorites from './Favorites';
import Cart from './Cart';
import Register from './Register';
import Login from './Login';
import Menu from './Menu';
import SoupProducts from './SoupProducts';
import TablesMap from './TablesMap';
import TableReservation from './TableReservation';
import TablesMapAvailability from './TablesMapAvailability';
import Appetizer from './Appetizer';
import MainDish from './MainDish';
import FastFood from './FastFood';
import Dessert from './Dessert';
import Drinks from './Drinks';
import Contact from './Contact';
import ProductPage from './ProductPage';
import ProductsPage from './ProductsPage';
import OrdersReport from './OrdersReport';
import ProductsReport from './ProductsReport';
import Order from './Order';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <main>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/harta" component={TablesMap} exact />
            <Route path="/rezervare/masa:numar" component={TableReservation} exact />
            <Route path="/verificare_disponibilitate_mese" component={TablesMapAvailability} exact />
            <Route path="/profil" component={Profile} exact />
            <Route path="/favorite" component={Favorites} exact />
            <Route path="/cos" component={Cart} exact />
            <Route path="/meniu" component={Menu} exact />
            <Route path="/produse/:nume" component={ProductPage} exact />
            <Route path="/aperitive" component={Appetizer} exact />
            <Route path="/supe_ciorbe" component={SoupProducts} exact />
            <Route path="/fel_principal" component={MainDish} exact />
            <Route path="/fast_food" component={FastFood} exact />
            <Route path="/desert" component={Dessert} exact />
            <Route path="/bauturi" component={Drinks} exact />
            <Route path="/contact" component={Contact} exact />
            <Route path="/inregistrare" component={Register} exact />
            <Route path="/logare" component={Login} exact />
            <Route path="/produse_cautate" component={ProductsPage} exact />
            <Route path="/rapoarte_comenzi" component={OrdersReport} exact />
            <Route path="/rapoarte_produse" component={ProductsReport} exact />
            <Route path="/comanda" component={Order} exact />
            <Redirect to="/" />
          </Switch>
        </main>
      </Router>
    )
  }
}

export default App;
