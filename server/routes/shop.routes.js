import express from 'express';

const router = express.Router();

//admin add items
router.route('/api/shop/admin')
    .post();


//list items
router.route('/api/shop/items')
    .get();