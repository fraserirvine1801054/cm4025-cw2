import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import { listCom } from './api-pictures';
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
    CardActions
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

export default function ImageComments() {

    const classes = useStyles();
    const [comments, setComments] = useState([]);

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
            
        }
    }

    return(
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
        </Box>
    )

}