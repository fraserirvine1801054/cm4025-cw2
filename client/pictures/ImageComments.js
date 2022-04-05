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
    Avatar
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
    const [comments, setComments] = useState({
        img_id: '',
        commenter_id: '',
        post_date: '',
        comment_text: ''
    });

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        listCom(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setComments(data);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, []);

    const clickSubmit = () => {
        const comment = {
            img_id: props.imgId,
            commenter_id: props.userId,
            post_date: '',
            comment_text: ''
        }
        createCom(comment).then((data) => {
            if (data.error) {
                setComments({ ...comments, error: data.error });
            } else {
                setComments({ ...comments, error: '', open: true });
            }
        });
    }

    return (
        <Box>
            {
                !auth.isAuthenticated() && (<span>
                    <Typography>
                        Sign in to comment on pictures
                    </Typography>
                </span>)
            }
            {
                auth.isAuthenticated() && (<span>
                    <Card>
                        <CardContent>
                            <TextField id='comment' label="Comment" className={classes.TextField} value={values.comment} onChange={handleChange('comment')} margin='normal' />
                        </CardContent>
                        <CardActions>
                            <Button color='primary' variant='contained' onClick={clickSubmit} className={classes.submit}>Comment</Button>
                        </CardActions>
                    </Card>
                </span>)
            }
            <hr />
            <List dense>
                {comments.map((item, i) => {
                    <Box>
                        <ListItemAvatar>
                            <Avatar>
                                <Person />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={await getComName(item.userId)} />
                        <ListItemText primary={item.comment_text} />
                    </Box>
                })}
            </List>
        </Box>
    )

}

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