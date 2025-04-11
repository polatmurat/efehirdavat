const {body} = require("express-validator");

module.exports = [
    body('title').optional().trim().escape(),
    body('price').custom((value) => {
        if(!parseFloat(value) > 0) {
            throw new Error('Price should be above 0');
        } else {
            return parseFloat(value);
        }
    }).trim().escape(),
    body('discount').optional().custom((value) => {
        if(parseInt(value) < 0) {
            throw new Error('Discount must not be negative');
        } else {
            return parseInt(value);
        }
    }).trim().escape(),
    body('category').not().isEmpty().trim().escape().withMessage('category is required'),
    body('description').optional().trim().escape(),
    body('stock').optional().custom((value) => {
        if(parseInt(value) < 0) {
            throw new Error('Stock must not be negative');
        } else {
            return parseInt(value);
        }
    }).trim().escape()
]