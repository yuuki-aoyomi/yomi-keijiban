const logMiddleware = (req, res, next) => {
    console.log(req.method, req.path);
    next();
}
exports.logMiddleware = logMiddleware;