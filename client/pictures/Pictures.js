import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme.js';
import { Link } from 'react-router-dom';
import auth from './../auth/auth-helper';
import ImageComments from './ImageComments';

import { listImg, createImg } from './api-pictures.js';
import { getUserName } from './../user/api-user';

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
    CardHeader,
    TextField,
    CardActions,
    Button,
    ListItemAvatar,
    Grid,
    GridList,
    CardMedia,
    Box
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
    const [images, setImages] = useState([]);
    const [values, setValues] = useState({
        img_url: '',
        img_title: ''
    });

    useEffect(() => {
        console.log("useeffect called");
        const abortController = new AbortController();
        const signal = abortController.signal;

        listImg(signal).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
            } else {
                setImages(data);
            }
        });

        return function cleanup() {
            abortController.abort();
        }
    }, []);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = () => {
        const image = {
            image_url: values.img_url,
            image_title: values.img_title,
            uploader: auth.isAuthenticated().user._id,
            uploaded: Date.now()
        }
        console.log(image);
        createImg(image).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', open: true });
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
                                value={values.img_title}
                                onChange={handleChange('img_title')}
                            /> <br />
                            <TextField
                                id='img_url'
                                label='Image URL'
                                value={values.img_url}
                                onChange={handleChange('img_url')}
                                fullWidth={true}
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
            <Grid
                container
                direction="column"
                spacing={2}
            >
                {images.map((item, i) => {
                    return (
                        <Grid item>

                            <Card
                                key={i}
                                elevation={4}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar />
                                    }
                                    title={item.uploader}
                                    subheader={`uploaded: ${item.uploaded}`}
                                />
                                <CardContent>
                                    <Typography variant='h5'>
                                        {item.image_title}
                                    </Typography>
                                </CardContent>
                                <div>
                                    <Box paddingLeft={2}>
                                    <img
                                        src={item.image_url}
                                        alt="alt"
                                        height="400"
                                    />
                                    </Box>
                                </div>
                                <div>
                                    <ImageComments
                                        key={i}
                                        image_id={item._id}
                                    />
                                </div>
                            </Card>
                        </Grid>
                    )
                })
                }
            </Grid>
        </Paper >
    );
}