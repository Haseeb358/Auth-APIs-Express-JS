let blacklistToken = async (req, res, next) => {
  try {
    let token = req.token;

    const redisClient = req.app.locals.redisClient;

    await redisClient.setEx(`tokens:${token}`, 180, "Blacklisted");

    return res.status(200).json({
      success: true,
      message: "Logout Success Fully",
    });
  } catch (error) {
    next(error);
  }
};

let checkBlacklitedTokens = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      let error = new Error("Token not Found");
      error.status = 401;
      return next(error);
    }

    token = token.split(" ")[1];

    let redisClient = req.app.locals.redisClient;
    let isBlacklisted = await redisClient.get(`tokens:${token}`);

    if (isBlacklisted) {
      let error = new Error("Token is blacklisted. Please log in again.");
      error.status = 401;
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export { blacklistToken, checkBlacklitedTokens };
