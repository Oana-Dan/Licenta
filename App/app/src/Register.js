import React from 'react';
// import style from './index.module.scss';
import './RegisterStyle.css';
import Login from './Login';
import Navbar from './NavbarComp';
import UserStore from './UserStore';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            isRegistered: false
        }

        this.Submit = () => {
            let OK = true;
            let ok = 0;
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
            else {
                let promise = UserStore.getUsers();
                promise.then(response => {
                    for (let i = 0; i < response.length; i++) {
                        if (response[i].email === this.state.email) {
                            toast('Email-ul este deja inregistrat!', {
                                autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                            })
                            ok = 1;
                        }
                    }
                    if (ok === 0) {
                        UserStore.addUser(this.state);
                        toast('Ati fost inregistrat cu succes!', {
                            autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                        })
                    }
                    if (OK === true && ok === 0) {
                        this.setState({ isRegistered: true })
                    }
                })
            }
        }
    }

    render() {
        return (
            this.state.isRegistered ?
                <Login />
                :
                <div>
                    <Navbar />
                    <h2 className="title">Inregistrare</h2>
                    <div className="box">
                        <div className="email">
                            <label htmlFor="Nume">Nume*</label>
                            <InputText type="text" className="tools" value={this.state.nume} onChange={(evt) => this.setState({ nume: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Prenume">Prenume*</label>
                            <InputText type="text" className="tools" value={this.state.prenume} onChange={(evt) => this.setState({ prenume: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Email">Email*</label>
                            <InputText type="text" className="tools" value={this.state.email} onChange={(evt) => this.setState({ email: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Parola">Parola*</label>
                            <Password type="text" className="tools" value={this.state.parola} onChange={(evt) => this.setState({ parola: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Judet">Judet</label>
                            <InputText type="text" className="tools" value={this.state.judet} onChange={(evt) => this.setState({ judet: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Localitate">Localitate</label>
                            <InputText type="text" className="tools" value={this.state.localitate} onChange={(evt) => this.setState({ localitate: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Strada">Strada</label>
                            <InputText type="text" className="tools" value={this.state.strada} onChange={(evt) => this.setState({ strada: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Etaj">Etaj</label>
                            <InputText type="text" className="tools" value={this.state.etaj} onChange={(evt) => this.setState({ etaj: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Apartament">Apartament</label>
                            <InputText type="text" className="tools" value={this.state.apartament} onChange={(evt) => this.setState({ apartament: evt.target.value })} />
                        </div>
                        <div className="email">
                            <label htmlFor="Telefon">Telefon*</label>
                            <InputText type="text" className="tools" value={this.state.telefon} onChange={(evt) => this.setState({ telefon: evt.target.value })} />
                        </div>
                    </div>
                    <div className="containerButton">
                        <Button className="submitRegistration" onClick={this.Submit} label="Creeaza cont" />
                        <span className="linkToLogin">
                            <p style={{ marginBottom: '-0.5vh', marginTop: '-1vh' }}>Ai cont?</p>
                            <Link style={{ color: 'rgb(140, 35, 158)', marginBottom: '3vh' }} to='/logare'>Intra in cont</Link>
                        </span>
                    </div>
                </div>
        )
    }
}

export default Register;