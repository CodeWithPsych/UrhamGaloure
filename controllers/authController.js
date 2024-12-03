import User from "../models/userModel.js";
import crypto from "crypto";
import { sanitizeUser } from "../services/common.js";
import jwt from "jsonwebtoken";
import { mailer } from "../middlewares/mailer.js";

const SECRET_KEY = "SECRET_KEY";

export const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);

    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: "Password hashing failed" });
        }

        try {
          const user = new User({
            ...req.body,
            password: hashedPassword,
            salt,
          });
          const newUser = await user.save();

          req.login(sanitizeUser(newUser), (err) => {
            if (err) {
              return res
                .status(400)
                .json({ error: "Login failed", details: err });
            } else {
              const token = jwt.sign(sanitizeUser(newUser), SECRET_KEY);
              res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              });
              return res
                .status(200)
                .json({ id: newUser.id, role: newUser.role });
            }
          });
        } catch (saveErr) {
          return res
            .status(400)
            .json({ error: "User creation failed", details: saveErr });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ error: "An error occurred", details: err });
  }
};

// LoginUser Serialize
export const LoginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    // .cookie('jwt', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
    .status(201)
    .json({ token: user.token });
};

// CheckUser Deserialize
export const CheckUser = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

// Reset Password Request
export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();
    const resetPageLink = `http://localhost:5173/reset-password-request?token=${token}&email=${email}`;
    const subject = "Reset Password for E-commerce";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to reset your password.</p>`;
    const response = await mailer({ to: email, subject, html });
    res.status(200).json({ message: "Reset link sent", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email, resetPasswordToken: token });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();
        const subject = "password successfully reset for e-commerce";
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await mailer({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
};

// logout
export const logout = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};
