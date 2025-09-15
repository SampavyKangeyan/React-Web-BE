const User = require("../models/user");
const createUser = async(user, callback) => {
    try {
    const result = await User.create(user);
    callback(null, result);
    } catch (err) {
        callback(err);
    }
};

const findByEmail = async (email, callback) => {
    try {
        const reult = await User.findOne({ where: {email}});
        callback(null, reult);
    } catch (err) {
        callback(err);
    }
};

const updatePassword = async(email, hashedPassword, callback) => {
    try{
        const [updated] = await User.update(
            {password: hashedPassword},
            {where: {email}}
        );
        if (updated) {
            callback(null, {message: "Password updated successfully"});
        } else { 
            callback("User not found");
        }
    } catch (err) {
        callback(err);
    }
};


module.exports = {
    createUser,
    findByEmail,
    updatePassword
};