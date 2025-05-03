let ErrorHandler = (error, req, res, next) => {
  return res.status(error.status || 500).json({
    message: error.message,
    status: error.status,
    success: false,
  });
};

export default ErrorHandler;
