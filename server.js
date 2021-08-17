<<<<<<< HEAD
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require('cors')
const mysql = require('mysql2/promise')
const path = require('path')
const PORT = process.env.PORT || 8080;

const app = express()
app.use(bodyParser.json());

const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://shrouded-journey-38552.herokuapp.com']
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));

const DB_USERNAME = 'root'
const DB_PASSWORD = ''
let conn

mysql.createConnection(
    {
        user: DB_USERNAME,
        password: DB_PASSWORD
    })
    .then((connection) => {
        conn = connection
        return connection.query('CREATE DATABASE IF NOT EXISTS Licenta')
    })
    .then(() => {
        return conn.end()
    })
    .catch((error) => {
        console.warn(error.stack)
    })

const sequelize = new Sequelize('Licenta', DB_USERNAME, DB_PASSWORD,
    {
        dialect: 'mysql'
    })

const Users = sequelize.define('User',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        prenume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        email:
        {
            type: Sequelize.STRING,
            primaryKey: true
        },
        parola:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        judet:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        localitate:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        strada:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        etaj:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        apartament:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        telefon:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        tip:
        {
            type: Sequelize.STRING,
            defaultValue: 'client'
        }
    })

const FavoriteProducts = sequelize.define('FavoriteProduct',
    {
        nume:
        {
            type: Sequelize.STRING,
            primaryKey: true
        }
    })

Users.hasMany(FavoriteProducts);

const ShoppingCarts = sequelize.define('ShoppingCart', {
    ID:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    stare:
    {
        type: Sequelize.STRING,
        defaultValue: "in procesare"
    }
})

Users.hasMany(ShoppingCarts);

