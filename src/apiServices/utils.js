const cancelTokens = new Set();

export const addCancelToken = (token) => {
  cancelTokens.add(token);
};
export const removeCancelToken = (token) => {
  cancelTokens.delete(token);
};

export const emptyCancelTokens = (message = "logout") => {
  cancelTokens.forEach((token) => {
    token?.cancel(message);
  });
};
