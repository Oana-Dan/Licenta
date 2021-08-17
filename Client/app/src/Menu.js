import React from 'react';
import Navbar from './NavbarComp';
import Product from './Product';
import ProductStore from './ProductStore';
import User from './User';
import UserStore from './UserStore';

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: []
        }
    }

    async getFinalProducts(response) {
        for (let i = 0; i < response.length; i++) {
            if (User.getEmail()) {
                let productsFromDatabase = await UserStore.getFavorites(User.getEmail());
                for (let j = 0; j < productsFromDatabase.length; j++) {
                    if (response[i].nume === productsFromDatabase[j].nume) {
                        response[i].isAddedFavorites = true;
                        break;
                    }
                    else if (response[i].nume !== productsFromDatabase[j].nume) {
                        response[i].isAddedFavorites = false;
                    }
                }
            }
        }
    }

    componentWillMount() {
        ProductStore.getProducts().then((response) => {
            this.getFinalProducts(response).then(() => {
                this.setState({ products: response });
            })
        });
    }

    refreshState = () => {
        ProductStore.getProducts().then((response) => {
            this.getFinalProducts(response).then(() => {
                this.setState({ products: response });
            })
        });
    }

    render() {
        return (
            <div>
                <Navbar searchBar={true} />
                <div className="products">
                    {
                        this.state.products.map((e, index) => <Product key={index} productData={e} isOk={true} refresh={this.refreshState} />)
                    }
                </div>
            </div>
        )
    }
}

export default Menu;