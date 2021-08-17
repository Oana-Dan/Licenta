import React from 'react';
import Navbar from './NavbarComp';
import Product from './Product';
import ProductStore from './ProductStore';
import User from './User';
import UserStore from './UserStore';
import { Carousel } from 'primereact/carousel';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isRegisterVisible: false,
            simpleProducts: [],
            products: [],
            days: [],
            orderedProducts: [],
            bestOrderedProducts: []
        }

        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 3
            },
            {
                breakpoint: '600px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '480px',
                numVisible: 1,
                numScroll: 1
            }
        ];

        this.productTemplate = this.productTemplate.bind(this);
    }

    productTemplate(product) {
        return (
            <Product productData={product} isOk={true} />
        );
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

    async getOrderedProducts(response) {
        for (let i = 0; i < response.length; i++) {
            let productsFromDatabase = await ProductStore.getDaysOfWeeks();
            let days = productsFromDatabase;
            this.setState({ days: days });
            let last7Days = days.slice(-7);
            let totalQuantity = 0;
            for (let j = 0; j < last7Days.length; j++) {
                let product = await ProductStore.getDayWeekOrderedProduct(last7Days[j].data, response[i].nume);
                if (product.message !== "not found") {
                    totalQuantity += product.cantitate;
                }
                response[i].totalQuantity = totalQuantity;
            }
        }
    }



    componentWillMount() {
        ProductStore.getProducts().then((response) => {
            this.setState({ simpleProducts: response });
            this.getFinalProducts(response).then(() => {
                this.setState({ products: response });
            })
            this.getOrderedProducts(response).then(() => {
                this.setState({ orderedProducts: response });
                let orderedProducts = this.state.orderedProducts;
                orderedProducts.sort(function (a, b) {
                    return b.totalQuantity - a.totalQuantity
                })
                let bestOrderedProducts = orderedProducts.slice(0, 5);
                this.setState({ bestOrderedProducts: bestOrderedProducts });
            })
        });
    }

    render() {
        return (
            // this.state.isRegisterVisible ?
            // <Register />
            // :
            <div>
                <Navbar searchBar={true} />
                <div className="carouselContainer">
                    <Carousel value={this.state.bestOrderedProducts} numVisible={1} numScroll={1} responsiveOptions={this.responsiveOptions} className="custom-carousel" circular
                        autoplayInterval={5000} itemTemplate={this.productTemplate} header={<h5>Cele mai cumparate produse</h5>} />
                </div>
            </div>
        )
    }
}

export default Home;