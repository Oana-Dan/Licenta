import React, { useContext } from 'react';
import style from './index.module.scss';
import { messageService } from './Services';
import { TabMenu } from 'primereact/tabmenu';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Favorites from './Favorites';
import Login from './Login';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSidebarVisible: false,
            activeIndex: 0,
            // isHeaderVisible: true
            isLogedIn: false,
            isHome: false,
            isProfil: false,
            isFavorite: false,
            isCos: false
        }

        this.hideSidebar = () => {
            this.setState({ isSidebarVisible: false })
        }

        this.isFavorite = () => {
            this.setState({
                isLogedIn: this.props.isLogedIn,
                isFavorite: true
            })
            console.log(this.state.isLogedIn, this.props.isLogedIn)
            if (this.state.isLogedIn && this.state.isFavorite) {
                return <Favorites />
            }
            else {
                return <Login />
            }
        }

        // this.changeHome = () => {
        //     this.setState({
        //         activeIndex: 0
        //     })
        //     return (
        //         <Link to={{ pathname: "/" }} />
        //     )
        // }

        // this.onTabChangeHandler = (e) => {
        //     console.log(this.state.activeIndex)
        //     this.setState({ activeIndex: e.index },

        //         () => {
        //             console.log(this.state.activeIndex)
        //             if (this.state.activeIndex === 0) {
        //                 return (
        //                     <Link to="/" />
        //                 )
        //             }
        //             else if (this.state.activeIndex === 1) {
        //                 return (
        //                     <Link to="/profil" />
        //                 )
        //             }
        //         })
        // console.log(this.state.activeIndex)
        // if (this.state.activeIndex === 0) {
        //     return (
        //         <Link to="/" />
        //     )
        // }
        // else if (this.state.activeIndex === 1) {
        //     return (
        //         <Link to="/profil" />
        //     )
        // }
        // }
        //     this.change = () => {
        // return (
        //     <Link to="/profil" component={Profile} />
        // )
        // }
    }

    componentDidMount() {
        // console.log(this.state.isLogedIn + " header didmount")
        // setInterval(() => {
        //     messageService.getMessage().subscribe(message => {
        //         this.setState({ isLogedIn: message.isLogedIn });
        //         console.log(message);
        //     })
        // }, 1000);
    }

    componentDidUpdate() {
        // this.setState({ isLogedIn: messageService.getMessage().isLogedIn });
        // console.log(messageService.getMessage());
        // console.log(this.state.activeIndex)
        // console.log(this.state.isLogedIn + " header update")
    }

    render() {
        const items = [
            { icon: 'pi pi-home', url: '/' },
            // { icon: 'pi pi-user', url: this.state.isLogedIn ? '/profil' : '/logare' },
            { icon: 'pi pi-user', url: '/profil' },
            { icon: 'pi pi-heart', command: this.isFavorite, url: (this.state.isLogedIn && this.state.isFavorite) ? '/favorite' : '/logare' },
            { icon: 'pi pi-shopping-cart', url: this.state.isLogedIn ? '/cos' : '/logare' }
        ];
        return (
            // this.state.isHeaderVisible ?
            <div>
                <div > {/*<div className={style.header} style={{ overflowY: 'scroll' }}> */}
                    <TabMenu style={{ float: 'right' }} model={items} activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })} />
                    {/* <MenuModel model={items} activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })} /> */}
                    <Button style={{ float: 'left', marginTop: "2vh" }} icon='pi pi-bars' onClick={() => this.setState({ isSidebarVisible: true })} />
                    <Sidebar visible={this.state.isSidebarVisible} baseZIndex={1000} onHide={this.hideSidebar}>
                        <Button className='pi pi-book' onClick={this.meniu} > Meniu</Button>
                        <Button className='pi pi-heart' onClick={this.isFavorite} label="Favorite" />
                    </Sidebar>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText style={{ width: '95vw' }} value={this.state.value3} onChange={(e) => this.setState({ value3: e.target.value })} placeholder="Cauta" />
                    </span>
                </div>
            </div>
            // :
            // <div>

            // </div>
        )
    }
}

export default Header;

