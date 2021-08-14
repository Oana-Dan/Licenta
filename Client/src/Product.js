import React from 'react';
import './Product.css';
import User from './User';
import UserStore from './UserStore';
import { Link } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('./Images', false, /\.(png|jpe?g|svg)$/));

class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nume: '',
            descriere: '',
            pret: 0,
            gramaj: 0,
            sursaImagine: '',
            isAddedFavorites: false,
            removeItem: false,
            isOk: false,
            favoritesRed: false,
            icon: null,
            isLoggedIn: false,
            userEmail: '',
            imageObject: {},
            isDialogShown: false,
            openLoginDialog: false,
            loginEmail: '',
            loginParola: ''
        }

        this.Submit = this.Submit.bind(this);

        this.addFavorite = () => {
            if (this.state.isLoggedIn) {
                let icon = document.getElementById(`heart_${this.props.productData.nume}`);
                if (this.state.isAddedFavorites === false) {
                    icon.style.color = "red";
                    let productName = { nume: `${this.props.productData.nume}` }
                    UserStore.addFavorite(this.state.userEmail, productName);
                    this.props.productData.isAddedFavorites = true;
                    this.setState({
                        removeItem: false,
                        isAddedFavorites: true
                    })
                }
                else if (this.state.isAddedFavorites === true) {
                    {
                        icon.style.color = "grey";
                        UserStore.deleteFavorite(this.state.userEmail, this.props.productData.nume);
                        this.props.productData.isAddedFavorites = false;
                        if (this.props.isOk) {
                            this.setState({
                                removeItem: false,
                                isAddedFavorites: false
                            })
                        }
                        else if (this.props.isFavorite) {
                            this.setState({
                                removeItem: true,
                                isAddedFavorites: false
                            })
                        }
                    }
                }
            }
            else {
                this.setState({ openLoginDialog: true })
            }
        }

        this.openLoginDialog = () => {
            this.setState({ openLoginDialog: true });
        }

        this.hideDialog = () => {
            this.setState({ openLoginDialog: false });
        }
    }

    Submit = () => {
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
                        this.setState({ nume: this.props.productData.nume });
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
                            // this.props.refresh();
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

    componentDidMount() {
        this.setState({ nume: this.props.productData.nume });
        if (this.props.productData.isAddedFavorites) {
            this.setState({ isAddedFavorites: this.props.productData.isAddedFavorites });
        }
        this.setState({ isOk: this.props.isOk });
        if (User.getIsLoggedIn()) {
            this.setState({ isLoggedIn: User.getIsLoggedIn() });
        }
        if (User.getEmail()) {
            this.setState({ userEmail: User.getEmail() });
        }
    }

    render() {
        let imageSource;
        for (let i = 0; i < images.length; i++) {
            if (images[i].default.includes(this.props.productData.nume)) {
                imageSource = images[i].default;
            }
        }
        return (
            <>
                {(!this.state.removeItem || this.props.isOk) ?
                    <div className="product">
                        <div className="product-container">
                            <img src={imageSource} className="productImage" />
                            {(this.state.isAddedFavorites) ?
                                <i id={`heart_${this.props.productData.nume}`} className="fa fa-heart fa-lg heart_red" onClick={this.addFavorite}></i>
                                :
                                <i id={`heart_${this.props.productData.nume}`} className="fa fa-heart fa-lg heart_grey" onClick={this.addFavorite}></i>
                            }
                        </div>
                        <div className="productDetails">Descriere: {this.props.productData.descriere}</div>
                        <div className="productDetails">Pret: {this.props.productData.pret} lei</div>
                        <div className="viewButton">
                            <Button><Link style={{ color: "white", textDecoration: "none" }} to=
                                {{
                                    pathname: `produse/${this.props.productData.nume}`,
                                    productData: this.props.productData,
                                    isOk: this.props.isOk
                                }}>
                                Vizualizare produs</Link></Button>
                        </div>
                        <Dialog header="Nu esti conectat" visible={this.state.openLoginDialog} onHide={this.hideDialog} className='p-fluid'>
                            <>{this.state.isLoggedIn ?
                                <h2 style={{ color: "rgb(140, 35, 158)", marginTop: "2vh" }} className="centerCartMessage">
                                    Ati fost conectat cu succes!
                                </h2>
                                :
                                <div>
                                    <div>
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
                    :
                    null
                }
            </>
        )
    }
}

export default Product;