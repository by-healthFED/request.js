
/**
 * Compose `middleware`
 * @param {Array} middlewares
 * @returns {Function}
 */
function compose(middlewares) {
  if (!Array.isArray(middlewares)) {
    throw new TypeError('Middlewares must be an array!');
  }
  if (middlewares.some(fn => typeof fn !== 'function')) {
    throw new TypeError('Middleware must be a functions!');
  }

  return function dispatch(context, done) {
    const stack = [...middlewares, done];
    let index = -1;

    function next(i) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;

      if (i >= stack.length) {
        return Promise.resolve();
      }

      const fn = stack[i];
      try {
        return Promise.resolve(fn(context, () => next(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return next(0);
  };
}

export default compose;
