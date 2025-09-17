const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userRepository = require("../repository/userRepository");

// Register new user
const registerUser = async (userData, callback) => {
  try {
    userRepository.findByEmail(userData.email, async (err, result) => {
      if (err) {
        console.error("Error in findByEmail:", err);
        return callback(err);
      }
      if (result) return callback("Email already registered"); // Sequelize returns single object or null

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        gender: userData.gender,
        password: hashedPassword,
      };

      // Save user to DB
      userRepository.createUser(user, async (err, newUser) => {
        if (err) {
          console.error("Error in createUser:", err);
          if (err.name === "SequelizeUniqueConstraintError") {
            return callback("Email already exists");
          }
          return callback(err.message || "DB error in user creation");
        }

        try {
          // Create Ethereal test account
          let testAccount = await nodemailer.createTestAccount();

          // Create transporter
          let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });

          // Email options
          let mailOptions = {
            from: '"My App" <no-reply@myapp.com>',
            to: user.email,
            subject: "Registration Successful",
            text: `Hello ${user.firstName},\n\nYour account has been successfully created.\n\nThanks for registering!`,
          };

          // Send mail
          let info = await transporter.sendMail(mailOptions);

          callback(null, {
            message: "User registered successfully. Test email sent.",
            userId: newUser.id,
            previewURL: nodemailer.getTestMessageUrl(info), // Use this URL to view email in browser
          });
        } catch (mailError) {
          console.error("Error sending test email:", mailError);
          callback(null, {
            message: "User registered, but failed to send test email.",
            userId: newUser.id,
          });
        }
      });
    });
  } catch (error) {
    console.error("Unexpected error in registerUser:", error);
    callback(error);
  }
};

module.exports = {
  registerUser,
};
