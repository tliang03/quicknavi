const groups = (store=[], action) => {
  if (action.type === "SEARCH_ALL_GROUPS") {
    var storeCopy = Object.assign([], store);
    return storeCopy;
  }

  return store || [];
};

export default groups;
