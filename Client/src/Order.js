import React from 'react';
import Navbar from './NavbarComp';
import User from './User';
import UserStore from './UserStore';
import ProductStore from './ProductStore';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('./Images', false, /\.(png|jpe?g|svg)$/));

class Order extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            order: null,
            userEmail: '',
            products: [],
            totalPrice: 0
        }

        this.productBody = (rowData) => {
            let imageSource;
            for (let i = 0; i < images.length; i++) {
                if (images[i].default.includes(`${rowData.nume}`)) {
                    imageSource = images[i].default;
                }
            }
            return (
                <div>
                    <img src={imageSource} width="90vw" height="70vh" />
                    <div style={{ marginTop: "1vh" }}>{rowData.descriere}</div>
                </div>
            )
        }

        this.priceBody = (rowData) => {
            return (
                <div>{rowData.pret} lei</div>
            )
        }

        this.goBack = () => {
            window.history.back();
        }
    }

    async getFinalProducts() {
        let totalPrice = 0;
        let orderedProducts = await UserStore.getOrderedProducts(User.getEmail(), this.props.location.order.ID);
        for (let i = 0; i < orderedProducts.length; i++) {
            let product = await ProductStore.getProduct(orderedProducts[i].nume);
            orderedProducts[i].pret = product.pret;
            orderedProducts[i].descriere = product.descriere;
            totalPrice += orderedProducts[i].pret * orderedProducts[i].cantitate;
        }
        this.setState({
            products: orderedProducts,
            totalPrice: totalPrice
        });
    }

    componentWillMount() {
        this.setState({
            order: this.props.location.order,
            userEmail: User.getEmail()
        });

        this.getFinalProducts();
        if (this.props.location.order.livrata === true) {
            this.props.location.order.livrata = "da";
        }
        else if (this.props.location.order.livrata === false) {
            this.props.location.order.livrata = "nu";
        }
        else if (this.props.location.order.livrata === null) {
            this.props.location.order.livrata = "-";
        }
        if (this.props.location.order.numarMasa === null) {
            this.props.location.order.numarMasa = "-";
        }
        if (this.props.location.order.tipPlata === null) {
            this.props.location.order.tipPlata = "-";
        }
    }

    render() {
        return (
            <div>
                <Navbar searchBar={true} />
                <div className="orderContainer">
                    <div>ID: {this.props.location.order.ID}</div>
                    <div>Data: {this.props.location.order.data}</div>
                    <div>Tip plata: {this.props.location.order.tipPlata}</div>
                    <div>Stare plata: {this.props.location.order.starePlata}</div>
                    <div>Numar masa: {this.props.location.order.ordernumarMasa}</div>
                    <div>Stare comanda: {this.props.location.order.stare}</div>
                    <div>Livrata la domiciliu: {this.props.location.order.livrata}</div>
                </div>
                <div className="orderedProducts">
                    <DataTable value={this.state.products} header="Produse">
                        <Column style={{ textAlign: "center" }} header="Produs" body={this.productBody} />
                        <Column style={{ textAlign: "center" }} header="Cantitate" field="cantitate" />
                        <Column style={{ textAlign: "center" }} header="Pret" body={this.priceBody} />
                    </DataTable>
                </div>
                <div className="totalPriceContainer">
                    <div className="totalPrice" style={{ marginRight: "11vw", marginBottom: "3vh" }}>{this.state.totalPrice} lei</div>
                </div>
                <div className="backButtonProduct">
                    <Button label="Inapoi" icon="pi pi-chevron-left" onClick={this.goBack} className="p-button-raised p-button-text" />
                </div>
            </div>
        )
    }
}

export default Order;