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
    Box
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

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Shop
            </Typography>

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
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

        </Paper>
    )

}