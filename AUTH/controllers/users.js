import userModel from "../models/users.js";
import sendEmail from "../utils/mail.js";
import bcrypy from "bcrypt";
import jwt from "jsonwebtoken";

let getAllUsers = async (req, res, next) => {
  try {
    let users = await userModel.find();

    if (users.length === 0) {
      return res.status(200).json({
        message: "No Users in DB",
        success: true,
        data: null,
      });
    }
    res.status(200).json({
      message: "All Users in DB",
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

let createUser = async (req, res, next) => {
  try {
    let data = req.body;

    let userExisted = await userModel.findOne({ email: data.email });

    if (userExisted && userExisted.verified) {
      let error = new Error("User already Existed for this Email");
      error.status = 400;
      return next(error);
    }
    let hashPassword = await bcrypy.hash(data.password, 10);
    let OTP = Math.floor(100000 + Math.random() * 900000);
    let ExpDate = Date.now() + 1000 * 60 * 1;
    let newUser;
    console.log(OTP);
    if (userExisted && !userExisted.verified) {
      newUser = userExisted;

      newUser.otp = OTP;
      newUser.otpExpiry = ExpDate;
      newUser.password = hashPassword;
      newUser.name = data.name;
    } else {
      newUser = new userModel({
        ...data,
        password: hashPassword,
        otp: OTP,
        otpExpiry: ExpDate,
      });
    }
    await newUser.save();

    let mailOptions = {
      to: newUser.email,
      subject: "otp verification",
      name: newUser.name,
      otp: newUser.otp,
    };

    sendEmail(mailOptions);

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: { _id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

let verifyOTP = async (req, res, next) => {
  try {
    let { otp, email } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      if (user.otp !== otp) {
        let error = new Error("Invalid otp");
        error.status = 400;
        return next(error);
      } else if (user.otpExpiry < Date.now()) {
        let error = new Error("otp time is expired");
        error.status = 400;
        return next(error);
      } else {
        user.verified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User is Verified SuccessFully",
        });
      }
    } else {
      let error = new Error("User not found");
      error.status = 404;
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

let login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
      let error = new Error("user does not Exists Kindly do Signup");
      error.status = 400;
      return next(error);
    }
    if (!user.verified) {
      let error = new Error("OTP verification in not Complete");
      error.status = 400;
      return next(error);
    }

    let verifyPassword = await bcrypy.compare(password, user.password);

    if (!verifyPassword) {
      let error = new Error("Incorrect Password");
      error.status = 400;
      return next(error);
    }

    let token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWTSECRET,
      {
        expiresIn: 180,
      }
    );

    return res.status(200).json({
      success: true,
      message: "login Successfull",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

let logoutUser = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      let error = new Error("Token not Found");
      error.status = 401;
      return next(error);
    }

    token = token.split(" ")[1];

    req.token = token;

    next(); // blacklistToken middleware
  } catch (error) {
    next(error);
  }
};

export { getAllUsers, createUser, verifyOTP, login, logoutUser };
