import jwt from "jsonwebtoken";

let verifyJWT = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      let error = new Error("Jwt token not found");
      error.status = 401;
      return next(error);
    }
    token = token.split(" ")[1];

    jwt.verify(token, process.env.JWTSECRET, (err, decodedToken) => {
      if (err) {
        return next(err);
      }

      req.body.id = decodedToken.id;
      req.body.role = decodedToken.role;

      next();
    });
  } catch (error) {
    return next(error);
  }
};

export { verifyJWT };
