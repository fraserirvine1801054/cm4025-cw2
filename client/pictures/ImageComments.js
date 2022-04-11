import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { listCom, createCom, deleteCom, userDeleteCom } from './api-pictures';
import auth from './../auth/auth-helper';

import { Link } from 'react-router-dom';

import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Box,
    Typography,
    CardContent,
    CardActions,
    CardHeader,
    Card,
    Avatar,
    TextField,
    Button,
    Grid
} from '@material-ui/core';
import { checkAdmin } from '../user/api-user';

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

export default function ImageComments(props) {
    const classes = useStyles();
    const [comments, setComments] = useState([]);
    const [values, setValues] = useState({
        comment_text: ''
    });
    let [isAdmin, setIsAdmin] = useState({});

    const jwt = auth.isAuthenticated();

    const listComments = () => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        listCom(signal, props.image_id).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                console.log(data);
                setComments(data);
            }
        });

        return () => {
            abortController.abort();
        }
    }

    useEffect(() => {
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

        listComments();

        /*
        listCom(signal, props.image_id).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                console.log(data);
                setComments(data);
            }
        });
        */
        return () => {
            abortController.abort();
        }
    }, []);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }

    const clickSubmit = () => {
        const comment = {
            img_id: props.image_id || 'err',
            commenter_id: auth.isAuthenticated().user._id || 'err',
            post_date: Date.now(),
            comment_text: values.comment_text
        }
        console.log(comment);
        createCom(comment).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', open: true });
                listComments();
            }
        });
    }

    const clickDelete = (commentId) => {
        console.log(`attempting to delete comment: ${commentId}`);
        deleteCom(jwt.token, commentId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                listComments();
            }
        });
    }

    const userClickDelete = (commentId) => {
        console.log(`attempting to delete as user: ${commentId}`);
        userDeleteCom(jwt.token, commentId).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                listComments();
            }
        });
    }

    return (
        <Box
            paddingLeft={1}
        >
            {
                !auth.isAuthenticated() && (<span>
                    <Typography>
                        Sign in to make comments
                    </Typography>
                </span>)
            }
            {
                auth.isAuthenticated() && (<span>
                    <Box paddingBottom={2}>
                        <Typography>
                            <u>Comments</u>
                        </Typography>
                        <TextField
                            id='comment_text'
                            label='Comment'
                            value={values.comment_text}
                            onChange={handleChange('comment_text')}
                            fullWidth={true}
                        />
                        <Button
                            color="primary"
                            size="small"
                            onClick={clickSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </span>)
            }
            <Grid
                container
                direction="column"
                spacing={1}
            >
                {comments.map((item, i) => {
                    return (
                        <Grid item>
                            <Card key={i} elevation={3}>
                                <CardHeader
                                    avatar={
                                        <Avatar />
                                    }
                                    title={item.commenter_string}
                                    subheader={`uploaded: ${item.post_date}`}
                                />
                                {
                                    isAdmin.admin && (<span>
                                        <Button
                                            color="secondary"
                                            size="small"
                                            onClick={() => { clickDelete(item._id) }}
                                        >
                                            admin: delete comment
                                        </Button>
                                    </span>)
                                }
                                {
                                    auth.isAuthenticated() && (<span>
                                        {
                                            item.commenter_id === auth.isAuthenticated().user._id && (<span>
                                                <Link to={`/editcomment/${item._id}`}>
                                                    <Button
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        edit comment
                                                    </Button>
                                                </Link>
                                                <Button
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => { userClickDelete(item._id) }}
                                                >
                                                    delete comment
                                                </Button>
                                            </span>)
                                        }
                                    </span>)
                                }
                                <Box
                                    paddingLeft={2}
                                >
                                    <Typography>
                                        <p>{item.comment_text}</p>
                                    </Typography>
                                </Box>

                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    );

}