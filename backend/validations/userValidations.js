const {body} = require("express-validator");

module.exports.registerValidations = [
    body('name').not().isEmpty().trim().escape().withMessage('name is required'),
    body('email').not().isEmpty().trim().escape().withMessage('username is required'),
    body('password').isLength({min: 5}).withMessage('password should be 5 characters long')
]

module.exports.loginValidations = [
    body('email').not().isEmpty().trim().escape().withMessage('username is required'),
    body('password').not().isEmpty().withMessage('password is required')
]