// type = CallbackMethod = (...args, Function) -> Void

// promisify :: (CallbackMethod, Object | Nil) -> (...args) -> Promise Any Error
const promisify = (fn, context) => (...args) =>
  new Promise((resolve, reject) => {
    fn.call(context, ...args.slice(0, fn.length - 1), (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

module.exports = promisify;
