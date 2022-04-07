import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';
import auth from './../auth/auth-helper';

import {
    Paper,
    Typography
} from '@material-ui/core';

export default function Shop() {

    return(
        <Paper>
            <Typography>
                Test shop
            </Typography>
        </Paper>
    )

}