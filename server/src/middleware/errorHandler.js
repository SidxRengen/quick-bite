export const notFound = (req, res) =>
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.originalUrl} not found` });

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === "ValidationError" ? 400 : 500);
  res
    .status(status)
    .json({
      message: status === 500 ? "Something went wrong" : error.message,
      ...(error.details && { details: error.details }),
    });
};
