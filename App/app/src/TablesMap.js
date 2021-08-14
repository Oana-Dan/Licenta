import React from 'react';
import Navbar from './NavbarComp';
import ProductStore from './ProductStore';
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

class TablesMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tables: [],
            isLoggedIn: false,
            userEmail: '',
            openLoginDialog: false,
            loginEmail: '',
            loginParola: ''
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

        this.updateTableStates = () => {
            ProductStore.getTables().then(tables => {
                let newTables = tables;
                for (let i = 0; i < tables.length; i++) {
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
                    ProductStore.getTableDate(tables[i].numar, finalDate).then((tableDate) => {
                        if (tableDate.message === "not found") {
                            let newTableDate = { data: finalDate };
                            ProductStore.addTableDate(tables[i].numar, newTableDate);
                            newTables[i].tableState = "libera";
                            this.setState({ tables: newTables });
                        }
                        else {
                            let currentHour = date.getHours();
                            let date1 = new Date();
                            date1.setMinutes(date.getMinutes() + 30);
                            let hour1 = date1.getHours();
                            let hourForSearch = '';
                            let endHour = '';
                            if (hour1 === currentHour) {
                                hourForSearch = currentHour + ":00";
                                endHour = currentHour + ":30";
                                this.getTableHour(tables[i].numar, finalDate, hourForSearch).then((tableHour) => {
                                    if (tableHour.message === "not found") {
                                        newTables[i].tableState = "libera";
                                        this.setState({ tables: newTables });
                                    }
                                    else {
                                        if (tableHour.oraIncepere === hourForSearch && tableHour.stare === "ocupata") {
                                            newTables[i].tableState = "ocupata";
                                            this.setState({ tables: newTables });
                                        }
                                        else if (tableHour.oraIncepere === hourForSearch && tableHour.stare === "rezervata") {
                                            newTables[i].tableState = "rezervata";
                                            this.setState({ tables: newTables });
                                        }
                                        else {
                                            newTables[i].tableState = "libera";
                                            this.setState({ tables: newTables });
                                        }
                                    }
                                })
                            }
                            else {
                                hourForSearch = currentHour + ":30";
                                endHour = (currentHour + 1) + ":00";
                                this.getTableHour(tables[i].numar, finalDate, hourForSearch).then((tableHour) => {
                                    if (tableHour.message === "not found") {
                                        newTables[i].tableState = "libera";
                                        this.setState({ tables: newTables });
                                    }
                                    else {
                                        if (tableHour.oraIncepere === hourForSearch && tableHour.stare === "ocupata") {
                                            newTables[i].tableState = "ocupata";
                                            this.setState({ tables: newTables });
                                        }
                                        else if (tableHour.oraIncepere === hourForSearch && tableHour.stare === "rezervata") {
                                            newTables[i].tableState = "rezervata";
                                            this.setState({ tables: newTables });
                                        }
                                        else {
                                            newTables[i].tableState = "libera";
                                            this.setState({ tables: newTables });
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            });
        }

        this.openLoginDialog = () => {
            this.setState({ openLoginDialog: true });
        }

        this.hideDialog = () => {
            this.setState({ openLoginDialog: false });
        }
    }

    async getIsLoggedIn() {
        if (User.getIsLoggedIn()) {
            await this.setState({ isLoggedIn: User.getIsLoggedIn() });
        }
    }

    async getTableHour(tableNumber, tableDate, tableHour) {
        const response = await ProductStore.getTableHour(tableNumber, tableDate, tableHour);
        return response;
    }

    componentWillMount() {
        if (User.getIsLoggedIn()) {
            this.setState({ isLoggedIn: User.getIsLoggedIn() });
        }
        this.updateTableStates();
        setInterval(this.updateTableStates, 15000);
    }

    render() {
        const hours = [{ name: "09:00" }, { name: "09:30" }, { name: "10:00" }, { name: "10:30" }, { name: "11:00" }, { name: "11:30" }, { name: "12:00" },
        { name: "12:30" }, { name: "13:00" }, { name: "13:30" }, { name: "14:00" }, { name: "14:30" }, { name: "15:00" }, { name: "15:30" }, { name: "16:00" },
        { name: "16:30" }, { name: "17:00" }, { name: "17:30" }, { name: "18:00" }, { name: "18:30" }, { name: "19:00" }, { name: "19:30" }, { name: "20:00" },
        { name: "20:30" }];
        return (
            <>{this.state.isLoggedIn ?
                <div>
                    <Navbar searchBar={true} />
                    <h2 style={{ color: "rgb(140, 35, 158)", marginTop: "2vh", marginLeft: "3vw" }} className="centerCartMessage">
                        Click pe o masa pentru a o rezerva
                    </h2>
                    <div className="checkAvailabilityButton">
                        <Button style={{ marginLeft: "3vw" }}>
                            <Link to="/verificare_disponibilitate_mese" style={{ color: "white", textDecoration: "none" }}>Verificati disponibilitatea meselor
                            </Link>
                        </Button>
                    </div>
                    <div className="tablesContainer">
                        {this.state.tables.map((table, index) =>
                            <Link to={{
                                pathname: `/rezervare/masa${table.numar}`,
                                data: table,
                                isLoggedIn: this.state.isLoggedIn,
                                userEmail: this.state.userEmail
                            }}>
                                <>{this.state.tables[index].tableState === "ocupata" ?
                                    <i className="table fas fa-table fa-10x" key={index} id={`table${table.numar}`} style={{ color: "rgb(216, 31, 42)" }}>
                                        <div style={{ fontSize: "20px", color: "black" }}>Masa {`${table.numar}`}</div>
                                    </i>
                                    :
                                    <>{this.state.tables[index].tableState === "rezervata" ?
                                        <i className="table fas fa-table fa-10x" key={index} id={`table${table.numar}`} style={{ color: "rgb(253, 208, 23)" }}>
                                            <div style={{ fontSize: "20px", color: "black" }}>Masa {`${table.numar}`}</div>
                                        </i>
                                        :
                                        <>{this.state.tables[index].tableState === "libera" ?
                                            <i className="table fas fa-table fa-10x" key={index} id={`table${table.numar}`} style={{ color: "green" }}>
                                                <div style={{ fontSize: "20px", color: "black" }}>Masa {`${table.numar}`}</div>
                                            </i>
                                            :
                                            null
                                        }
                                        </>
                                    }
                                    </>
                                }
                                </>
                            </Link>)}
                    </div>
                </div>
                :
                <div>
                    <Navbar searchBar={true} />
                    <h2 style={{ color: "rgb(140, 35, 158)", marginTop: "2vh", marginLeft: "3vw" }} className="centerCartMessage">
                        Click pe o masa pentru a o rezerva
                    </h2>
                    <div className="checkAvailabilityButton">
                        <Button style={{ marginLeft: "3vw" }}>
                            <Link to="/verificare_disponibilitate_mese" style={{ color: "white", textDecoration: "none" }}>Verificati disponibilitatea meselor
                            </Link>
                        </Button>
                    </div>
                    <div className="tablesContainer">
                        {this.state.tables.map((table, index) =>
                            <>{this.state.tables[index].tableState === "ocupata" ?
                                <i className="fas fa-table fa-10x" key={index} id={`table${table.numar}`} style={{ color: "rgb(216, 31, 42)" }}
                                    onClick={this.openLoginDialog}>
                                    <div style={{ fontSize: "20px", color: "black" }}>Masa {`${table.numar}`}</div>
                                </i>
                                :
                                <>{this.state.tables[index].tableState === "rezervata" ?
                                    <i className="fas fa-table fa-10x" key={index} id={`table${table.numar}`} style={{ color: "rgb(253, 208, 23)" }}
                                        onClick={this.openLoginDialog}>
                                        <div style={{ fontSize: "20px", color: "black" }}>Masa {`${table.numar}`}</div>
                                    </i>
                                    :
                                    <>{this.state.tables[index].tableState === "libera" ?
                                        <i className="fas fa-table fa-10x" key={index} id={`table${table.numar}`} style={{ color: "green" }}
                                            onClick={this.openLoginDialog}>
                                            <div style={{ fontSize: "20px", color: "black" }}>Masa {`${table.numar}`}</div>
                                        </i>
                                        :
                                        null
                                    }
                                    </>
                                }
                                </>
                            }
                            </>
                        )}
                    </div>
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
            }
            </>
        )
    }
}

export default TablesMap;