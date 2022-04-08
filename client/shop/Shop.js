import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';
import { listShopItems } from './api-shop';

import {
    Paper,
    Typography,
    Grid,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
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

    useEffect(() => {
        console.log("useEffect called from Shop.js");
        const abortController = new AbortController();
        const signal = abortController.signal;

        listShopItems(signal).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
            } else {
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
        const basketItem = {
            item_id: itemId,
            item_name: itemName,
            item_price: itemPrice,
            quantity: basketValues.quantity
        }
        let totalItemPrice = itemPrice * basketValues.quantity;

        console.log(basketItem);
        setBasketTotalPrice(basketTotalPrice + totalItemPrice);
        setBasketItems(basketItems => [...basketItems, basketItem]);
    }

    //remove item from basket
    const removeItem = () => {

    }

    console.log("return call");



    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Shop
            </Typography>

            {
                basketItems.length > 0 && (<span>
                    <Box>
                        <Card>
                            <Typography>
                                test basket
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Price (per item)</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {basketItems.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{item.item_name}</TableCell>
                                                <TableCell>{item.item_price}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography>
                                Total Price: {basketTotalPrice}
                            </Typography>
                            <Button color="primary" variant="contained">
                                Checkout
                            </Button>
                        </Card>
                    </Box>
                </span>)
            }

            <Grid container>
                {shopItems.map((item, i) => {
                    return (
                        <Grid item key={i}>
                            <Card>
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
                                        Price: {item.item_price}
                                    </Typography>
                                    <Typography>
                                        <p>{item.item_description}</p>
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
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={() => { clickSubmit(item._id, item.item_name, item.item_price) }}
                                    >
                                        Add to Cart
                                    </Button>
                                    {console.log(basketItems)}
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )

}