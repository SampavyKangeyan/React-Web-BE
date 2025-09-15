const userService = require("../services/userService");

const registerUser = (req, res) => {
    const {firstName , lastName, email, gender, password} = req.body;

    if (!firstName || !lastName || !gender || !email || !password ) {
        return res.status(400).json({error: "All fields are required" });
    }

    const userData = {firstName, lastName, email, gender, password};

    userService.registerUser(userData, (err,result) => {
        if (err) {
            return res.status(400).json({error: err});
        }
        res.json(result);
    });
};

module.exports = {registerUser};
