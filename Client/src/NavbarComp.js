import React from 'react';
import './Navbar.css';
import { InputText } from 'primereact/inputtext';
import { NavLink } from 'react-router-dom';
import User from './User.js';
import ProductStore from './ProductStore';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

class NavbarComp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            isProfile: false,
            isFavorites: false,
            isCart: false,
            value: '',
            products: [],
            searchBar: false,
            userEmail: ''
        }

        this.searchProducts = () => {
            this.getProducts();
        }

        this.logout = () => {
            User.setIsLoggedIn(false);
            User.setEmail(null);
            this.setState({
                isLoggedIn: false,
                userEmail: null
            });
        }

        this.updateState = () => {
            if (User.getIsLoggedIn()) {
                this.setState({
                    isLoggedIn: User.getIsLoggedIn(),
                    userEmail: User.getEmail()
                });
            }
            if (this.props.searchBar) {
                this.setState({ searchBar: this.props.searchBar });
            }
        }
    }

    async getProducts() {
        if (this.state.value) {
            console.log(this.state.value);
            let finalProducts = [];
            let splittedValue = this.state.value.split(' ');
            for (let i = 0; i < splittedValue.length; i++) {
                await ProductStore.getProducts().then((response) => {
                    console.log(response);
                    for (let j = 0; j < response.length; j++) {
                        if (response[j].nume.includes(splittedValue[i])) {
                            finalProducts.push(response[j]);
                            this.setState({ products: finalProducts });
                        }
                    }
                })
            }
        }
        else {
            toast('Introduceti un produs!', {
                autoClose: 5000, position: toast.POSITION.TOP_CENTER,
            })
        }
    }

    componentWillMount() {
        if (User.getIsLoggedIn()) {
            this.setState({
                isLoggedIn: User.getIsLoggedIn(),
                userEmail: User.getEmail()
            });
        }
        if (this.props.searchBar) {
            this.setState({ searchBar: this.props.searchBar });
        }
    }

    render() {
        return (
            <div>
                <Navbar variant="light" expand="lg" style={{ backgroundColor: "rgb(140, 35, 158)" }} class>
                    <Navbar.Brand href="/">Restaurant</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" onClick={this.updateState} />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="mr-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/"><i className="navIcons pi pi-home"></i>Acasa</Nav.Link>
                            <Nav.Link href="/logare"><i className="navIcons pi pi-sign-in"></i>Logare</Nav.Link>
                            <Nav.Link href="/harta"><i className="navIcons pi pi-table"></i>  Harta mese</Nav.Link>
                            <NavDropdown title="Meniu" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="/meniu">Meniu</NavDropdown.Item>
                                <NavDropdown.Item href="/aperitive">Aperitive</NavDropdown.Item>
                                <NavDropdown.Item href="/supe_ciorbe">Supe/Ciorbe</NavDropdown.Item>
                                <NavDropdown.Item href="/fel_principal">Fel principal</NavDropdown.Item>
                                <NavDropdown.Item href="/fast_food">FastFood</NavDropdown.Item>
                                <NavDropdown.Item href="/desert">Desert</NavDropdown.Item>
                                <NavDropdown.Item href="/bauturi">Bauturi</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Cont" id="navbarScrollingDropdown" style={{ marginRight: "2vw" }}>
                                <NavDropdown.Item href="/profil"><i className="navIcons pi pi-user"></i>  Profil</NavDropdown.Item>
                                <NavDropdown.Item href="/favorite"><i className="navIcons pi pi-heart"></i>  Favorite</NavDropdown.Item>
                            </NavDropdown>
                            <>{(this.state.userEmail === "admin") ?
                                <div>
                                    <NavDropdown title="Rapoarte" id="navbarScrollingDropdown">
                                        <NavDropdown.Item href="/rapoarte_comenzi"><i className="pi pi-chart-bar"></i>Rapoarte comenzi</NavDropdown.Item>
                                        <NavDropdown.Item href="/rapoarte_produse"><i className="pi pi-chart-bar"></i>Rapoarte produse</NavDropdown.Item>
                                    </NavDropdown>
                                </div>
                                :
                                null
                            }</>
                            {/* <Nav.Link href="/contact"><i className="fas fa-phone"></i>  Contact</Nav.Link> */}
                            <Nav.Link href="/cos"><i className="navIcons pi pi-shopping-cart"></i>Cos</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <>{this.state.searchBar ?
                    <div className="searchBarContainer">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText className="searchBar" value={this.state.value} onChange={(e) => this.setState({ value: e.target.value })} placeholder="Search" />
                        </span>
                        <>{(this.state.value === "") ?
                            <Button icon="pi pi-arrow-right" className="p-button-raised p-button-text" onClick={this.searchProducts} />
                            :
                            <Link to={{
                                pathname: "/produse_cautate",
                                products: this.state.products,
                                value: this.state.value
                            }}
                                style={{ textDecoration: "none" }}>
                                <Button icon="pi pi-arrow-right" className="p-button-raised p-button-text" onClick={this.searchProducts} />
                            </Link>
                        }
                        </>
                    </div>
                    :
                    null
                }
                </>
            </div>
        )
    }
}

export default NavbarComp;