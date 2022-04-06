import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme.js';
import { Link } from 'react-router-dom';
import auth from './../auth/auth-helper';
import ImageComments from './ImageComments';

import { listImg, createImg } from './api-pictures.js';

import { read } from './../user/api-user';

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
    CardActions,
    Button,
    ListItemAvatar
} from '@material-ui/core';

import ArrowForward from '@material-ui/icons/ArrowForward';
import { SettingsBackupRestoreSharp } from '@material-ui/icons';

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

export default function Pictures({ match }) {

    const classes = useStyles();
    const [images, setImages] = useState({
        image_url: '',
        image_title: '',
        uploader: '',
        uploaded: ''
    });
    const [user, setUser] = useState({});
    const jwt = auth.isAuthenticated();


    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        read({
            userId: match.params.userId
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
            } else {
                setUser(data);
            }
        });

        /*
        listImg(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setImages(data);
            }
        })
        */
    }, [match.params.userId]);

    const handleChange = name => event => {
        setImages({ ...images, [name]: event.target.value})
    }

    const clickSubmit = () => {
        const image = {
            image_url: images.img_url,
            image_title: images.img_title,
            uploader: user,
            uploaded: Date.now()
        }
        console.log(image);
        createImg(image).then((data) => {
            if (data.error) {
                setImages({ ...images, error: data.error});
            } else {
                setImages({ ...images, error: '', open: true});
            }
        });
    }
    
    return (
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
                            <TextField 
                                id='img_title' 
                                label='Title' 
                                value={images.img_title}
                                onChange={handleChange('img_title')}
                            /> <br />
                            <TextField
                                id='img_url'
                                label='Image URL'
                                value={images.img_url}
                                onChange={handleChange('img_url')}
                            /> <br />
                        </CardContent>
                        <CardActions>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={clickSubmit}
                            >
                                Submit
                            </Button>
                        </CardActions>
                    </Card>
                </span>)
            }
        </Paper >
    );

}