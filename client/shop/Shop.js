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
    Button
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
        quantity: 0
    });

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
        return () => {
            abortController.abort();
        }
    }, []);

    const handleChange = name => event => {
        setBasketValues({ ...basketValues, [name]: event.target.value });
    }

    //submit for adding to basket
    const clickSubmit = (itemId, itemName) => {
        const basketItem = {
            item_id: itemId,
            item_name: itemName,
            quantity: basketValues.quantity
        }
        
        console.log(basketItem);
        setBasketItems(basketItems => [...basketItems, basketItem]);
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
                        <Typography>
                            test basket
                        </Typography>
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
                                        onClick={() => { clickSubmit(item._id, item.item_name) }}
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