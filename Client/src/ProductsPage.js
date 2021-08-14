import React from 'react';
import Navbar from './NavbarComp';
import Product from './Product';
import ProductStore from './ProductStore';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            value: ''
        }

        this.searchProducts = () => {
            if (this.state.value === "") {
                toast('Introduceti un produs!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else {
                if (this.state.value) {
                    console.log(this.state.value)
                    this.getProducts(this.state.value);
                }
            }
        }
    }

    componentWillMount() {
        if (this.props.location.products) {
            if (this.props.location.products.length !== 0) {
                this.setState({ products: this.props.products });
                this.getProducts(this.state.value);
            }
        }
        if (this.props.location.value) {
            console.log(this.props.location.value);
            this.getProducts(this.props.location.value);
        }
        else if (this.state.value) {
            this.getProducts(this.state.value);
        }

    }

    async getProducts(value) {
        if (value) {
            console.log(value);
            let finalProducts = [];
            let splittedValue = value.split(' ');
            console.log(splittedValue);
            await ProductStore.getProducts().then((response) => {
                console.log(response);
                for (let i = 0; i < splittedValue.length; i++) {
                    for (let j = 0; j < response.length; j++) {
                        if (response[j].nume.includes(splittedValue[i].toLowerCase())) {
                            console.log(finalProducts);
                            if (this.state.products.length > 0) {
                                for (let k = 0; k < finalProducts.length; k++) {
                                    if (splittedValue[i].toLowerCase() !== finalProducts[k].nume) {
                                        finalProducts.push(response[j]);
                                    }
                                }
                                console.log(finalProducts);
                            }
                            else {
                                finalProducts.push(response[j]);
                            }
                        }
                    }
                    this.setState({ products: finalProducts });
                }
                console.log(finalProducts);
                console.log(this.state.products)
            })
        }
        else {
            toast('Introduceti un produs!', {
                autoClose: 5000, position: toast.POSITION.TOP_CENTER,
            })
        }
    }

    render() {
        return (
            <div>
                <Navbar searchBar={false} />
                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText className="searchBar" value={this.state.value} onChange={(e) => this.setState({ value: e.target.value })} placeholder="Search" />
                    </span>
                    <Button className="searchButton" icon="pi pi-arrow-right" className="p-button-raised p-button-text" onClick={this.searchProducts} />
                </div>
                <>{(this.state.products.length === 0) ?
                    <div className="centerCartMessage" style={{ color: "rgb(140, 35, 158)", textDecoration: "underline" }}><h2>Nu au fost gasite produse</h2></div>
                    :
                    <div className="products">
                        {this.state.products.map((product, index) => <Product key={index} productData={product} isOk={true} />)}
                    </div>
                }
                </>
            </div>
        )
    }
}

export default ProductsPage;