const error = (store=null, action) => {
  switch (action.type) {
    case "ERROR_SEARCH":
    case "ERROR_ADD":
    case "ERROR_DELETE":
    case "ERROR_LIST":
      return action.errormsg || null;
    default:
      return null;
  }
}

export default error;
