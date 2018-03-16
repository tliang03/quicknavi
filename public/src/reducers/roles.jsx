const _sort = (store)=>{
  return store.sort((a, b) => {
    return ( a >= b ) ? 1: -1;
  })
}

const roles = (store=[], action) => {
  let newStore = [];
  if (action.type === "SEARCH_ALL_ROLES") {
    action.roles.forEach((role) => {
      newStore.push({
        value: role._id,
        label: role._id
      });
    });
    newStore.push({
      value: 'all',
      label: 'all'
    });
    return _sort(newStore);
  }

  return store || [];
};

export default roles;
