import React from 'react';
import Navbar from './NavbarComp';
import Product from './Product';
import ProductStore from './ProductStore';
import UserStore from './UserStore';
import User from './User';

class Drinks extends React.Component {
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
        let productsFromDatabase = [];
        ProductStore.getProductsByType("bauturi").then((response) => {
            this.getFinalProducts(response).then(() => {
                productsFromDatabase = response;
                this.setState({ products: productsFromDatabase });
            })
        })
    }

    render() {
        return (
            <div>
                <Navbar searchBar={true} />
                <div className="products">
                    {
                        this.state.products.map((e, index) => <Product key={index} productData={e} isOk={true} />)
                    }
                </div>
            </div>
        )
    }
}

export default Drinks;