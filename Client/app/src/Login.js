import React from 'react';
import Home from './Home';
import './Login.css';
import Navbar from './NavbarComp';
import User from './User';
import UserStore from './UserStore';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            parola: '',
            isLoggedIn: false
        }

        this.Submit = () => {
            let OK = true;
            if (this.state.email === "") {
                OK = false;
                toast('Email-ul trebuie completat!', {
                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                })
            }
            else if (this.state.parola === "") {
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
                        if (response[i].email === this.state.email && response[i].parola === this.state.parola) {
                            this.setState({ isLoggedIn: true })
                            User.setIsLoggedIn(this.state.isLoggedIn);
                            User.setEmail(this.state.email);
                            ok = true;
                            toast('Ati fost conectat cu succes!', {
                                autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                            })
                        }
                        else if (response[i].email === this.state.email && response[i].parola !== this.state.parola) {
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
    }

    render() {
        return (
            <>{(this.state.isLoggedIn) ?
                <>{this.props.loginFromAnotherComponent ?
                    <h2 style={{ color: "rgb(140, 35, 158)", marginTop: "2vh" }} className="centerCartMessage">
                        Ati fost conectat cu succes!
                    </h2>
                    :
                    <Home />
                }
                </>
                :
                <>{this.props.loginFromAnotherComponent ?
                    < div >
                        <div className="login">
                            <h2 className="title">Intra in cont</h2>
                            <div className="boxLogin">
                                <div className="email">
                                    <label htmlFor="Email" >Email</label>
                                    <InputText className="inputTextLogin" type="text" value={this.state.email} onChange={(evt) => this.setState({ email: evt.target.value })} />
                                </div>
                                <div className="email">
                                    <label htmlFor="Parola" >Parola</label>
                                    <Password className="inputTextLogin" type="text" value={this.state.parola} onChange={(evt) => this.setState({ parola: evt.target.value })} feedback={false} />
                                </div>
                            </div>
                        </div>
                        <div className="centerLogin">
                            <Button className="submit" onClick={this.Submit} label="Intra in cont" />
                        </div>
                    </div>
                    :
                    <div >
                        <Navbar searchBar={true} />
                        <div>
                            <h2 className="title">Intra in cont</h2>
                            <div className="boxLogin">
                                <div className="email">
                                    <label htmlFor="Email" >Email</label>
                                    <InputText type="text" value={this.state.email} onChange={(evt) => this.setState({ email: evt.target.value })} />
                                </div>
                                <div className="email">
                                    <label htmlFor="Parola" >Parola</label>
                                    <Password type="text" value={this.state.parola} onChange={(evt) => this.setState({ parola: evt.target.value })} feedback={false} />
                                </div>
                            </div>
                        </div>
                        <div className="centerLogin">
                            <Button style={{ marginTop: '2vh' }} className="submit" onClick={this.Submit} label="Intra in cont" />
                        </div>
                        <div className="centerLogin">
                            <Link className="registrationLink" to="/inregistrare" >Inregistrare</Link>
                        </div>
                    </div>
                }
                </>
            }
            </>
        )
    }
}

export default Login;