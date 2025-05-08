const joi = require('joi');
let userSchema = joi.object({
    first_name:joi.string().min(3).max(50).required().trim(),
    last_name:joi.string().min(3).max(50).required().trim(),
    username:joi.string().min(3).max(10).required().trim(),
    email:joi.string().pattern(/^[a-zA-Z0-9]{1,50}@(gmail|yahoo)\.com$/).message("Email is not valid; only valid gmail/yahoo emails are supported"),
    password:joi.required(),
    // role:joi.required().valid('admin', 'user').default('user')
    role:joi.valid('admin', 'user').default('user')
});

module.exports = userSchema;