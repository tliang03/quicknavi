import {combineReducers} from "redux";

const _sort = (store)=>{
  const ordered = {};
  Object.keys(store).sort().forEach((key)=>{
    const dashboards = store[key];
    ordered[key] = dashboards.sort((a, b)=>{
      return (a.dashboard_title < b.dashboard_title ? -1 : 1);
    });
  });
  return ordered;
}

const ranklist = (store={}, action) => {
  var storeCopy = Object.assign({
  }, store);
  const dashboard = action.dashboard;
  let sectionKey, id, item, section, arr;
  var newStore = {};
  var link = (window.location.protocol + '//'+ window.location.host + window.location.pathname).replace('quicknavi', 'kibana') + '#/dashboard/';
  switch(action.type) {
    case "ADD_DASHBOARD":
      id = action.id;
      item = Object.assign({}, action.dashboard,
        {
          "id": id,
          "dashboard_link": link + action.dashboard.dashboard_id
      });
      sectionKey = dashboard.section;
      if(storeCopy && storeCopy[sectionKey]){
        storeCopy[sectionKey].push(item);
      } else {
        storeCopy[sectionKey] = [item];
      }
      return _sort(storeCopy);
    case "DELETE_DASHBOARD" :
      id = action.id;
      section = action.section;
      arr = storeCopy[section].filter((dashboard)=>{
        return dashboard.id !== id;
      });
      if(arr.length) {
        storeCopy[section] = arr;
      } else {
        delete storeCopy[section];
      }
      return storeCopy;
    case "SEARCH_ALL_LIST":
      action.dashboards.forEach((dashboard) => {
        let sectionName = dashboard._source.section;
        let id = dashboard._id;
        let obj = Object.assign({}, dashboard._source, {
          dashboard_link: link + dashboard._source.dashboard_id,
          label: dashboard._source.dashboard_title,
          value: dashboard._source.dashboard_id,
          id: id
        });
        if(newStore[sectionName]) {
          newStore[sectionName].push(obj);
        } else {
          newStore[sectionName] = [obj];
        }
      });

      return _sort(newStore);
    default:
      return store || [];
  }
};

export default ranklist;
