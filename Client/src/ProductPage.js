import React from 'react';
import Navbar from './NavbarComp';
import ProductStore from './ProductStore';
import User from './User';
import UserStore from './UserStore';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('./Images', false, /\.(png|jpe?g|svg)$/));

class ProductPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {},
            ingredients: [],
            isAddedFavorites: false,
            cantity: 0,
            isLoggedIn: false,
            userEmail: '',
            openCartDialog: false,
            finalProducts: [],
            openLoginDialog: false,
            totalPrice: 0,
            openLoginDialog: false,
            loginEmail: '',
            loginParola: '',
            nume: ''
        }

        this.addFavorites = () => {
            if (this.state.isLoggedIn) {
                let icon = document.getElementById(`heart_${this.props.match.params.nume}`);
                if (this.state.isAddedFavorites === false) {
                    icon.style.color = "red";
                    let productName = { nume: `${this.props.location.productData.nume}` }
                    UserStore.addFavorite(this.state.userEmail, productName);
                    this.setState({ isAddedFavorites: true });
                }
                else if (this.state.isAddedFavorites === true) {
                    icon.style.color = "white";
                    UserStore.deleteFavorite(this.state.userEmail, this.props.location.productData.nume);
                    this.setState({ isAddedFavorites: false })
                }
            }
            else {
                this.setState({ openLoginDialog: true })
            }
        }

        this.addCart = () => {
            if (this.state.isLoggedIn) {
                let date = new Date();
                let finalDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
                UserStore.getShoppingCart(this.state.userEmail, "in procesare").then((shoppingCart) => {
                    if (shoppingCart.message === "not found") {
                        let newShoppingCart = { data: finalDate };
                        UserStore.addShoppingCart(this.state.userEmail, newShoppingCart);
                        let promiseProductFromDatabase = UserStore.getProductCart(this.state.userEmail, "in procesare", this.props.location.productData.nume);
                        promiseProductFromDatabase.then(result => {
                            if (result.message === "not found") {
                                let product = { nume: `${this.props.location.productData.nume}`, cantitate: 1 };
                                UserStore.addProductCart(this.state.userEmail, "in procesare", product);
                                let finalProducts = this.state.finalProducts;
                                ProductStore.getProduct(this.props.location.productData.nume).then((productFromDatabase) => {
                                    product.descriere = productFromDatabase.descriere;
                                    product.pret = productFromDatabase.pret;
                                    finalProducts.push(product);
                                    let totalPrice = this.state.totalPrice;
                                    totalPrice += product.pret;
                                    this.setState({
                                        finalProducts: finalProducts,
                                        openCartDialog: true,
                                        totalPrice: totalPrice
                                    });
                                })
                            }
                            else {
                                let newQuantity = result.cantitate + 1;
                                let product = { nume: `${result.nume}`, cantitate: newQuantity };
                                UserStore.updateProductCart(this.state.userEmail, "in procesare", result.nume, product);
                                let totalPrice = this.state.totalPrice;
                                let finalProducts = this.state.finalProducts;
                                for (let i = 0; i < finalProducts.length; i++) {
                                    if (finalProducts[i].nume === result.nume) {
                                        finalProducts[i].cantitate = newQuantity;
                                        totalPrice += finalProducts[i].pret;
                                    }
                                }
                                this.setState({
                                    finalProducts: finalProducts,
                                    openCartDialog: true,
                                    totalPrice: totalPrice
                                });
                            }
                        })
                    }
                    else {
                        let promiseProductFromDatabase = UserStore.getProductCart(this.state.userEmail, "in procesare", this.props.location.productData.nume);
                        promiseProductFromDatabase.then(result => {
                            if (result.message === "not found") {
                                let product = { nume: `${this.props.location.productData.nume}`, cantitate: 1 };
                                UserStore.addProductCart(this.state.userEmail, "in procesare", product);
                                let finalProducts = this.state.finalProducts;
                                ProductStore.getProduct(this.props.location.productData.nume).then((productFromDatabase) => {
                                    product.descriere = productFromDatabase.descriere;
                                    product.pret = productFromDatabase.pret;
                                    finalProducts.push(product);
                                    let totalPrice = this.state.totalPrice;
                                    totalPrice += product.pret;
                                    this.setState({
                                        finalProducts: finalProducts,
                                        openCartDialog: true,
                                        totalPrice: totalPrice
                                    });
                                })
                            }
                            else {
                                let newQuantity = result.cantitate + 1;
                                let product = { nume: `${result.nume}`, cantitate: newQuantity };
                                UserStore.updateProductCart(this.state.userEmail, "in procesare", result.nume, product);
                                let totalPrice = this.state.totalPrice;
                                let finalProducts = this.state.finalProducts;
                                for (let i = 0; i < finalProducts.length; i++) {
                                    if (finalProducts[i].nume === result.nume) {
                                        finalProducts[i].cantitate = newQuantity;
                                        totalPrice += finalProducts[i].pret;
                                    }
                                }
                                this.setState({
                                    finalProducts: finalProducts,
                                    openCartDialog: true,
                                    totalPrice: totalPrice
                                });
                            }
                        })
                    }
                })
            }
            else {
                this.setState({ openLoginDialog: true })
            }
        }

        this.hideCartDialog = () => {
            this.setState({ openCartDialog: false });
        }

        this.hideDialog = () => {
            this.setState({ openLoginDialog: false });
        }

        this.priceBody = (rowData) => {
            return (
                <div>{rowData.pret} lei</div>
            )
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
                            this.setState({ nume: this.props.location.productData.nume });
                            UserStore.getFavorites(this.state.loginEmail).then((favorites) => {
                                for (let j = 0; j < favorites.length; j++) {
                                    if (favorites[i].nume === this.state.nume) {
                                        this.setState({ isAddedFavorites: true });
                                    }
                                }
                                if (User.getIsLoggedIn()) {
                                    this.setState({ isLoggedIn: User.getIsLoggedIn() });
                                }
                                if (User.getEmail()) {
                                    this.setState({ userEmail: User.getEmail() });
                                }
                                this.getFinalProducts();
                            })
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

        this.goBack = () => {
            window.history.back();
        }
    }

    async getFinalProducts() {
        let products = await UserStore.getProductsCart(User.getEmail(), 'in procesare');
        let totalPrice = 0;
        for (let i = 0; i < products.length; i++) {
            let product = await ProductStore.getProduct(products[i].nume);
            products[i].descriere = product.descriere;
            products[i].pret = product.pret;
            totalPrice += products[i].pret * products[i].cantitate;
        }
        this.setState({
            totalPrice: totalPrice,
            finalProducts: products
        })
    }

    componentWillMount() {
        let productPromise = ProductStore.getProduct(this.props.match.params.nume);
        productPromise.then((response) => {
            let productFromDatabase = response;
            this.setState({ product: productFromDatabase });
        })
        let ingredientsPromise = ProductStore.getIngredients(this.props.match.params.nume);
        ingredientsPromise.then((response) => {
            let ingredientsFromDatabase = [];
            for (let i = 0; i < response.length; i++) {
                ingredientsFromDatabase[i] = response[i];
            }
            this.setState({ ingredients: ingredientsFromDatabase });
        })
        if (User.getIsLoggedIn()) {
            this.setState({ isLoggedIn: User.getIsLoggedIn() });
            this.setState({ userEmail: User.getEmail() });
            if (this.props.location.productData.isAddedFavorites) {
                this.setState({ isAddedFavorites: this.props.location.productData.isAddedFavorites });
            }
        }
        if (User.getIsLoggedIn()) {
            this.setState({
                isLoggedIn: User.getIsLoggedIn(),
                userEmail: User.getEmail()
            })
            this.getFinalProducts();
        }
    }

    render() {
        let imageSource;
        for (let i = 0; i < images.length; i++) {
            if (images[i].default.includes(this.props.match.params.nume)) {
                imageSource = images[i].default;
            }
        }
        const { product } = this.state;
        const { ingredients } = this.state;
        return (
            <div>
                <Navbar searchBar={true} />
                <div className="productContainer">
                    <div className="centerObject">
                        <img src={imageSource} className="productImageProductPage" />
                    </div>
                    <div className="productItemsContainer">
                        <div className="productItems" style={{ marginTop: "2vh" }}>Descriere</div>
                        <div className="centerObject">
                            <hr className="line"></hr>
                        </div>
                        <div className="productItems">{product.descriere}</div>
                        <div className="productItems">Pret: {product.pret} lei</div>
                        <div className="productItems">Gramaj: {product.gramaj}g</div>
                        <>{(product.tip === "bauturi") ?
                            null
                            :
                            <div>
                                <div className="productItems">Ingrediente: </div>
                                {ingredients.map((e, index) => <i className="ingredient pi pi-chevron-right" key={index}> {e.nume} </i>)}
                            </div>
                        }
                        </>
                        <div className="outer">
                            <div className="inner" >
                                <Button className="addCartButton google p-p-0" onClick={this.addCart} >
                                    <i className="fas fa-shopping-cart"></i>
                                    <span className="p-px-3">  Adauga in cos</span>
                                </Button>
                            </div>
                            {this.state.isAddedFavorites ?
                                <div className="inner">
                                    <Button className="favoritesButton google p-p-0" onClick={this.addFavorites}>
                                        <i id={`heart_${this.props.match.params.nume}`} className="fas fa-heart" style={{ color: 'red' }}></i>
                                        <span className="p-px-3">  Adauga la favorite</span>
                                    </Button>
                                </div>
                                :
                                <div className="inner">
                                    <Button className="favoritesButton google p-p-0" onClick={this.addFavorites}>
                                        <i id={`heart_${this.props.match.params.nume}`} className="fas fa-heart" style={{ color: 'white' }}></i>
                                        <span className="p-px-3">  Adauga la favorite</span>
                                    </Button>
                                </div>
                            }
                        </div>
                        <div className="backButtonProduct">
                            <Button label="Inapoi" icon="pi pi-chevron-left" onClick={this.goBack} className="p-button-raised p-button-text" />
                        </div>
                    </div>
                </div>
                <Dialog visible={this.state.openCartDialog} onHide={this.hideCartDialog} header="Mergi la cosul de cumparaturi?" className='p-fluid' >
                    <DataTable value={this.state.finalProducts} header="Cos de cumparaturi">
                        <Column header="Produs" field="descriere" />
                        <Column header="Cantitate" field="cantitate" />
                        <Column header="Pret" body={this.priceBody} />
                    </DataTable>
                    <div className="totalPriceContainer">
                        <div className="totalPrice" style={{ marginRight: "13.5vw", marginBottom: "3vh" }}>{this.state.totalPrice} lei</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Link to="/cos"><Button className="p-button-rounded" style={{ display: "inline-block" }}>Catre cos</Button></Link>
                    </div>
                </Dialog>
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
            </div>
        )
    }
}

export default ProductPage;