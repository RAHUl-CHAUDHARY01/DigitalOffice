export const setCookie = (res, name, value, options = {}) => {
    res.cookie(name, value, {
      path: '/',
      ...options,
    });
  };
  