export function notFoundHandler(_request, response) {
  response.status(404).json({
    message: "Route not found."
  });
}

export function errorHandler(error, _request, response, _next) {
  console.error(error);

  const statusCode =
    Number(error?.statusCode) ||
    Number(error?.status) ||
    (error?.message === "CORS origin is not allowed." ? 403 : 500);

  response.status(statusCode).json({
    message: statusCode >= 500 ? "Internal server error." : error?.message || "Request failed."
  });
}
