export default ({dispatch}) => (next) => (action) => {
  const { promise, types, ...rest } = action;
  if (!promise) {
    return next(action);
  }

  const [REQUEST, SUCCESS, FAILURE] = types;
  dispatch({...rest, type: REQUEST});

  return promise.then(
    (result) => dispatch({...rest, ...result, type: SUCCESS}),
    (error) => dispatch({...rest, error, type: FAILURE})
  );
};
