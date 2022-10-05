const mongoose = require('mongoose');
const bcrypt = require('bcrypt');




const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    sex: String,
    country: String,
    birthdate: Date,
    hobby: Array


})

userSchema.pre(
    'save',
    async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
);
userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
    }

module.exports = mongoose.model('User', userSchema);
