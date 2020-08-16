export default function (fn: () => any, timeout: number) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      try {
        throw new Error(`Function timed out after ${timeout}ms`);
      } catch (e) {
        reject(e);
      }
    }, timeout);

    let runnable;
    try {
      runnable = fn();
    } catch (e) {
      clearTimeout(timer);
      reject(e);
    }

    if (runnable instanceof Promise) {
      runnable
        .then((value) => {
          resolve(value);
        })
        .catch((e) => {
          reject(e);
        })
        .finally(() => {
          clearTimeout(timer);
        });
    } else {
      clearTimeout(timer);
      resolve(runnable);
    }
  });
}
