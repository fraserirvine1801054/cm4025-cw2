import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../theme';
import auth from './../auth/auth-helper';
import {
    Card,
    CardHeader,
    CardMedia,
    Paper,
    Typography,
    Avatar,
    TextField,
    Button
} from '@material-ui/core';
import { editSingleComment, getSingleComment } from './api-pictures';

const useStyles = makeStyles(theme => ({
    root: theme.mixins.gutters({
        padding: theme.spacing(1),
        margin: theme.spacing(5)
    }),
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    Media: {
        width: 400,
        height: 300
    }
}));

export default function UserEditComment({ match }) {

    const classes = useStyles();
    //check if editing user is the commenter
    let [isUser, setIsUser] = useState(false);
    let [thisComment, setThisComment] = useState({});
    const [values, setValues] = useState({
        new_comment_text: ''
    });
    const jwt = auth.isAuthenticated();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (auth.isAuthenticated()) {
            getSingleComment(signal, match.params.comId).then((data) => {
                if (data && data.error) {
                    console.log(data.error);
                } else {
                    setThisComment(data);
                    setValues(data.new_comment_text);
                    if (auth.isAuthenticated().user._id === data.commenter_id) {
                        setIsUser(true);
                    }
                }
            });
        } else {
            setIsUser(false);
        }

    }, [match.params.comId]);

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value});
    }

    const makeEdit = () => {
        const editedComment = {
            img_id: thisComment.img_id,
            commenter_id: thisComment.commenter_id,
            post_date: thisComment.post_date,
            comment_text: values.new_comment_text
        }
        editSingleComment(editedComment, jwt.token, match.params.itemId).then((data) => {
            if (data.error) {
                console.log(data.error);
            }
        });
    }

    return (
        <Paper>
            {
                !isUser && (<span>
                    <Typography>
                        access denied
                    </Typography>
                </span>)
            }
            {
                isUser && (<span>
                    <Typography>
                        Edit Comment
                    </Typography>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar/>
                            }
                            title={thisComment.commenter_string}
                            subheader={`uploaded: ${thisComment.post_date}`}
                        />
                        <Box>
                            <Typography>
                                {thisComment.comment_text}
                            </Typography>
                        </Box>
                    </Card>

                    <Card>
                        <TextField
                            id="new_comment_text"
                            label="New Comment Text"
                            value={values.new_comment_text}
                            onChange={handleChange('new_comment_text')}
                            fullWidth={true}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => {clickEdit()}}
                        >
                            Make Edit
                        </Button>
                    </Card>

                </span>)
            }
        </Paper>
    );
}