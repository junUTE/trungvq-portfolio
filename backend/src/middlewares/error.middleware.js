export function notFoundHandler(_request, response) {
  response.status(404).json({
    message: "Route not found."
  });
}

export function errorHandler(error, _request, response, _next) {
  console.error(error);

  response.status(500).json({
    message: "Internal server error."
  });
}
