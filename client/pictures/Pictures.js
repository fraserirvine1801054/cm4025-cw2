import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme.js';
import { Link } from 'react-router-dom';
import auth from './../auth/auth-helper';
import ImageComments from './ImageComments';

import { listImg, createImg, deleteImg, userDeleteImg } from './api-pictures.js';
import { checkAdmin, getUserName } from './../user/api-user';

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
    let [isAdmin, setIsAdmin] = useState({});

    const [reloader, setReloader] = useState();

    const jwt = auth.isAuthenticated();

    const getImgList = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        listImg(signal).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
            } else {
                console.log(images);
                setImages([...data]);
            }
        });

        return function cleanup() {
            abortController.abort();
        }
    }


    useEffect(() => {
        console.log("useeffect called");
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
        getImgList();
        /*
        listImg(signal).then((data) => {
            console.log(data);
            if (data && data.error) {
                console.log(data.error);
            } else {
                setImages(data);
            }
        });
        */
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
                getImgList();
            }
        });
    }

    const clickDelete = (imgId) => {
        console.log(`attempting to delete image: ${imgId}`);
        deleteImg(jwt.token, imgId).then((data) => {
            getImgList();
            if (data.error) {
                console.log(data.error);
            }
        });
    }

    const userClickDelete = (imgId) => {
        console.log(`attempting to delete image as user: ${imgId}`);
        userDeleteImg(jwt.token, imgId).then((data) => {
            getImgList();
            if (data.error) {
                console.log(data.error);
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
                    <br />
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
                    <br />
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
                                    title={item.uploader_string}
                                    subheader={`uploaded: ${item.uploaded}`}
                                />
                                {
                                    isAdmin.admin && (<span>
                                        <Button
                                            color="secondary"
                                            size="small"
                                            onClick={() => { clickDelete(item._id) }}
                                        >
                                            admin: delete image
                                        </Button>
                                    </span>)
                                }
                                {
                                    auth.isAuthenticated() && (<span>
                                        {
                                            item.uploader === auth.isAuthenticated().user._id && (<span>
                                                <Button
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => { userClickDelete(item._id) }}
                                                >
                                                    delete image
                                                </Button>
                                            </span>)
                                        }
                                    </span>)
                                }
                                {console.log(`uploader: ${item.uploader}, type: ${typeof item.uploader}`)}
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