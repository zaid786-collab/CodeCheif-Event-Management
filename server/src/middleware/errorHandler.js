export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle invalid JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload provided in request body.';
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId or Date format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': ${err.value}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(', ');
  }

  // Handle MongoDB Duplicate Key (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    if (err.keyPattern && err.keyPattern.eventId && err.keyPattern.email) {
      message = 'This email address is already registered for this event.';
    } else if (err.keyPattern && err.keyPattern.email) {
      message = 'Email address already exists in database.';
    } else {
      message = 'A duplicate database record already exists with the provided information.';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
