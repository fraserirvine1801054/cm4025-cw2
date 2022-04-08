import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';

import {
    Paper,
    Typography
} from '@material-ui/core';

export default function ShopAdminAdd() {

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        return () => {
            abortController.abort();
        }
    }, [])

    return(
        <Paper>
            <Typography>
                add test
                {console.log(auth.isAuthenticated())}
            </Typography>
        </Paper>
    )

}