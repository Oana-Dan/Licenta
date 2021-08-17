const SERVER = 'http://localhost:8080';

class ProductStore {
    async getImage(name) {
        try {
            const response = await fetch(`${SERVER}/images/${name}`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getProduct(name) {
        try {
            const response = await fetch(`${SERVER}/products/${name}`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getProducts() {
        try {
            const response = await fetch(`${SERVER}/products`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getIngredients(productName) {
        try {
            const response = await fetch(`${SERVER}/products/${productName}/ingredients`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getProductsByType(type) {
        try {
            const response = await fetch(`${SERVER}/products/type/${type}`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getImageProduct(productName) {
        try {
            const response = await fetch(`${SERVER}/images/${productName}`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getDaysOfWeeks() {
        try {
            const response = await fetch(`${SERVER}/daysofweeks`);
            return response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getDayWeek(dayOfWeekDate) {
        try {
            const response = await fetch(`${SERVER}/daysofweeks/${dayOfWeekDate}`);
            return response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async addDayOfWeek(dayOfWeek) {
        try {
            await fetch(`${SERVER}/daysofweeks`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dayOfWeek)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getDayWeekOrderedProduct(dayOfWeekDate, dayOfWeekOrderedProductName) {
        try {
            const response = await fetch(`${SERVER}/daysofweeks/${dayOfWeekDate}/dayorderedproducts/${dayOfWeekOrderedProductName}`);
            return response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async addDayWeekOrderedProduct(dayOfWeekDate, dayOfWeekOrderedProduct) {
        try {
            await fetch(`${SERVER}/daysofweeks/${dayOfWeekDate}/dayorderedproducts`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dayOfWeekOrderedProduct)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async updateDayWeekOrderedProduct(dayOfWeekDate, dayOfWeekOrderedProductName, dayOfWeekOrderedProduct) {
        try {
            await fetch(`${SERVER}/daysofweeks/${dayOfWeekDate}/dayorderedproducts/${dayOfWeekOrderedProductName}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dayOfWeekOrderedProduct)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getTables() {
        try {
            const response = await fetch(`${SERVER}/tables`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getTableDate(tableNumber, tableDate) {
        try {
            const response = await fetch(`${SERVER}/tables/${tableNumber}/datestables/${tableDate}`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async addTableDate(tableNumber, tableDate) {
        try {
            await fetch(`${SERVER}/tables/${tableNumber}/datestables`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tableDate)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async addTableHour(tableNumber, tableDate, hourTable) {
        try {
            await fetch(`${SERVER}/tables/${tableNumber}/datestables/${tableDate}/hourstables`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hourTable)
            })
        } catch (error) {
            console.warn(error);
        }
    }

    async getTableHour(tableNumber, tableDate, hourTable) {
        try {
            const response = await fetch(`${SERVER}/tables/${tableNumber}/datestables/${tableDate}/hourstables/${hourTable}`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async getTablesHours(tableNumber, tableDate) {
        try {
            const response = await fetch(`${SERVER}/tables/${tableNumber}/datestables/${tableDate}/hourstables`);
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }
}

const store = new ProductStore();
export default store;