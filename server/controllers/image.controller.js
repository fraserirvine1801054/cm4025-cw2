import Image from '../models/image.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler';

const listImages = async (req,res) => {
    try {
        
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const listComments = async (req,res) => {
    try {

    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}