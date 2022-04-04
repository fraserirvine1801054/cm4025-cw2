import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import theme from '../theme.js';
import { Link } from 'react-router-dom';
import auth from './../auth/auth-helper';

import {
    Paper,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Avatar,
    IconButton,
    Typography,
    Card,
    CardContent,
    TextField,
    CardActions
} from '@material-ui/core';

import ArrowForward from '@material-ui/icons/ArrowForward';

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

export default function Pictures() {

    const classes = useStyles();
    const [uploadValues, setValues] = useState({
        title: '',
        url: '',
    });

    const clickSubmit = () => {

    }

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        /*
        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(data);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
        */
    },[]);

    return(
        <Paper className={classes.root} elevation={4}>
            <Typography variant='h6' className={classes.title}>
                Pictures
            </Typography>
            {
                !auth.isAuthenticated() && (<span>
                    <Typography>
                        Sign in to upload images
                    </Typography>
                </span>)
            }
            {
                auth.isAuthenticated() && (<span>
                    <Typography>
                        Upload an image
                    </Typography>
                    <Card>
                        <CardContent>
                            <TextField id='title' label='Title' /><br />
                            <TextField id='img_url' label='Image URL' /><br />
                        </CardContent>
                        <CardActions>
                            <Button 
                                color="Primary"
                                variant="contained"
                                onClick={clickSubmit}
                                className={classes.submit}
                            >
                                Submit
                            </Button>
                        </CardActions>
                    </Card>
                    
                </span>)
            }
        </Paper>
    );

}