const CartProducts = sequelize.define('CartProduct',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        cantitate:
        {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

ShoppingCarts.hasMany(CartProducts);

const Orders = sequelize.define('Order',
    {
        ID:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pret:
        {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        data:
        {
            type: Sequelize.STRING,
            allowNull: false,
        },
        tipPlata:
        {
            type: Sequelize.STRING
        },
        numarMasa:
        {
            type: Sequelize.INTEGER
        },
        stare:
        {
            type: Sequelize.STRING,
            defaultValue: 'in procesare'
        },
        starePlata:
        {
            type: Sequelize.STRING,
            defaultValue: 'neachitata'
        },
        livrata:
        {
            type: Sequelize.BOOLEAN
        }
    })

Users.hasMany(Orders);

const OrderedProducts = sequelize.define('OrderedProduct',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        cantitate:
        {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

Orders.hasMany(OrderedProducts);

const Products = sequelize.define('Product',
    {
        nume:
        {
            type: Sequelize.STRING,
            primaryKey: true
        },
        descriere:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        pret:
        {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        gramaj:
        {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        stare:
        {
            type: Sequelize.STRING,
            defaultValue: 'vizibil'
        },
        tip:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

const Ingredients = sequelize.define('Ingredient',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

Products.hasMany(Ingredients);

const Reviews = sequelize.define('Review',
    {
        ID:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text:
        {
            type: Sequelize.TEXT,
            allowNull: false
        },
        autor:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        numarLikeuri:
        {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        numarDislikeuri:
        {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        data:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

Products.hasMany(Reviews);

const Images = sequelize.define('Image',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        cale:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

const Tables = sequelize.define('Table', {
    numar:
    {
        type: Sequelize.INTEGER,
        primaryKey: true
    }
})

const DatesTables = sequelize.define('DatesTable', {
    ID:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data:
    {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Tables.hasMany(DatesTables);

const HoursTables = sequelize.define('HoursTable', {
    oraIncepere:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    oraTerminare:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    stare:
    {
        type: Sequelize.STRING,
        allowNull: false
    }
})

DatesTables.hasMany(HoursTables);

const DayOfWeeks = sequelize.define('DayOfWeek', {
    data:
    {
        type: Sequelize.STRING,
        primaryKey: true
    }
})

const DayOrderedProducts = sequelize.define('DayOrderedProduct', {
    nume:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    cantitate:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

DayOfWeeks.hasMany(DayOrderedProducts);

const Reservations = sequelize.define('Reservation', {
    numar:
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    oraIncepere:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    oraTerminare:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    numarMasa:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Users.hasMany(Reservations);

app.get('/create', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (error) {
        next(error)
    }
})

app.get('/users', async (req, res, next) => {
    try {
        const users = await Users.findAll();
        res.status(201).json(users);
    }
    catch (error) {
        next(error);
    }
})

app.post('/users', async (req, res, next) => {
    try {
        await Users.create(req.body);
        res.status(200).json({ message: 'created' });
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser', async (req, res, next) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.params.euser
            }
        });
        // const user = users.shift();
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.put('/users/:euser', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            await user.update(req.body);
            res.status(201).json({ message: 'accepted' });
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            await user.destroy();
            res.status(201).json({ message: 'accepted' });
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/favoriteproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const favoriteproduct = new FavoriteProducts(req.body);
            favoriteproduct.UserEmail = user.email;
            await favoriteproduct.save();
            res.status(201).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/favoriteproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const favoriteproducts = await user.getFavoriteProducts();
            res.status(200).json(favoriteproducts);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser/favoriteproducts/:nfavoriteproduct', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const favoriteproducts = await user.getFavoriteProducts({
                where: {
                    nume: req.params.nfavoriteproduct
                }
            });
            favoriteproduct = favoriteproducts.shift();
            if (favoriteproduct) {
                await favoriteproduct.destroy();
                res.status(201).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/shoppingcarts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcart = new ShoppingCarts(req.body);
            shoppingcart.UserEmail = user.email;
            await shoppingcart.save();
            res.status(201).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/shoppingcarts/:stare', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                res.status(200).json(shoppingcart);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.put('/users/:euser/shoppingcarts/:stare', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                await shoppingcart.update(req.body);
                res.status(202).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/shoppingcarts/:stare/cartproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproduct = new CartProducts(req.body);
                cartproduct.ShoppingCartID = shoppingcart.ID;
                await cartproduct.save();
                res.status(201).json({ message: 'created' })
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/shoppingcarts/:stare/cartproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts();
                res.status(200).json(cartproducts);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/shoppingcarts/:stare/cartproducts/:cartproductname', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts({
                    where: {
                        nume: req.params.cartproductname
                    }
                });
                const cartproduct = cartproducts.shift();
                if (cartproduct) {
                    res.status(200).json(cartproduct);
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.put('/users/:euser/shoppingcarts/:stare/cartproducts/:cartproductname', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts({
                    where: {
                        nume: req.params.cartproductname
                    }
                });
                const cartproduct = cartproducts.shift();
                if (cartproduct) {
                    await cartproduct.update(req.body);
                    res.status(202).json({ message: 'accepted' });
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser/shoppingcarts/:stare/cartproducts/:cartproductname', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts({
                    where: {
                        nume: req.params.cartproductname
                    }
                });
                const cartproduct = cartproducts.shift();
                if (cartproduct) {
                    cartproduct.destroy();
                    res.status(202).json({ message: 'accepted' });
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/orders', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const order = new Orders(req.body);
            order.UserEmail = user.email;
            await order.save();
            res.status(201).json({ message: 'created', ID: order.ID });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/orders', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders();
            res.status(200).json(orders);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/orders/:orderID', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders({
                where: {
                    ID: req.params.orderID
                }
            })
            const order = orders.shift();
            if (order) {
                res.status(200).json(order);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/orders/:orderID/orderedproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders({
                where: {
                    ID: req.params.orderID
                }
            })
            const order = orders.shift();
            if (order) {
                const orderedproduct = new OrderedProducts(req.body);
                orderedproduct.OrderID = order.ID;
                await orderedproduct.save();
                res.status(201).json({ message: 'created' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/orders/:orderID/orderedproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders({
                where: {
                    ID: req.params.orderID
                }
            })
            const order = orders.shift();
            if (order) {
                const orderedproducts = await order.getOrderedProducts();
                res.status(200).json(orderedproducts);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/reservations', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservation = new Reservations(req.body);
            reservation.UserEmail = user.email;
            await reservation.save();
            res.status(200).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/reservations', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservations = await user.getReservations();
            res.status(201).json(reservations);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/reservations/:reservationnumber', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservations = await user.getReservations({
                where: {
                    numar: req.params.reservationnumber
                }
            });
            const reservation = reservations.shift();
            if (reservation) {
                res.status(201).json(reservation);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser/reservations/:reservationnumber', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservations = await user.getReservations({
                where: {
                    numar: req.params.reservationnumber
                }
            });
            const reservation = reservations.shift();
            if (reservation) {
                await reservation.destroy();
                res.status(200).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/products/all', async (req, res, next) => {
    try {
        const products = await Products.findAll();
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})


app.get('/products', async (req, res, next) => {
    try {
        const products = await Products.findAll({
            where: {
                stare: "vizibil"
            }
        });
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

app.post('/products', async (req, res, next) => {
    try {
        await Products.create(req.body)
        res.status(201).json({ message: 'created' })
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            res.status(200).json(product)
        }
        else {
            res.status(404).json({ message: 'not Found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/type/:ptype', async (req, res, next) => {
    try {
        const products = await Products.findAll({
            where: {
                tip: req.params.ptype
            }
        });
        if (products) {
            res.status(200).json(products)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            await product.update(req.body);
            res.status(202).json({ message: "accepted" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/products/:pname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            await product.destroy();
            res.status(202).json({ message: "accepted" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/ingredients', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredients = await product.getIngredients();
            res.status(200).json(ingredients);
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.post('/products/:pname/ingredients', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredient = new Ingredients(req.body);
            ingredient.ProductNume = product.nume;
            await ingredient.save();
            res.status(201).json({ message: "created" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/ingredients/:iname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredient = await product.getIngredients({
                where:
                {
                    nume: req.params.iname
                }
            });
            if (ingredient) {
                res.status(200).json(ingredient);
            }
            else {
                res.status(404).json({ message: "not found" });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pname/ingredients/:iname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredients = await product.getIngredients({
                where:
                {
                    nume: req.params.iname
                }
            });
            const ingredient = ingredients.shift();
            if (ingredient) {
                await ingredient.update(req.body);
                res.status(201).json({ message: "accepted" });
            }
            else {
                res.status(404).json({ message: "not found" });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/products/:pname/ingredients/:iname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredients = await product.getIngredients({
                where:
                {
                    nume: req.params.iname
                }
            });
            const ingredient = ingredients.shift();
            if (ingredient) {
                await ingredient.destroy();
                res.status(201).json({ message: "accepted" });
            }
            else {
                res.status(404).json({ message: "not found" });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.post('/products/:pname/reviews', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const review = new Reviews(req.body);
            review.ProductNume = product.nume;
            await review.save();
            res.status(201).json({ message: 'created' })
        }
        else {
            res.status(404).json({ message: 'not Found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/reviews', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews();
            res.status(200).json(reviews)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/reviews/:reviewID', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews({
                where: {
                    ID: req.params.reviewID
                }
            });
            const review = reviews.shift();
            if (review) {
                res.status(200).json(review)
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pname/reviews/:reviewID', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews({
                where: {
                    ID: req.params.reviewID
                }
            });
            const review = reviews.shift();
            if (review) {
                await review.update(req.body);
                res.status(201).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/products/:pname/reviews/:reviewID', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews({
                where: {
                    ID: req.params.reviewID
                }
            });
            const review = reviews.shift();
            if (review) {
                await review.destroy();
                res.status(201).json({ message: 'accepted' })
            }
            else {
                not
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.post('/daysofweeks', async (req, res, next) => {
    try {
        await DayOfWeeks.create(req.body);
        res.status(200).json({ message: 'created' });
    } catch (error) {
        next(error);
    }
})

app.get('/daysofweeks', async (req, res, next) => {
    try {
        const daysofweek = await DayOfWeeks.findAll();
        if (daysofweek) {
            res.status(201).json(daysofweek);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error);
    }
})

app.get('/daysofweeks/:dayofweekdate', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findOne({
            where: {
                data: req.params.dayofweekdate
            }
        });
        if (dayofweek) {
            res.status(201).json(dayofweek);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error);
    }
})

app.post('/daysofweeks/:dayofweekdate/dayorderedproducts', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findByPk(req.params.dayofweekdate);
        if (dayofweek) {
            const dayorderedproduct = new DayOrderedProducts(req.body);
            dayorderedproduct.DayOfWeekData = dayofweek.data;
            await dayorderedproduct.save();
            res.status(200).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/daysofweeks/:dayofweekdate/dayorderedproducts/:dayorderedproductname', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findByPk(req.params.dayofweekdate);
        if (dayofweek) {
            const dayorderedproducts = await dayofweek.getDayOrderedProducts({
                where: {
                    nume: req.params.dayorderedproductname
                }
            });
            const dayorderedproduct = dayorderedproducts.shift();
            if (dayorderedproduct) {
                res.status(200).json(dayorderedproduct);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.put('/daysofweeks/:dayofweekdate/dayorderedproducts/:dayorderedproductname', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findByPk(req.params.dayofweekdate);
        if (dayofweek) {
            const dayorderedproducts = await dayofweek.getDayOrderedProducts({
                where: {
                    nume: req.params.dayorderedproductname
                }
            });
            const dayorderedproduct = dayorderedproducts.shift();
            if (dayorderedproduct) {
                dayorderedproduct.cantitate = req.body.cantitate;
                await dayorderedproduct.save();
                res.status(201).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/tables', async (req, res, next) => {
    try {
        await Tables.create(req.body);
        res.status(200).json({ message: 'created' });
    } catch (error) {
        next(error);
    }
})

app.get('/tables', async (req, res, next) => {
    try {
        const tables = await Tables.findAll();
        res.status(201).json(tables);
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            res.status(201).json(table);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/tables/:tablenumber/datestables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datetable = new DatesTables(req.body);
            datetable.TableNumar = table.numar;
            await datetable.save();
            res.status(201).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datestables = await table.getDatesTables();
            res.status(200).json(datestables);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables/:date', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datestables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datestables[0];
            if (datetable) {
                res.status(200).json(datetable);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/tables/:tablenumber/datestables/:date/hourstables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datestables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datestables.pop();
            if (datetable.data === req.params.date) {
                const hourtable = new HoursTables(req.body);
                hourtable.DatesTableID = datetable.ID;
                await hourtable.save();
                res.status(201).json({ message: 'created' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables/:date/hourstables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datetables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datetables[0];
            if (datetable) {
                const hourstables = await datetable.getHoursTables();
                res.status(200).json(hourstables);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables/:date/hourstables/:hourtable', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datetables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datetables[0];
            if (datetable) {
                const hourstables = await datetable.getHoursTables({
                    where: {
                        oraIncepere: req.params.hourtable
                    }
                });
                const hourtable = hourstables[0];
                if (hourtable) {
                    res.status(200).json(hourtable);
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/images', async (req, res, next) => {
    try {
        await Images.create(req.body);
        res.status(200).json({ message: 'created' });
    } catch (error) {
        next(error);
    }
})

app.get('/images', async (req, res, next) => {
    try {
        const images = await Images.findAll();
        res.status(201).json(images);
    } catch (error) {
        next(error);
    }
})

app.get('/images/:imagename', async (req, res, next) => {
    try {
        const image = await Images.findByPk(req.params.imagename);
        if (image) {
            res.status(201).json(image);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.use(express.static(path.join(__dirname, 'Client/app/build')));


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/app/build', 'index.html'));
});


app.use((error, req, res, next) => {
    console.warn(error)
    res.status(500).json({ message: 'server error' })
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

=======
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require('cors')
const mysql = require('mysql2/promise')
const path = require('path')
const PORT = process.env.PORT || 8080;

const app = express()
app.use(bodyParser.json());

const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://shrouded-journey-38552.herokuapp.com']
const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin)
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable")
            callback(null, true)
        } else {
            console.log("Origin rejected")
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));

const DB_USERNAME = 'root'
const DB_PASSWORD = ''
let conn

mysql.createConnection(
    {
        user: DB_USERNAME,
        password: DB_PASSWORD
    })
    .then((connection) => {
        conn = connection
        return connection.query('CREATE DATABASE IF NOT EXISTS Licenta')
    })
    .then(() => {
        return conn.end()
    })
    .catch((error) => {
        console.warn(error.stack)
    })

const sequelize = new Sequelize('Licenta', DB_USERNAME, DB_PASSWORD,
    {
        dialect: 'mysql'
    })

const Users = sequelize.define('User',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        prenume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        email:
        {
            type: Sequelize.STRING,
            primaryKey: true
        },
        parola:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        judet:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        localitate:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        strada:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        etaj:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        apartament:
        {
            type: Sequelize.STRING,
            allowNull: true
        },
        telefon:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        tip:
        {
            type: Sequelize.STRING,
            defaultValue: 'client'
        }
    })

const FavoriteProducts = sequelize.define('FavoriteProduct',
    {
        nume:
        {
            type: Sequelize.STRING,
            primaryKey: true
        }
    })

Users.hasMany(FavoriteProducts);

const ShoppingCarts = sequelize.define('ShoppingCart', {
    ID:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    stare:
    {
        type: Sequelize.STRING,
        defaultValue: "in procesare"
    }
})

Users.hasMany(ShoppingCarts);

const CartProducts = sequelize.define('CartProduct',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        cantitate:
        {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

ShoppingCarts.hasMany(CartProducts);

const Orders = sequelize.define('Order',
    {
        ID:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pret:
        {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        data:
        {
            type: Sequelize.STRING,
            allowNull: false,
        },
        tipPlata:
        {
            type: Sequelize.STRING
        },
        numarMasa:
        {
            type: Sequelize.INTEGER
        },
        stare:
        {
            type: Sequelize.STRING,
            defaultValue: 'in procesare'
        },
        starePlata:
        {
            type: Sequelize.STRING,
            defaultValue: 'neachitata'
        },
        livrata:
        {
            type: Sequelize.BOOLEAN
        }
    })

Users.hasMany(Orders);

const OrderedProducts = sequelize.define('OrderedProduct',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        cantitate:
        {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    })

Orders.hasMany(OrderedProducts);

const Products = sequelize.define('Product',
    {
        nume:
        {
            type: Sequelize.STRING,
            primaryKey: true
        },
        descriere:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        pret:
        {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        gramaj:
        {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        stare:
        {
            type: Sequelize.STRING,
            defaultValue: 'vizibil'
        },
        tip:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

const Ingredients = sequelize.define('Ingredient',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

Products.hasMany(Ingredients);

const Reviews = sequelize.define('Review',
    {
        ID:
        {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text:
        {
            type: Sequelize.TEXT,
            allowNull: false
        },
        autor:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        numarLikeuri:
        {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        numarDislikeuri:
        {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        data:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

Products.hasMany(Reviews);

const Images = sequelize.define('Image',
    {
        nume:
        {
            type: Sequelize.STRING,
            allowNull: false
        },
        cale:
        {
            type: Sequelize.STRING,
            allowNull: false
        }
    })

const Tables = sequelize.define('Table', {
    numar:
    {
        type: Sequelize.INTEGER,
        primaryKey: true
    }
})

const DatesTables = sequelize.define('DatesTable', {
    ID:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data:
    {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Tables.hasMany(DatesTables);

const HoursTables = sequelize.define('HoursTable', {
    oraIncepere:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    oraTerminare:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    stare:
    {
        type: Sequelize.STRING,
        allowNull: false
    }
})

DatesTables.hasMany(HoursTables);

const DayOfWeeks = sequelize.define('DayOfWeek', {
    data:
    {
        type: Sequelize.STRING,
        primaryKey: true
    }
})

const DayOrderedProducts = sequelize.define('DayOrderedProduct', {
    nume:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    cantitate:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

DayOfWeeks.hasMany(DayOrderedProducts);

const Reservations = sequelize.define('Reservation', {
    numar:
    {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    oraIncepere:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    oraTerminare:
    {
        type: Sequelize.STRING,
        allowNull: false
    },
    numarMasa:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

Users.hasMany(Reservations);

app.get('/create', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (error) {
        next(error)
    }
})

app.get('/users', async (req, res, next) => {
    try {
        const users = await Users.findAll();
        res.status(201).json(users);
    }
    catch (error) {
        next(error);
    }
})

app.post('/users', async (req, res, next) => {
    try {
        await Users.create(req.body);
        res.status(200).json({ message: 'created' });
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser', async (req, res, next) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.params.euser
            }
        });
        // const user = users.shift();
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.put('/users/:euser', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            await user.update(req.body);
            res.status(201).json({ message: 'accepted' });
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            await user.destroy();
            res.status(201).json({ message: 'accepted' });
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/favoriteproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const favoriteproduct = new FavoriteProducts(req.body);
            favoriteproduct.UserEmail = user.email;
            await favoriteproduct.save();
            res.status(201).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/favoriteproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const favoriteproducts = await user.getFavoriteProducts();
            res.status(200).json(favoriteproducts);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser/favoriteproducts/:nfavoriteproduct', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const favoriteproducts = await user.getFavoriteProducts({
                where: {
                    nume: req.params.nfavoriteproduct
                }
            });
            favoriteproduct = favoriteproducts.shift();
            if (favoriteproduct) {
                await favoriteproduct.destroy();
                res.status(201).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/shoppingcarts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcart = new ShoppingCarts(req.body);
            shoppingcart.UserEmail = user.email;
            await shoppingcart.save();
            res.status(201).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/shoppingcarts/:stare', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                res.status(200).json(shoppingcart);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.put('/users/:euser/shoppingcarts/:stare', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                await shoppingcart.update(req.body);
                res.status(202).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/shoppingcarts/:stare/cartproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproduct = new CartProducts(req.body);
                cartproduct.ShoppingCartID = shoppingcart.ID;
                await cartproduct.save();
                res.status(201).json({ message: 'created' })
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/shoppingcarts/:stare/cartproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts();
                res.status(200).json(cartproducts);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/shoppingcarts/:stare/cartproducts/:cartproductname', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts({
                    where: {
                        nume: req.params.cartproductname
                    }
                });
                const cartproduct = cartproducts.shift();
                if (cartproduct) {
                    res.status(200).json(cartproduct);
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.put('/users/:euser/shoppingcarts/:stare/cartproducts/:cartproductname', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts({
                    where: {
                        nume: req.params.cartproductname
                    }
                });
                const cartproduct = cartproducts.shift();
                if (cartproduct) {
                    await cartproduct.update(req.body);
                    res.status(202).json({ message: 'accepted' });
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser/shoppingcarts/:stare/cartproducts/:cartproductname', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const shoppingcarts = await user.getShoppingCarts({
                where: {
                    stare: req.params.stare
                }
            });
            const shoppingcart = shoppingcarts.pop();
            if (shoppingcart) {
                const cartproducts = await shoppingcart.getCartProducts({
                    where: {
                        nume: req.params.cartproductname
                    }
                });
                const cartproduct = cartproducts.shift();
                if (cartproduct) {
                    cartproduct.destroy();
                    res.status(202).json({ message: 'accepted' });
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/orders', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const order = new Orders(req.body);
            order.UserEmail = user.email;
            await order.save();
            res.status(201).json({ message: 'created', ID: order.ID });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/orders', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders();
            res.status(200).json(orders);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/orders/:orderID', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders({
                where: {
                    ID: req.params.orderID
                }
            })
            const order = orders.shift();
            if (order) {
                res.status(200).json(order);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/orders/:orderID/orderedproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders({
                where: {
                    ID: req.params.orderID
                }
            })
            const order = orders.shift();
            if (order) {
                const orderedproduct = new OrderedProducts(req.body);
                orderedproduct.OrderID = order.ID;
                await orderedproduct.save();
                res.status(201).json({ message: 'created' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/orders/:orderID/orderedproducts', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const orders = await user.getOrders({
                where: {
                    ID: req.params.orderID
                }
            })
            const order = orders.shift();
            if (order) {
                const orderedproducts = await order.getOrderedProducts();
                res.status(200).json(orderedproducts);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.post('/users/:euser/reservations', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservation = new Reservations(req.body);
            reservation.UserEmail = user.email;
            await reservation.save();
            res.status(200).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/reservations', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservations = await user.getReservations();
            res.status(201).json(reservations);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/users/:euser/reservations/:reservationnumber', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservations = await user.getReservations({
                where: {
                    numar: req.params.reservationnumber
                }
            });
            const reservation = reservations.shift();
            if (reservation) {
                res.status(201).json(reservation);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.delete('/users/:euser/reservations/:reservationnumber', async (req, res, next) => {
    try {
        const user = await Users.findByPk(req.params.euser);
        if (user) {
            const reservations = await user.getReservations({
                where: {
                    numar: req.params.reservationnumber
                }
            });
            const reservation = reservations.shift();
            if (reservation) {
                await reservation.destroy();
                res.status(200).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    }
    catch (error) {
        next(error);
    }
})

app.get('/products/all', async (req, res, next) => {
    try {
        const products = await Products.findAll();
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})


app.get('/products', async (req, res, next) => {
    try {
        const products = await Products.findAll({
            where: {
                stare: "vizibil"
            }
        });
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
})

app.post('/products', async (req, res, next) => {
    try {
        await Products.create(req.body)
        res.status(201).json({ message: 'created' })
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            res.status(200).json(product)
        }
        else {
            res.status(404).json({ message: 'not Found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/type/:ptype', async (req, res, next) => {
    try {
        const products = await Products.findAll({
            where: {
                tip: req.params.ptype
            }
        });
        if (products) {
            res.status(200).json(products)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            await product.update(req.body);
            res.status(202).json({ message: "accepted" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/products/:pname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            await product.destroy();
            res.status(202).json({ message: "accepted" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/ingredients', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredients = await product.getIngredients();
            res.status(200).json(ingredients);
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.post('/products/:pname/ingredients', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredient = new Ingredients(req.body);
            ingredient.ProductNume = product.nume;
            await ingredient.save();
            res.status(201).json({ message: "created" });
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/ingredients/:iname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredient = await product.getIngredients({
                where:
                {
                    nume: req.params.iname
                }
            });
            if (ingredient) {
                res.status(200).json(ingredient);
            }
            else {
                res.status(404).json({ message: "not found" });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pname/ingredients/:iname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredients = await product.getIngredients({
                where:
                {
                    nume: req.params.iname
                }
            });
            const ingredient = ingredients.shift();
            if (ingredient) {
                await ingredient.update(req.body);
                res.status(201).json({ message: "accepted" });
            }
            else {
                res.status(404).json({ message: "not found" });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/products/:pname/ingredients/:iname', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const ingredients = await product.getIngredients({
                where:
                {
                    nume: req.params.iname
                }
            });
            const ingredient = ingredients.shift();
            if (ingredient) {
                await ingredient.destroy();
                res.status(201).json({ message: "accepted" });
            }
            else {
                res.status(404).json({ message: "not found" });
            }
        }
        else {
            res.status(404).json({ message: "not found" });
        }
    } catch (error) {
        next(error)
    }
})

app.post('/products/:pname/reviews', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const review = new Reviews(req.body);
            review.ProductNume = product.nume;
            await review.save();
            res.status(201).json({ message: 'created' })
        }
        else {
            res.status(404).json({ message: 'not Found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/reviews', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews();
            res.status(200).json(reviews)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.get('/products/:pname/reviews/:reviewID', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews({
                where: {
                    ID: req.params.reviewID
                }
            });
            const review = reviews.shift();
            if (review) {
                res.status(200).json(review)
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.put('/products/:pname/reviews/:reviewID', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews({
                where: {
                    ID: req.params.reviewID
                }
            });
            const review = reviews.shift();
            if (review) {
                await review.update(req.body);
                res.status(201).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.delete('/products/:pname/reviews/:reviewID', async (req, res, next) => {
    try {
        const product = await Products.findByPk(req.params.pname);
        if (product) {
            const reviews = await product.getReviews({
                where: {
                    ID: req.params.reviewID
                }
            });
            const review = reviews.shift();
            if (review) {
                await review.destroy();
                res.status(201).json({ message: 'accepted' })
            }
            else {
                not
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error)
    }
})

app.post('/daysofweeks', async (req, res, next) => {
    try {
        await DayOfWeeks.create(req.body);
        res.status(200).json({ message: 'created' });
    } catch (error) {
        next(error);
    }
})

app.get('/daysofweeks', async (req, res, next) => {
    try {
        const daysofweek = await DayOfWeeks.findAll();
        if (daysofweek) {
            res.status(201).json(daysofweek);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error);
    }
})

app.get('/daysofweeks/:dayofweekdate', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findOne({
            where: {
                data: req.params.dayofweekdate
            }
        });
        if (dayofweek) {
            res.status(201).json(dayofweek);
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (error) {
        next(error);
    }
})

app.post('/daysofweeks/:dayofweekdate/dayorderedproducts', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findByPk(req.params.dayofweekdate);
        if (dayofweek) {
            const dayorderedproduct = new DayOrderedProducts(req.body);
            dayorderedproduct.DayOfWeekData = dayofweek.data;
            await dayorderedproduct.save();
            res.status(200).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/daysofweeks/:dayofweekdate/dayorderedproducts/:dayorderedproductname', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findByPk(req.params.dayofweekdate);
        if (dayofweek) {
            const dayorderedproducts = await dayofweek.getDayOrderedProducts({
                where: {
                    nume: req.params.dayorderedproductname
                }
            });
            const dayorderedproduct = dayorderedproducts.shift();
            if (dayorderedproduct) {
                res.status(200).json(dayorderedproduct);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.put('/daysofweeks/:dayofweekdate/dayorderedproducts/:dayorderedproductname', async (req, res, next) => {
    try {
        const dayofweek = await DayOfWeeks.findByPk(req.params.dayofweekdate);
        if (dayofweek) {
            const dayorderedproducts = await dayofweek.getDayOrderedProducts({
                where: {
                    nume: req.params.dayorderedproductname
                }
            });
            const dayorderedproduct = dayorderedproducts.shift();
            if (dayorderedproduct) {
                dayorderedproduct.cantitate = req.body.cantitate;
                await dayorderedproduct.save();
                res.status(201).json({ message: 'accepted' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/tables', async (req, res, next) => {
    try {
        await Tables.create(req.body);
        res.status(200).json({ message: 'created' });
    } catch (error) {
        next(error);
    }
})

app.get('/tables', async (req, res, next) => {
    try {
        const tables = await Tables.findAll();
        res.status(201).json(tables);
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            res.status(201).json(table);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/tables/:tablenumber/datestables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datetable = new DatesTables(req.body);
            datetable.TableNumar = table.numar;
            await datetable.save();
            res.status(201).json({ message: 'created' });
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datestables = await table.getDatesTables();
            res.status(200).json(datestables);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables/:date', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datestables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datestables[0];
            if (datetable) {
                res.status(200).json(datetable);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/tables/:tablenumber/datestables/:date/hourstables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datestables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datestables.pop();
            if (datetable.data === req.params.date) {
                const hourtable = new HoursTables(req.body);
                hourtable.DatesTableID = datetable.ID;
                await hourtable.save();
                res.status(201).json({ message: 'created' });
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables/:date/hourstables', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datetables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datetables[0];
            if (datetable) {
                const hourstables = await datetable.getHoursTables();
                res.status(200).json(hourstables);
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.get('/tables/:tablenumber/datestables/:date/hourstables/:hourtable', async (req, res, next) => {
    try {
        const table = await Tables.findByPk(req.params.tablenumber);
        if (table) {
            const datetables = await table.getDatesTables({
                where: {
                    data: req.params.date
                }
            });
            const datetable = datetables[0];
            if (datetable) {
                const hourstables = await datetable.getHoursTables({
                    where: {
                        oraIncepere: req.params.hourtable
                    }
                });
                const hourtable = hourstables[0];
                if (hourtable) {
                    res.status(200).json(hourtable);
                }
                else {
                    res.status(404).json({ message: 'not found' });
                }
            }
            else {
                res.status(404).json({ message: 'not found' });
            }
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.post('/images', async (req, res, next) => {
    try {
        await Images.create(req.body);
        res.status(200).json({ message: 'created' });
    } catch (error) {
        next(error);
    }
})

app.get('/images', async (req, res, next) => {
    try {
        const images = await Images.findAll();
        res.status(201).json(images);
    } catch (error) {
        next(error);
    }
})

app.get('/images/:imagename', async (req, res, next) => {
    try {
        const image = await Images.findByPk(req.params.imagename);
        if (image) {
            res.status(201).json(image);
        }
        else {
            res.status(404).json({ message: 'not found' });
        }
    } catch (error) {
        next(error);
    }
})

app.use(express.static(path.join(__dirname, 'Client/app/build')));


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client/app/build', 'index.html'));
});


app.use((error, req, res, next) => {
    console.warn(error)
    res.status(500).json({ message: 'server error' })
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

>>>>>>> c8c9ace100b84fcf95ba67676e6520776df57ef0
