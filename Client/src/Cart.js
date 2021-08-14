import React from 'react';
import Navbar from './NavbarComp';
import UserStore from './UserStore';
import ProductStore from './ProductStore';
import User from './User';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('./Images', false, /\.(png|jpe?g|svg)$/));

class Cart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            finalProducts: [],
            isLoggedIn: false,
            userEmail: '',
            total: 0,
            isPlacedOrder: false,
            ID: 0,
            wantToDelete: false,
            acceptDelete: false,
            rowDataToDelete: null,
            wantToPlaceOrder: false,
            openLoginDialog: false,
            loginEmail: '',
            loginParola: ''
        }

        this.productBody = (rowData, row) => {
            let imageSource;
            for (let i = 0; i < images.length; i++) {
                if (images[i].default.includes(`${rowData.nume}`)) {
                    imageSource = images[i].default;
                }
            }
            return (
                <div>
                    <img src={imageSource} width="90vw" height="70vh" />
                    <div style={{ textAlign: 'center' }}>{rowData.descriere}</div>
                </div>
            )
        }

        this.quantityBody = (rowData, row) => {
            let products = [...this.state.finalProducts];
            let product = { ...products[row.rowIndex] };
            let quantity = product.cantitate;
            return (
                <div className='outer'>
                    <span className='inner'>
                        <Button icon="pi pi-minus" className="p-button-raised p-button-text p-button-sm" onClick={() => this.decreaseQuantity(rowData, row)} />
                    </span>
                    <span className='inner'>{quantity}</span>
                    <span className='inner'>
                        <Button icon="pi pi-plus" className="p-button-raised p-button-text p-button-sm" onClick={() => this.increaseQuantity(rowData, row)} />
                    </span>
                </div>
            )
        }

        this.increaseQuantity = (rowData, row) => {
            if (this.state.isLoggedIn) {
                if (rowData.cantitate <= 9) {
                    let newQuantity = rowData.cantitate + 1;
                    let cartProduct = { nume: `${rowData.nume}`, cantitate: newQuantity };
                    UserStore.updateProductCart(User.getEmail(), "in procesare", rowData.nume, cartProduct);
                    let products = [...this.state.finalProducts];
                    let product = { ...products[row.rowIndex] };
                    product.cantitate += 1;
                    product.subtotal = product.cantitate * product.pret;
                    products[row.rowIndex] = product;
                    let total = this.state.total;
                    total += product.pret;
                    this.setState({
                        finalProducts: products,
                        total: total
                    });
                }
            }
        }

        this.decreaseQuantity = (rowData, row) => {
            if (this.state.isLoggedIn) {
                if (rowData.cantitate >= 2) {
                    let newQuantity = rowData.cantitate - 1;
                    let cartProduct = { nume: `${rowData.nume}`, cantitate: newQuantity };
                    UserStore.updateProductCart(User.getEmail(), "in procesare", rowData.nume, cartProduct);
                    let products = [...this.state.finalProducts];
                    let product = { ...products[row.rowIndex] };
                    product.cantitate -= 1;
                    product.subtotal = product.cantitate * product.pret;
                    products[row.rowIndex] = product;
                    this.setState({ finalProducts: products });
                    let total = this.state.total;
                    total -= product.pret;
                    this.setState({
                        finalProducts: products,
                        total: total
                    });
                }
            }
        }

        this.deleteBody = (rowData, row) => {
            let products = [...this.state.finalProducts];
            let product = { ...products[row.rowIndex] };
            let subtotal = product.subtotal;
            return (
                <div className='deleteItem'>
                    <div style={{ marginTop: '5vh' }}>
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-primary p-button-outlined" onClick={() => this.delete(rowData, row)} />
                    </div>
                    <div style={{ marginTop: '2vh' }}>{subtotal} lei </div>
                </div>
            )
        }

        this.acceptDelete = () => {
            UserStore.deleteCartProduct(User.getEmail(), "in procesare", this.state.rowDataToDelete.nume).then(() => {
                UserStore.getProductsCart(User.getEmail(), "in procesare").then((response) => {
                    this.getFinalProducts(response).then(() => {
                        this.setState({
                            finalProducts: response,
                            wantToDelete: false
                        });
                    })
                })
            })
        }

        this.rejectDelete = () => {
            this.setState({ wantToDelete: false });
        }

        this.hideDeleteDialog = () => {
            this.setState({ wantToDelete: false });
        }

        this.delete = (rowData, row) => {
            this.setState({
                wantToDelete: true,
                rowDataToDelete: rowData
            });
        }

        this.acceptPlaceOrder = () => {
            let date = new Date();
            let finalDate = "";
            if (date.getDate() <= 9) {
                finalDate += "0" + date.getDate() + "-";
            }
            else {
                finalDate += date.getDate() + "-";
            }
            if ((date.getMonth() + 1) <= 9) {
                finalDate += "0" + (date.getMonth() + 1) + "-";
            }
            else {
                finalDate += date.getMonth() + "-";
            }
            finalDate += date.getFullYear();
            let order = { pret: `${this.state.total}`, data: finalDate };
            let ID = 0;
            UserStore.addOrder(this.state.userEmail, order).then((response) => {
                ID = response.ID;
                for (let i = 0; i < this.state.finalProducts.length; i++) {
                    let product = { nume: `${this.state.finalProducts[i].nume}`, cantitate: `${this.state.finalProducts[i].cantitate}` };
                    UserStore.addOrderedProduct(this.state.userEmail, ID, product);
                    ProductStore.getDayWeek(finalDate).then((dayOfWeek) => {
                        if (dayOfWeek.message === "not found") {
                            let newDay = { data: `${finalDate}` };
                            ProductStore.addDayOfWeek(newDay);
                            ProductStore.getDayWeekOrderedProduct(finalDate, this.state.finalProducts[i].nume).then((product) => {
                                if (product.message === "not found") {
                                    let newOrderedProduct = { nume: `${this.state.finalProducts[i].nume}`, cantitate: `${this.state.finalProducts[i].cantitate}` };
                                    ProductStore.addDayWeekOrderedProduct(finalDate, newOrderedProduct);
                                }
                                else {
                                    let quantity = product.cantitate;
                                    quantity += this.state.finalProducts[i].cantitate;
                                    let updatedOrderedProduct = { nume: `${this.state.finalProducts[i].nume}`, cantitate: quantity };
                                    ProductStore.updateDayWeekOrderedProduct(finalDate, this.state.finalProducts[i].nume, updatedOrderedProduct);
                                }
                            })
                        }
                        else {
                            let name = this.state.finalProducts[i].nume;
                            let quantity = this.state.finalProducts[i].cantitate;
                            ProductStore.getDayWeekOrderedProduct(finalDate, name).then((product) => {
                                if (product.message === "not found") {
                                    let newOrderedProduct = { nume: `${name}`, cantitate: `${quantity}` };
                                    ProductStore.addDayWeekOrderedProduct(finalDate, newOrderedProduct);
                                }
                                else {
                                    let newQuantity = product.cantitate;
                                    newQuantity += quantity;
                                    let updatedOrderedProduct = { nume: `${name}`, cantitate: newQuantity };
                                    ProductStore.updateDayWeekOrderedProduct(finalDate, name, updatedOrderedProduct);
                                }
                            })
                        }
                    })
                }
                UserStore.updateCartState(this.state.userEmail, "in procesare", { stare: "procesat" });
                let newShoppingCart = { data: `${finalDate}` };
                UserStore.addShoppingCart(this.state.userEmail, newShoppingCart);
                this.setState({
                    isPlacedOrder: true,
                    ID: ID,
                    wantToPlaceOrder: false
                });
                if (User.getIsLoggedIn()) {
                    this.setState({
                        isLoggedIn: User.getIsLoggedIn(),
                        userEmail: User.getEmail()
                    })
                    UserStore.getProductsCart(User.getEmail(), 'in procesare').then((response) => {
                        this.getFinalProducts(response).then(() => {
                            let totalPrice = 0;
                            for (let i = 0; i < response.length; i++) {
                                totalPrice += response[i].subtotal;
                            }
                            this.setState({
                                finalProducts: response,
                                total: totalPrice
                            })
                        })
                    })
                }
            })
        }

        this.rejectPlaceOrder = () => {
            this.setState({ wantToPlaceOrder: false });
        }

        this.hidePlaceOrderDialog = () => {
            this.setState({ wantToPlaceOrder: false });
        }

        this.placeOrder = () => {
            this.setState({ wantToPlaceOrder: true });
        }

        this.Submit = () => {
            let OK = true;
            if (this.state.loginEmail === "") {
                OK = false;
                toast('Email-ul trebuie completat!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else if (this.state.loginParola === "") {
                OK = false;
                toast('Parola trebuie completata!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else {
                let ok = false;
                let promise = UserStore.getUsers();
                promise.then(response => {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].email === this.state.loginEmail && response[i].parola === this.state.loginParola) {
                            this.setState({ isLoggedIn: true })
                            User.setIsLoggedIn(this.state.isLoggedIn);
                            User.setEmail(this.state.loginEmail);
                            ok = true;
                            if (User.getIsLoggedIn()) {
                                this.setState({
                                    isLoggedIn: User.getIsLoggedIn(),
                                    userEmail: User.getEmail()
                                })
                                UserStore.getProductsCart(User.getEmail(), 'in procesare').then((response) => {
                                    this.getFinalProducts(response).then(() => {
                                        let totalPrice = 0;
                                        for (let i = 0; i < response.length; i++) {
                                            totalPrice += response[i].subtotal;
                                        }
                                        if (response.message === "not found") {
                                            this.setState({
                                                finalProducts: [],
                                                total: totalPrice
                                            })
                                        }
                                        else {
                                            this.setState({
                                                finalProducts: response,
                                                total: totalPrice
                                            })
                                        }
                                    })
                                })
                            }
                        }
                        else if (response[i].email === this.state.loginEmail && response[i].parola !== this.state.loginParola) {
                            toast('Email-ul sau parola nu au fost introduse corect!', {
                                autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                            })
                            ok = true;
                        }
                    }
                    if (ok === false) {
                        toast('Utilizatorul cu acest email nu exista! Mergeti la pagina de inregistrare!', {
                            autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                        })
                    }
                })
            }
        }

        this.openLoginDialog = () => {
            this.setState({ openLoginDialog: true });
        }

        this.hideDialog = () => {
            this.setState({ openLoginDialog: false });
        }
    }

    async getFinalProducts(products) {
        let totalPrice = 0;
        for (let i = 0; i < products.length; i++) {
            await ProductStore.getProduct(products[i].nume).then((product) => {
                products[i].descriere = product.descriere;
                products[i].pret = product.pret;
                products[i].subtotal = products[i].cantitate * product.pret;
                totalPrice += products[i].subtotal;
            })
        }
        this.setState({ total: totalPrice })
    }

    componentWillMount() {
        if (User.getIsLoggedIn()) {
            this.setState({
                isLoggedIn: User.getIsLoggedIn(),
                userEmail: User.getEmail()
            })
            UserStore.getProductsCart(User.getEmail(), 'in procesare').then((response) => {
                this.getFinalProducts(response).then(() => {
                    let totalPrice = 0;
                    for (let i = 0; i < response.length; i++) {
                        totalPrice += response[i].subtotal;
                    }
                    if (response.message === "not found") {
                        this.setState({
                            finalProducts: [],
                            total: totalPrice
                        })
                    }
                    else {
                        this.setState({
                            finalProducts: response,
                            total: totalPrice
                        })
                    }
                })
            })
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <>
                {this.state.isLoggedIn ?
                    <>
                        {(this.state.finalProducts.length === 0) ?
                            <div><Navbar searchBar={true} />
                                <h2 style={{ color: "rgb(140, 35, 158)" }} className="centerCartMessage">
                                    Cosul de cumparaturi este gol
                                </h2>
                                <Link className="centerCartMessage" to="/meniu" style={{ color: "rgb(140, 35, 158)" }}>Vizualizeaza meniul</Link>
                            </div>
                            :
                            <>
                                {this.state.isPlacedOrder ?
                                    <>
                                        <Navbar searchBar={true} />
                                        <h2 style={{ color: "rgb(140, 35, 158)" }} className="centerCartMessage">
                                            Comanda a fost plasata cu succes!
                                        </h2>
                                        <div style={{ color: "rgb(140, 35, 158)", marginLeft: "4vw", marginRight: "4vw" }}>Pentru a vedea detalii despre comanda:
                                            <Link to="/profil"
                                                style={{ color: "rgb(140, 35, 158)" }}>cautati pe profil</Link>  comanda cu numarul {this.state.ID} sau <Link
                                                    style={{ color: "rgb(140, 35, 158)" }} to="/meniu">continuati cumparaturile</Link></div>
                                    </>
                                    :
                                    <div>
                                        <Navbar searchBar={true} />
                                        <div className="cartContainer">
                                            <DataTable className="cartTable" value={this.state.finalProducts} header="Cos de cumparaturi">
                                                <Column className="productColumn" style={{ textAlign: "center" }} header="Produs" body={this.productBody} />
                                                <Column className="quantityColumn" style={{ textAlign: "center" }} header="Cantitate" body={this.quantityBody} />
                                                <Column className="deleteColumn" style={{ textAlign: "center" }} body={this.deleteBody} />
                                            </DataTable>
                                            <div className="totalPriceContainer">
                                                <div className="totalPrice">{this.state.total} lei</div>
                                            </div>
                                        </div>
                                        <div className="centerCartButton">
                                            <Button className="p-button-rounded" onClick={this.placeOrder}>Plaseaza comanda</Button>
                                        </div>
                                        <ConfirmDialog visible={this.state.wantToDelete} onHide={this.hideDeleteDialog} header="Stergere produs"
                                            message="Sunteti sigur ca vreti sa stergeti produsul?" icon="pi pi-exclamation-triangle"
                                            accept={this.acceptDelete} reject={this.rejectDelete} />
                                        <ConfirmDialog visible={this.state.wantToPlaceOrder} onHide={this.hidePlaceOrderDialog} header="Plasare comanda"
                                            message="Sunteti sigur ca vreti sa plasati comanda?" icon="pi pi-exclamation-triangle"
                                            accept={this.acceptPlaceOrder} reject={this.rejectPlaceOrder} />
                                    </div>
                                }
                            </>
                        }
                    </>
                    :
                    <>
                        <Navbar searchBar={true} />
                        <div className="centerCartMessage" style={{ color: "rgb(140, 35, 158)", textDecoration: "underline" }}>
                            <h2 onClick={this.openLoginDialog}>Conecteaza-te pentru a vedea cosul de cumparaturi</h2>
                        </div>
                    </>
                }
                <Dialog header="Nu esti conectat" visible={this.state.openLoginDialog} onHide={this.hideDialog} className='p-fluid'>
                    <>{this.state.isLoggedIn ?
                        <h2 style={{ color: "rgb(140, 35, 158)", marginTop: "2vh" }} className="centerCartMessage">
                            Ati fost conectat cu succes!
                        </h2>
                        :
                        < div >
                            <div className="login">
                                <h2 className="title">Intra in cont</h2>
                                <div className="boxLogin">
                                    <div className="email">
                                        <label htmlFor="Email" >Email</label>
                                        <InputText className="inputTextLogin" type="text" value={this.state.loginEmail} onChange={(evt) => this.setState({ loginEmail: evt.target.value })} />
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Parola" >Parola</label>
                                        <Password className="inputTextLogin" type="text" value={this.state.loginParola} onChange={(evt) => this.setState({ loginParola: evt.target.value })} feedback={false} />
                                    </div>
                                </div>
                            </div>
                            <div className="centerLogin">
                                <Button className="submit" onClick={this.Submit} label="Intra in cont" />
                            </div>
                        </div>
                    }
                    </>
                </Dialog>
            </>
        )
    }
}

export default Cart;