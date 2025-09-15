// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// const userRepository = require("../repository/userRepository");

// const JWT_SECRET = "supersecretkey";

// const registerUser = async (userData, callback) => {
//     try {
//         userRepository.findByEmail(userData.email, async (err, results) => {
//             if (err) {
//                 console.error('Error in findByEmail:', err);
//                 return callback(err);
//             }
//             if (results) return callback("Email already registered");

//             const hashedPassword = await bcrypt.hash(userData.password, 10);
        
//             const user = {
//                 firstName: userData.firstName,
//                 lastName: userData.lastName,
//                 email: userData.email,
//                 gender: userData.gender,
//                 password: hashedPassword,
//                 // confirmPassword: hashedPassword   
//             };

//             userRepository.createUser(user, (err, result) => {
//                 if (err) {
//                     console.error('Error in createUser:', err);
//                     return callback(err);
//                 }

//                 let transporter = nodemailer.createTransport({
//                     service: "gmail",
//                     auth: {
//                     user: "youremail@gmail.com",
//                     pass: "your-16-char-app-password"
//                     }
//                 });

//                 let mailOptions ={ 
//                     from: "youremail@gmail.com",
//                     to: user.email,
//                     subject: "Registration successful... Welcome to our app",
//                     text: `Hello ${user.firstName}, \n\nYour account has been successfully created. \n\nThanks for registering!`
//                 };

//                 transporter.sendMail(mailOptions, (error) => {
//                     if (error) {
//                         console.error('Error sending email:', error);
//                         // Don't crash, just log and continue
//                         return callback(null, { 
//                             message: "User registered, but failed to send welcome email.",
//                             userId: result.insertId,
//                             emailError: error.message
//                         });
//                     }

//                     callback(null, { 
//                         message:"User registered successfully. Welcome email sent.",
//                         userId: result.insertId
//                     });
//                 });
//             });
//         });
//     }  catch (error) {
//         console.error('Unexpected error in registerUser:', error);
//         callback(error);
//     }
// };



// module.exports ={
//     registerUser,
// }


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
          return callback(err);
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
