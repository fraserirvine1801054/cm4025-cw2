import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';
import { listShopItems } from './api-shop';
import { checkAdmin } from '../user/api-user';
import { Link } from 'react-router-dom';

import {
    Paper,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    Media: {
        width: 250
    },
    Card: {
        maxWidth: 250
    }
}));

export default function Shop() {

    const classes = useStyles();
    const [shopItems, setShopItems] = useState([]);
    let [basketItems, setBasketItems] = useState([]);
    const [basketValues, setBasketValues] = useState({
        item_id: '',
        item_name: '',
        item_price: 0.0,
        quantity: 0
    });
    let [basketTotalPrice, setBasketTotalPrice] = useState(0.0);
    let [isAdmin, setIsAdmin] = useState({});


    //currency formatter
    let currencyFormatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
    });

    useEffect(() => {
        console.log("useEffect called from Shop.js");
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (auth.isAuthenticated()) {
            checkAdmin(auth.isAuthenticated().user._id, signal).then((data) => {
                console.log(data);
                if (data && data.error) {
                    console.log(data.error);
                } else {
                    console.log(data);
                    setIsAdmin(data);
                }
            });
        } else {
            setIsAdmin({ admin: false });
        }

        listShopItems(signal).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
            } else {
                console.log(data);
                setShopItems(data);
            }
        });

        console.log("useeffect test");

        return () => {
            abortController.abort();
        }
    }, []);

    const handleChange = name => event => {
        setBasketValues({ ...basketValues, [name]: event.target.value });
    }

    //submit for adding to basket
    const clickSubmit = (itemId, itemName, itemPrice) => {
        let totalItemPrice = itemPrice * basketValues.quantity;
        const basketItem = {
            item_id: itemId,
            item_name: itemName,
            item_price: itemPrice,
            item_total_price: totalItemPrice,
            quantity: basketValues.quantity
        }

        console.log(basketItem);
        setBasketTotalPrice(basketTotalPrice + totalItemPrice);
        setBasketItems(basketItems => [...basketItems, basketItem]);
    }

    //remove item from basket
    const removeItem = (itemIndex) => {
        let thisBasketItems = basketItems;
        thisBasketItems.splice(itemIndex, 1);

        let newTotalPrice = 0.0;
        thisBasketItems.forEach(element => {
            newTotalPrice += element.item_total_price;
        });

        setBasketTotalPrice(newTotalPrice);
        setBasketItems([...thisBasketItems]);
    }

    console.log("return call");

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Shop
            </Typography>
            {
                isAdmin.admin && (<span>
                    <Link to="/shopadmin/add">
                        <Button
                            color="primary"
                        >
                            Admin: add item
                        </Button>
                    </Link>
                </span>)
            }

            {
                basketItems.length > 0 && (<span>
                    <Box>
                        <Card>
                            <CardHeader
                                title="Your Basket"
                            />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Price (per item)</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>total price of item</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {basketItems.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{item.item_name}</TableCell>
                                                <TableCell>{currencyFormatter.format(item.item_price)}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{currencyFormatter.format(item.item_total_price)}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => { removeItem(i) }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography>
                                Total Price: {currencyFormatter.format(basketTotalPrice)}
                            </Typography>
                            <CardActions>
                                <Button color="primary" variant="contained">
                                    Checkout
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                </span>)
            }
            <br />
            <Grid
                container
                spacing={2}
            >
                {shopItems.map((item, i) => {
                    return (
                        <Grid item>
                            <Card
                                className={classes.Card}
                                key={i}
                            >
                                <CardHeader
                                    title={item.item_name}
                                />
                                <CardMedia
                                    className={classes.Media}
                                    component="img"
                                    src={item.item_picture}
                                />
                                <CardContent>
                                    <Typography>
                                        Price: {currencyFormatter.format(item.item_price)}
                                    </Typography>
                                    <Typography>
                                        Stock: {item.item_stock}
                                    </Typography>
                                    <Typography component="p">
                                        {item.item_description}
                                    </Typography>
                                    <TextField
                                        id="quantity"
                                        label="Quantity"
                                        type="number"
                                        value={basketValues.quantity}
                                        defaultValue={1}
                                        onChange={handleChange('quantity')}
                                        helperText="quantity must be 1 or greater"
                                    />
                                    <br />
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => { clickSubmit(item._id, item.item_name, item.item_price) }}
                                    >
                                        Add to Cart
                                    </Button>
                                    {
                                        isAdmin.admin && (<span>
                                            <br />
                                            <Link to={`/shopadmin/edit/${item._id}`}>
                                                <Button
                                                    color="primary"
                                                >
                                                    Admin: edit item
                                                </Button>
                                            </Link>
                                        </span>)
                                    }
                                </CardContent>
                                {console.log(isAdmin)}
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )

}