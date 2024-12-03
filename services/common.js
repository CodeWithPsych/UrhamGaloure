import passport from "passport";

export function isAuth(req, res, done) {
  return passport.authenticate("jwt");
}

export function sanitizeUser(user) {
  const result = { id: user.id, role: user.role };
  return result;
}

export function cookiesExtracter(req, res) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
}
