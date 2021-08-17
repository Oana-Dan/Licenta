const SERVER = 'http://localhost:8080';

class UserStore {
    async addUser(user) {
        try {
            await fetch(`${SERVER}/users`,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                })
        }
        catch (error) {
            console.warn(error);
        }
    }

    async getUsers() {
        try {
            const response = await fetch(`${SERVER}/users`);
            return await response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }

    async getUser(userEmail) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}`);
            return await response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }

    async updateUser(userEmail, user) {
        try {
            await fetch(`${SERVER}/users/${userEmail}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getShoppingCart(userEmail, cartState) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}`);
            return await response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }

    async getProductsCart(userEmail, cartState) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}/cartproducts`);
            return response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }

    async addShoppingCart(userEmail, shoppingCart) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/shoppingcarts`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shoppingCart)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getProductCart(userEmail, cartState, productName) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}/cartproducts/${productName}`);
            return response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }

    async addProductCart(userEmail, cartState, product) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}/cartproducts`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async updateProductCart(userEmail, cartState, productName, product) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}/cartproducts/${productName}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async deleteCartProduct(userEmail, cartState, productName) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}/cartproducts/${productName}`, {
                method: 'delete'
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async updateCartState(userEmail, cartState, shoppingCart) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/shoppingcarts/${cartState}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shoppingCart)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getFavorites(userEmail) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/favoriteproducts`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async addFavorite(userEmail, product) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/favoriteproducts`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async deleteFavorite(userEmail, productName) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/favoriteproducts/${productName}`, {
                method: 'delete'
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getOrders(userEmail) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/orders`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async addOrder(userEmail, order) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/orders`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            })
            return response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async addOrderedProduct(userEmail, orderID, product) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/orders/${orderID}/orderedproducts`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getOrderedProducts(userEmail, orderID) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/orders/${orderID}/orderedproducts`);
            return response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }

    async addReservation(userEmail, reservation) {
        try {
            await fetch(`${SERVER}/users/${userEmail}/reservations`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservation)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getReservations(userEmail) {
        try {
            const response = await fetch(`${SERVER}/users/${userEmail}/reservations`);
            return response.json();
        }
        catch (error) {
            console.warn(error);
        }
    }
}
const store = new UserStore();

export default store;