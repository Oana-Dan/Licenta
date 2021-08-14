import React from 'react';
import Navbar from './NavbarComp';

class Contact extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <Navbar searchBar={true} />
                <div className="contactContainer">
                    <div>Numar de telefon: 0720202020</div>
                    <br />
                    <div>Email: restaurant_contact@gmail.com</div>
                    <br />
                    <div>Adresa: Bucuresti, Piata Romana, Nr.10</div>
                </div>
            </div>
        )
    }
}

export default Contact;