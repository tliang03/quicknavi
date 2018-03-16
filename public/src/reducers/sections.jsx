const _sort = (store)=>{
  return store.sort((a, b) => {
    return ( a >= b ) ? 1: -1;
  })
}

const sections = (store=[], action) => {
  let newStore = [];
  if (action.type === "SEARCH_ALL_SECTIONS") {
    action.sections.forEach((section) => {
      newStore.push(section.key)
    });

    return _sort(newStore);
  }

  return store || [];
};

export default sections;
