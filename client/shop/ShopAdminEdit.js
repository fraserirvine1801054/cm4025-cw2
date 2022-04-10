import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';
import { checkAdmin } from '../user/api-user';
import { deleteItem, editItem, getSingleItem } from './api-shop';

import {
    Paper,
    Typography,
    Card,
    CardMedia,
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
        width: 400,
        height: 300
    }
}));

export default function ShopAdminEdit({ match }) {

    const classes = useStyles();
    let [isAdmin, setIsAdmin] = useState({ admin: false });
    let [currentItem, setCurrentItem] = useState([]);
    const [values, setValues] = useState({
        new_item_name: '',
        new_item_price: 0.0,
        new_item_stock: 0,
        new_item_description: '',
        new_item_picture: ''
    });

    const jwt = auth.isAuthenticated();

    useEffect(() => {
        console.log("shopadminedit useeffect call");
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

        getSingleItem(signal, match.params.itemId).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data);
            } else {
                console.log(data);
                setCurrentItem(data);
                setValues({
                    new_item_name: data.item_name,
                    new_item_price: data.item_price,
                    new_item_stock: data.item_stock,
                    new_item_description: data.item_description,
                    new_item_picture: data.item_picture
                });
            }
        });

        return () => {
            abortController.abort();
        }
    }, [match.params.itemId]);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }

    const clickSubmit = () => {
        const editedItem = {
            item_name: values.new_item_name,
            item_price: parseFloat(values.new_item_price),
            item_stock: parseInt(values.new_item_stock),
            item_description: values.new_item_description,
            item_picture: values.new_item_picture
        }

        console.log(editedItem);
        console.log(jwt);
        editItem(editedItem, jwt.token, match.params.itemId).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error});
            } else {
                setValues({ ...values, error: '', open: true});
            }
        });
    }

    const clickDelete = () => {
        deleteItem(jwt.token, match.params.itemId).then((data) => {
            if (data.error) {
                console.log(data.error);
            }
        });
    }

    return (
        <Paper className={classes.root} elevation={4}>
            {
                !isAdmin.admin && (<span>
                    <Typography>
                        Access denied
                    </Typography>
                </span>)
            }
            {
                isAdmin.admin && (<span>
                    <Typography>
                        Edit Item
                    </Typography>
                    <Card>
                        <CardMedia
                            className={classes.Media}
                            component="img"
                            src={currentItem.item_picture}
                        />
                        <Typography>
                            {currentItem.item_name}
                        </Typography>
                        <Typography>
                            {currentItem.item_price}
                        </Typography>
                        <Typography>
                            {currentItem.item_stock}
                        </Typography>
                        <Typography>
                            {currentItem.item_description}
                        </Typography>
                    </Card>
                    <br/>
                    <Card>
                        <Typography>
                            New Details
                        </Typography>
                        <br />
                        <TextField
                            id="new_item_name"
                            label="New item name"
                            value={values.new_item_name}
                            onChange={handleChange('new_item_name')}
                            fullWidth={true}
                        /><br />
                        <TextField
                            id="new_item_price"
                            label="New item price"
                            type="number"
                            value={values.new_item_price}
                            onChange={handleChange('new_item_price')}
                            fullWidth={true}
                        /><br />
                        <TextField
                            id="new_item_stock"
                            label="New item stock"
                            type="number"
                            value={values.new_item_stock}
                            onChange={handleChange('new_item_stock')}
                            fullWidth={true}
                        /><br />
                        <TextField
                            id="new_item_description"
                            label="New item description"
                            value={values.new_item_description}
                            onChange={handleChange('new_item_description')}
                            fullWidth={true}
                        /><br />
                        <TextField
                            id="new_item_picture"
                            label="New item picture"
                            value={values.new_item_picture}
                            onChange={handleChange('new_item_picture')}
                            fullWidth={true}
                        /><br />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={clickSubmit}
                        >
                            Update
                        </Button>
                        <br/>
                        <br/>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={clickDelete}
                        >
                            Delete item
                        </Button>
                    </Card>
                </span>)
            }
        </Paper>
    )

}