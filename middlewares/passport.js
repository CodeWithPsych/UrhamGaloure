import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { cookiesExtracter, sanitizeUser } from "../services/common.js";
import User from "../models/userModel.js";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const jwtOptions = {
  jwtFromRequest: cookiesExtracter,
  secretOrKey: SECRET_KEY,
};

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Invalid credentials" });

      const hashedPassword = crypto.pbkdf2Sync(
        password,
        user.salt,
        310000,
        32,
        "sha256"
      );
      if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
        return done(null, false, { message: "Invalid credentials" });
      }

      const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
      return done(null, { id: user.id, role: user.role, token });

  
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        const sanitizedUser = sanitizeUser(user);
        const result = done(null, sanitizedUser);
        return result;
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passport;
