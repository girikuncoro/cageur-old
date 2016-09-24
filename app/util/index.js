module.exports = {
  abort(status, message, stack = null) {
    const err = new Error(message);
    err.status = status;
    /* eslint-disable no-console */
    if (stack && process.env.NODE_ENV === 'dev') console.error(stack);
    /* eslint-enable no-console */
    return err;
  },
};
