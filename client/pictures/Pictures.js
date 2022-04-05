import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme.js';
import { Link } from 'react-router-dom';
import auth from './../auth/auth-helper';
import ImageComments from './ImageComments';

import { listImg } from './api-pictures.js';

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
    const [images, setImages] = useState([]);
    const [user, setUser] = useState({});
    const jwt = auth.isAuthenticated();


    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        read({
            userId: match.params.userId
        }, { t: jwt.token }.signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
            } else {
                setUser(data);
            }
        });

        listImg(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setImages(data);
            }
        })
    }, [match.params.userId]);

    //get comments per image


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
                        <hr />
                        <List>
                            {images.map((item, i) => {
                                <Card>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Person />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.uploader} />
                                    <ListItemText primary={item.uploaded} />
                                    <Typography>
                                        {item.image_title}
                                    </Typography>
                                    <hr />
                                    <img
                                        src={item.image_url}
                                        alt='new'
                                    />
                                    <hr />
                                    <ImageComments 
                                        userId={user._id}
                                        imgId={item._id}
                                    />
                                </Card>
                            })
                            }
                        </List>
                    </Card>


                </span>)
            }
        </Paper>
    );

}