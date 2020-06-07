const check = require('express-validator').check;
const validationResult = require('../../common/middlewares/validators.util').validationResult;

/**
 * Validates login request
 */
exports.login = [
    check('email')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY')
      .isEmail()
      .withMessage('EMAIL_IS_NOT_VALID'),
    check('password')
      .exists()
      .withMessage('MISSING')
      .not()
      .isEmpty()
      .withMessage('IS_EMPTY')
      .isLength({
        min: 5
      })
      .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
    (req, res, next) => validationResult(req, res, next)
];
