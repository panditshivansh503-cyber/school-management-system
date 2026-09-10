const errorMiddleware = (error, req, res, next) => {
  console.log(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
};

export default errorMiddleware;