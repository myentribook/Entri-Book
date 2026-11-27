module.exports = func => (req, res, next) => {
    if (typeof func !== 'function') {
        return next(new TypeError('Expected a function in async error handler'));
    }

    try {
        return Promise.resolve(func(req, res, next)).catch(next);
    } catch (error) {
        return next(error);
    }
};