import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';
import { checkAdmin } from '../user/api-user';
import { createShopItem } from './api-shop';

import {
    Paper,
    Typography,
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
    }
}));

export default function ShopAdminAdd() {

    const classes = useStyles();
    let [isAdmin, setIsAdmin] = useState({});
    const [values, setValues] = useState({
        item_id: '',
        item_price: 0.0,
        item_stock: 0,
        item_description: '',
        item_picture: ''
    });
    const jwt = auth.isAuthenticated();

    console.log(jwt);

    useEffect(() => {
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
        }

        return () => {
            abortController.abort();
        }
    }, []);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value});
    }

    const clickSubmit = () => {
        const shopItem = {
            item_name: values.item_name,
            item_price: parseFloat(values.item_price),
            item_stock: parseInt(values.item_stock),
            item_picture: values.item_picture,
            item_description: values.item_description
        }
        console.log(shopItem);
        createShopItem(jwt.token, shopItem).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error});
            } else {
                setValues({ ...values, error: '', open: true});
            }
        });
    }

    return (
        <Paper className={classes.root} elevation={4}>
            {
                !isAdmin.admin && (<span>
                    <Typography>
                        Access Denied
                    </Typography>
                </span>)
            }
            {
                isAdmin.admin && (<span>
                    <Typography>
                        Add Items
                    </Typography>

                    <TextField
                        id="item_name"
                        label="Item Name"
                        value={values.item_name}
                        onChange={handleChange('item_name')}
                        fullWidth={true}
                    /><br/>
                    <TextField
                        id="item_price"
                        label="Price"
                        type="number"
                        value={values.item_price}
                        onChange={handleChange('item_price')}
                        fullWidth={true}
                    /><br/>
                    <TextField
                        id="item_stock"
                        label="Initial Stock"
                        type="number"
                        value={values.item_stock}
                        onChange={handleChange('item_stock')}
                        fullWidth={true}
                    /><br/>
                    <TextField
                        id="item_description"
                        label="Item Description"
                        value={values.item_description}
                        onChange={handleChange('item_description')}
                        fullWidth={true}
                    /><br/>
                    <TextField
                        id="item_picture"
                        label="Item picture URL"
                        value={values.item_picture}
                        onChange={handleChange('item_picture')}
                        fullWidth={true}
                    /><br/>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={clickSubmit}
                    ><br/>
                        Submit
                    </Button>
                </span>)
            }
        </Paper>
    )

}