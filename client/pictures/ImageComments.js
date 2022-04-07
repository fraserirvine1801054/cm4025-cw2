import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { listCom, createCom, getComName } from './api-pictures';
import auth from './../auth/auth-helper';

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
    Avatar,
    TextField,
    Button
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

export default function ImageComments(props) {
    const classes = useStyles();
    const [comments, setComments] = useState([]);
    const [values, setValues] = useState({
        comment_text: ''
    });

    useEffect(() => {
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
        return function cleanup() {
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
        createCom(comment, props.image_id).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', open: true });
            }
        });
    }

    return (
        <Box className={classes.root}>
            {
                !auth.isAuthenticated() && (<span>
                    <Typography>
                        Sign in to make comments
                    </Typography>
                </span>)
            }
            {
                auth.isAuthenticated() && (<span>
                    <Typography>
                        Comment
                    </Typography>
                    <TextField
                        id='comment_text'
                        label='Comment'
                        value={values.comment_text}
                        onChange={handleChange('comment_text')}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        onclick={clickSubmit}
                    >
                        Submit
                    </Button>
                </span>)
            }
            {comments.map((item,i) => {
                return(
                    <Card key={i}>
                        <CardHeader
                            avatar={
                                <Avatar/>
                            }
                            title={item.commenter_id}
                            subheader={`uploaded: ${item.post_date}`}
                        />
                        <Typography>
                            <p>{item.comment_text}</p>
                        </Typography>
                    </Card>
                )
            })}

        </Box>
    );

}
/*
async function getUserName(userId) {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getComName(signal,userId).then((data) => {
        if (data && data.error) {
            console.log(data.error);
        } else {
            return data;
        }
    });
}
*/