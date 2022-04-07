import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';

import {
    Paper,
    Typography
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

export default function Shop() {

    const classes = useStyles();
    const [shopItems, setShopItems] = useState([]);

    useEffect(() => {

    });

    return(
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Test shop
            </Typography>

            {
                auth.isAuthenticated()
            }

        </Paper>
    )

}