export const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  if (err.code === 11000) {
    error.message = `Duplicate field value entered`;
    error.statusCode = 400;
  }

  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};
