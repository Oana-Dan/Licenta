import React from 'react';

import Navbar from './NavbarComp';
import User from './User';
import UserStore from './UserStore';
import Order from './Order';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userEmail: '',
            user: '',
            nume: '',
            prenume: '',
            email: '',
            parola: '',
            judet: '',
            localitate: '',
            strada: '',
            etaj: '',
            apartament: '',
            telefon: '',
            openDialog: false,
            viewOrder: false,
            order: null,
            file: null,
            openLoginDialog: false,
            loginEmail: '',
            loginParola: '',
            orders: [],
            reservations: []
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
                                });
                                UserStore.getUser(this.state.userEmail).then((user) => {
                                    this.setState({
                                        user: user,
                                        nume: user.nume,
                                        prenume: user.prenume,
                                        email: user.email,
                                        parola: user.parola,
                                        judet: user.judet,
                                        localitate: user.localitate,
                                        strada: user.strada,
                                        etaj: user.etaj,
                                        apartament: user.apartament,
                                        telefon: user.telefon
                                    });
                                    UserStore.getOrders(this.state.userEmail).then((response) => {
                                        let orders = response;
                                        this.setState({ orders: orders });
                                        UserStore.getReservations(this.state.userEmail).then((reservations) => {
                                            let reservationsFromDatabase = reservations;
                                            this.setState({ reservations: reservationsFromDatabase });
                                        })
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

        this.updateUser = () => {
            let OK = true;
            if (this.state.nume == "") {
                OK = false;
                toast('Numele trebuie completat!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else if (this.state.prenume == "") {
                OK = false;
                toast('Prenumele trebuie completat!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else if (this.state.email == "") {
                OK = false;
                toast('Email-ul trebuie completat!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else if (this.state.parola == "") {
                OK = false;
                toast('Parola trebuie completata!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else if (this.state.telefon == "") {
                OK = false;
                toast('Telefonul trebuie completat!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            if (OK === true) {
                let updatedUser = {
                    nume: this.state.nume, prenume: this.state.prenume, email: this.state.email, parola: this.state.parola,
                    judet: this.state.judet, localitate: this.state.localitate, strada: this.state.strada, etaj: this.state.etaj,
                    apartament: this.state.apartament, telefon: this.state.telefon
                };
                UserStore.updateUser(this.state.userEmail, updatedUser);
                toast('Modificarile au fost salvate!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
        }

        this.viewOrder = (rowData) => {
            return (
                <div>
                    <Link to={{
                        pathname: '/comanda',
                        order: rowData
                    }}
                        style={{ textDecoration: "none" }}>
                        <Button icon="pi pi-eye" className="p-button-raised p-button-text p-button-sm" />
                    </Link>
                </div>
            )
        }

        this.openOrder = (rowData) => {
            this.setState({
                viewOrder: true,
                order: rowData
            });
        }

        this.goBack = () => {
            window.history.back();
        }
    }

    componentWillMount() {
        if (User.getIsLoggedIn()) {
            this.setState({
                isLoggedIn: User.getIsLoggedIn(),
                userEmail: User.getEmail()
            });
            UserStore.getUser(this.state.userEmail).then((users) => {
                let user = users[0];
                this.setState({
                    user: user,
                    nume: user.nume,
                    prenume: user.prenume,
                    email: user.email,
                    parola: user.parola,
                    judet: user.judet,
                    localitate: user.localitate,
                    strada: user.strada,
                    etaj: user.etaj,
                    apartament: user.apartament,
                    telefon: user.telefon
                });
                UserStore.getOrders(this.state.userEmail).then((response) => {
                    let orders = response;
                    this.setState({ orders: orders });
                    UserStore.getReservations(this.state.userEmail).then((reservations) => {
                        let reservationsFromDatabase = reservations;
                        this.setState({ reservations: reservationsFromDatabase });
                    })
                })
            })
        }
    }

    render() {
        return (
            <>{this.state.isLoggedIn ?
                <>{this.state.viewOrder ?
                    <Order order={this.state.order} />
                    :
                    <div>
                        <Navbar searchBar={true} />
                        <div className="profileContainer">
                            <Panel className="profilePanel" header="Informatii personale" collapsed={true} toggleable >
                                <div className="editProfileContainer">
                                    <div className="email">
                                        <label htmlFor="Nume">Nume </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.nume} onChange={(evt) => this.setState({ nume: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Prenume">Prenume </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.prenume} onChange={(evt) => this.setState({ prenume: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Email">Email </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.email} onChange={(evt) => this.setState({ email: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Parola">Parola </label>
                                        <Password style={{ marginTop: "0.5vh" }} value={this.state.parola} onChange={(evt) => this.setState({ parola: evt.target.value })} toggleMask />
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Judet">Judet </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.judet} onChange={(evt) => this.setState({ judet: evt.target.value })({ email: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Localitate">Localitate </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.localitate} onChange={(evt) => this.setState({ localitate: evt.target.value })({ email: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Strada">Strada </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.strada} onChange={(evt) => this.setState({ strada: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Etaj">Etaj </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.etaj} onChange={(evt) => this.setState({ etaj: evt.target.value })({ email: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Apartament">Apartament </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.apartament} onChange={(evt) => this.setState({ apartament: evt.target.value })({ etaj: evt.target.value })({ email: evt.target.value })} />
                                        </span>
                                    </div>
                                    <div className="email">
                                        <label htmlFor="Telefon">Telefon </label>
                                        <span className="p-input-icon-right">
                                            <i className="pi pi-pencil" />
                                            <InputText value={this.state.telefon} onChange={(evt) => this.setState({ telefon: evt.target.value })({ etaj: evt.target.value })({ email: evt.target.value })} />
                                        </span>
                                    </div>
                                </div>
                                <div className="updateUserButton">
                                    <Button style={{ marginTop: "1vh" }} onClick={this.updateUser}>Salveaza modificarile</Button>
                                </div>
                            </Panel>
                            <Panel className="profilePanel" header="Comenzi" collapsed={true} toggleable style={{ marginTop: "3vh" }}>
                                <DataTable className="ordersTable" value={this.state.orders} style={{ marginTop: "3vh" }}>
                                    <Column style={{ textAlign: "center" }} header="ID" field="ID" />
                                    <Column style={{ textAlign: "center" }} header="Data" field="data" />
                                    <Column style={{ textAlign: "center" }} body={this.viewOrder} />
                                </DataTable>
                            </Panel>
                            <Panel className="profilePanel" header="Rezervari" collapsed={true} toggleable style={{ marginTop: "3vh" }}>
                                <DataTable className="reservationsTable" value={this.state.reservations} style={{ marginTop: "3vh" }}>
                                    <Column style={{ textAlign: "center" }} header="ID" field="numar" />
                                    <Column style={{ textAlign: "center" }} header="Data" field="data" />
                                    <Column style={{ textAlign: "center" }} header="Ora incepere" field="oraIncepere" />
                                    <Column style={{ textAlign: "center" }} header="Ora terminare" field="oraTerminare" />
                                    <Column style={{ textAlign: "center" }} header="Numar masa" field="numarMasa" />
                                </DataTable>
                            </Panel>
                        </div>
                    </div>
                }
                </>
                :
                <div>
                    <Navbar searchBar={true} />
                    <div className="centerCartMessage" style={{ color: "rgb(140, 35, 158)", textDecoration: "underline" }}><h2 onClick={this.openLoginDialog}>Conecteaza-te pentru a vedea profilul</h2></div>
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

export default Profile;