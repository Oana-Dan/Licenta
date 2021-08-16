import React from 'react';
import Navbar from './NavbarComp';
import Product from './Product';
import ProductStore from './ProductStore';
import UserStore from './UserStore';
import User from './User';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class Favorites extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            userEmail: '',
            isLoggedIn: false,
            openLoginDialog: false,
            loginEmail: '',
            loginParola: ''
        }

        this.updateProducts = () => {
            let productsFromDatabase = [];
            if (User.getEmail()) {
                UserStore.getFavorites('a').then(response => {
                    for (let i = 0; i < response.length; i++) {
                        this.getFinalProducts(response).then(() => {
                            this.setState({ products: response });
                        })
                    }
                    this.setState({ products: productsFromDatabase });
                })
            }
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
                            let productsFromDatabase = [];
                            if (User.getEmail()) {
                                UserStore.getFavorites(User.getEmail()).then(response => {
                                    for (let i = 0; i < response.length; i++) {
                                        this.getFinalProducts(response).then(() => {
                                            this.setState({ products: response });
                                        })
                                    }
                                    this.setState({ products: productsFromDatabase });
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
        for (let i = 0; i < products.length; i++) {
            let product = await ProductStore.getProduct(products[i].nume);
            products[i].pret = product.pret;
            products[i].descriere = product.descriere;
            products[i].isAddedFavorites = true;
        }
    }

    componentWillMount() {
        if (User.getEmail()) {
            this.setState({ userEmail: User.getEmail() });
        }
        if (User.getIsLoggedIn()) {
            this.setState({ isLoggedIn: User.getIsLoggedIn() });
        }
        let productsFromDatabase = [];
        if (User.getEmail()) {
            UserStore.getFavorites(User.getEmail()).then(response => {
                for (let i = 0; i < response.length; i++) {
                    this.getFinalProducts(response).then(() => {
                        this.setState({ products: response });
                    })
                }
                this.setState({ products: productsFromDatabase });
            })
        }
    }

    render() {
        return (
            <>{this.state.isLoggedIn ?
                <>{(this.state.products.length !== 0) ?
                    <div>
                        <Navbar searchBar={true} />
                        <div className="products">
                            {
                                this.state.products.map((e, index) => <Product key={index} productData={e} isFavorite={true} />)
                            }
                        </div>
                    </div>
                    :
                    <div>
                        <Navbar searchBar={true} />
                        <h2 style={{ color: "rgb(140, 35, 158)" }} className="centerCartMessage">
                            Lista de favorite este goala
                        </h2>
                        <Link className="centerCartMessage" to="/meniu" style={{ color: "rgb(140, 35, 158)" }}>Vizualizeaza meniul</Link>
                    </div>
                }
                </>
                :
                <div>
                    <Navbar searchBar={true} />
                    <div className="centerCartMessage" style={{ color: "rgb(140, 35, 158)", textDecoration: "underline" }}><h2 onClick={this.openLoginDialog}>Conecteaza-te pentru a vedea favoritele</h2></div>
                </div>
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

export default Favorites;