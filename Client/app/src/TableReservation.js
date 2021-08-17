import React from 'react';
import Navbar from './NavbarComp';
import ProductStore from './ProductStore';
import User from './User';
import UserStore from './UserStore';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class TableReservations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: '',
            selectedStartHour: '',
            selectedEndHour: '',
            tablesHours: [],
            userEmail: ''
        }

        this.reserve = () => {
            let finalDate = "";
            if (this.state.startDate.getDate() <= 9) {
                finalDate += "0" + this.state.startDate.getDate() + "-";
            }
            else {
                finalDate += this.state.startDate.getDate() + "-";
            }
            if ((this.state.startDate.getMonth() + 1) <= 9) {
                finalDate += "0" + (this.state.startDate.getMonth() + 1) + "-";
            }
            else {
                finalDate += this.state.startDate.getMonth() + "-";
            }
            finalDate += this.state.startDate.getFullYear();
            ProductStore.getTableDate(this.props.location.data.numar, finalDate).then((tableDate) => {
                if (tableDate.message === "not found") {
                    let newDate = { data: finalDate };
                    ProductStore.addTableDate(this.props.location.data.numar, newDate);
                    ProductStore.getTableHour(this.props.location.data.numar, this.state.startDate, this.state.selectedStartHour).then((tableHour) => {
                        if (tableHour.message === "not found") {
                            if (this.state.selectedStartHour.name.split(":")[0] > this.state.selectedEndHour.name.split(":")[0]) {
                                toast('Ora de incepere trebuie sa fie mai mica decat cea de terminare!', {
                                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                                })
                            }
                            if ((this.state.selectedStartHour.name.split(":")[0] === this.state.selectedEndHour.name.split(":")[0]) &&
                                (this.state.selectedStartHour.name.split(":")[1] > this.state.selectedEndHour.name.split(":")[1])) {
                                toast('Ora de incepere trebuie sa fie mai mica decat cea de terminare!', {
                                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                                })
                            }
                            if ((this.state.selectedStartHour.name.split(":")[0] < this.state.selectedEndHour.name.split(":")[0]) ||
                                ((this.state.selectedStartHour.name.split(":")[0] === this.state.selectedEndHour.name.split(":")[0]) &&
                                    (this.state.selectedStartHour.name.split(":")[1] < this.state.selectedEndHour.name.split(":")[1]))) {
                                let reservation = {
                                    data: finalDate, oraIncepere: this.state.selectedStartHour.name, oraTerminare: this.state.selectedEndHour.name,
                                    numarMasa: this.props.location.data.numar
                                };
                                let newTableHour = { oraIncepere: this.state.selectedStartHour.name, oraTerminare: this.state.selectedEndHour.name, stare: "rezervata" };
                                ProductStore.addTableHour(this.props.location.data.numar, finalDate, newTableHour);
                                UserStore.addReservation(this.state.userEmail, reservation);
                                toast('Rezervarea a fost acceptata!', {
                                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                                })
                            }
                        }
                    })
                }
                else {
                    ProductStore.getTableHour(this.props.location.data.numar, this.state.startDate, this.state.selectedStartHour).then((tableHour) => {
                        if (tableHour.message === "not found") {
                            if (this.state.selectedStartHour.name.split(":")[0] > this.state.selectedEndHour.name.split(":")[0]) {
                                toast('Ora de incepere trebuie sa fie mai mica decat cea de terminare!', {
                                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                                })
                            }
                            if ((this.state.selectedStartHour.name.split(":")[0] === this.state.selectedEndHour.name.split(":")[0]) &&
                                (this.state.selectedStartHour.name.split(":")[1] > this.state.selectedEndHour.name.split(":")[1])) {
                                toast('Ora de incepere trebuie sa fie mai mica decat cea de terminare!', {
                                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                                })
                            }
                            if ((this.state.selectedStartHour.name.split(":")[0] < this.state.selectedEndHour.name.split(":")[0]) ||
                                ((this.state.selectedStartHour.name.split(":")[0] === this.state.selectedEndHour.name.split(":")[0]) &&
                                    (this.state.selectedStartHour.name.split(":")[1] < this.state.selectedEndHour.name.split(":")[1]))) {
                                let reservation = {
                                    data: finalDate, oraIncepere: this.state.selectedStartHour.name, oraTerminare: this.state.selectedEndHour.name,
                                    numarMasa: this.props.location.data.numar
                                };
                                let newTableHour = { oraIncepere: this.state.selectedStartHour.name, oraTerminare: this.state.selectedEndHour.name, stare: "rezervata" };
                                ProductStore.addTableHour(this.props.location.data.numar, finalDate, newTableHour);
                                UserStore.addReservation(this.state.userEmail, reservation);
                                toast('Rezervarea a fost acceptata!', {
                                    autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                                })
                            }
                        }
                        else {
                            toast('Orele selectate nu sunt disponibile', {
                                autoClose: 5000, position: toast.POSITION.TOP_CENTER,
                            })
                        }
                    })
                }
            })
        }
        this.goBack = () => {
            window.history.back();
        }
    }

    componentWillMount() {
        if (User.getEmail()) {
            this.setState({ userEmail: User.getEmail() });
        }
    }

    render() {
        const hours = [{ name: "09:00" }, { name: "09:30" }, { name: "10:00" }, { name: "10:30" }, { name: "11:00" }, { name: "11:30" }, { name: "12:00" },
        { name: "12:30" }, { name: "13:00" }, { name: "13:30" }, { name: "14:00" }, { name: "14:30" }, { name: "15:00" }, { name: "15:30" }, { name: "16:00" },
        { name: "16:30" }, { name: "17:00" }, { name: "17:30" }, { name: "18:00" }, { name: "18:30" }, { name: "19:00" }, { name: "19:30" }, { name: "20:00" },
        { name: "20:30" }];
        return (
            <div>
                <Navbar searchBar={true} />
                <div >
                    <>{this.props.location.data.tableState === "ocupata" ?
                        <i className="fas fa-table fa-10x" id={`table${this.props.location.data.numar}`} style={{ color: "rgb(216, 31, 42)", textAlign: "center" }}>
                            <div style={{ fontSize: "20px", color: "black" }}>Masa {`${this.props.location.data.numar}`}</div>
                        </i>
                        :
                        <>{this.props.location.data.tableState === "rezervata" ?
                            <i className="fas fa-table fa-10x" id={`table${this.props.location.data.numar}`} style={{ color: "rgb(253, 208, 23)", textAlign: "center" }}>
                                <div style={{ fontSize: "20px", color: "black" }}>Masa {`${this.props.location.data.numar}`}</div>
                            </i>
                            :
                            <>{this.props.location.data.tableState === "libera" ?
                                <i className="fas fa-table fa-10x" id={`table${this.props.location.data.numar}`} style={{ color: "green", textAlign: "center" }}>
                                    <div style={{ fontSize: "20px", color: "black" }}>Masa {`${this.props.location.data.numar}`}</div>
                                </i>
                                :
                                null
                            }
                            </>
                        }
                        </>
                    }
                    </>
                </div>
                <div className="tableReservationContainer">
                    <div>Rezerva masa {this.props.match.params.numar}</div>
                    <div style={{ marginLeft: "8vw", marginTop: "3vh" }}>Data</div>
                    <Calendar style={{ marginTop: "1vh" }} value={this.state.startDate} onChange={(e) => this.setState({ startDate: e.value })}
                        dateFormat="dd/mm/yy" showIcon monthNavigator yearNavigator yearRange="2021:2030" />
                    <div style={{ marginLeft: "8vw" }}>Ora incepere</div>
                    <Dropdown value={this.state.selectedStartHour} options={hours} onChange={(e) => this.setState({ selectedStartHour: e.value })}
                        optionLabel="name" placeholder="Selectati ora" style={{ width: "76vw" }} />
                    <div style={{ marginLeft: "8vw" }}>Ora terminare</div>
                    <Dropdown value={this.state.selectedEndHour} options={hours} onChange={(e) => this.setState({ selectedEndHour: e.value })}
                        optionLabel="name" placeholder="Selectati ora" style={{ width: "76vw" }} />
                </div>
                <div className="reserveButton">
                    <Button style={{ marginTop: "2vh" }} onClick={this.reserve}>Rezerva</Button>
                </div>
                <Button label="Inapoi" icon="pi pi-chevron-left" onClick={this.goBack} className="p-button-raised p-button-text"
                    style={{ position: "fixed", bottom: "0", left: "0" }} />
            </div>
        )
    }
}

export default TableReservations;