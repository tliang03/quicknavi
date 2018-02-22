const conf = {
  "index" : "tools.dashboardrank",
  "doctype": "dashboards"
}

const getDateWithFormat = ()=>{
  const currDate = new Date();
  var dd = currDate.getDate();
  var mm = currDate.getMonth()+1;
  var yyyy = currDate.getFullYear();
  if(dd<10) {
    dd='0'+dd;
  }
  if(mm<10) {
    mm='0'+mm;
  }
  return yyyy + '-' + mm + '-' + dd + 'T00:00:00.000Z';
};

const isItemExist = (list, item)=>{
  const id = item.section + '_' + item.dashboard_id;
  const section = item.section;

  if(list[item.section]) {
    const sameItem = list[item.section].filter((dashboard)=>{
      return dashboard.id === id;
    });
    if(sameItem.length) {
      return true;
    }
  }
  return false;
}
export function addDashboard(list, item) {
  if(isItemExist(list, item)){
    return (dispatch) => {
      return Promise.reject('Dashboard exist already. Please select another dashboard')
      .then(()=>{}, (error)=>{
        dispatch({
           type: 'ERROR_ADD',
           errormsg: error
         });
      })
    };
  }

  return (dispatch) => {
    const url = '../api/dashrank/dashboard';
    return $.ajax({
      url: url,
      method: 'POST',
      data: {
        index: conf["index"],
        type: conf["doctype"],
        id: item.section + '_' + item.dashboard_id,
        section: item.section,
        dashboard_id: item.dashboard_id,
        dashboard_title: item.dashboard_title,
        dashboard_description: item.dashboard_description,
        creation_ts: getDateWithFormat()
      }
    })
    .then((response) => {
      const res = JSON.parse(response);
      dispatch({
        type: 'ADD_DASHBOARD',
        dashboard: item,
        id: res.items[0].index._id
      });
    }, (error)=>{
      dispatch({
         type: 'ERROR_ADD',
         errormsg: error.responseText
       });
    });
  };
}

export function deleteDashboard(id, section) {
  return (dispatch) => {
    const url = `../api/dashrank/dashboard?index=${conf["index"]}&type=${conf["doctype"]}&id=${id}`;
    return $.ajax({
        url: url,
        method: 'DELETE',
        headers: {
          "kbn-xsrf": "reporting"
        }
    })
    .then((response) => {
      const res = JSON.parse(response);
      dispatch({
        type: 'DELETE_DASHBOARD',
        id: id,
        section: section
      });
    }, (error)=>{
      dispatch({
         type: 'ERROR_DELETE',
         errormsg: error.responseText
       });
    });
  };
}

export function searchAllList(){
  return (dispatch) => {
    const url = `../api/dashrank/list?index=${conf["index"]}&type=${conf["doctype"]}`;
    return $.ajax({
       url: url,
       type: "GET"
    })
    .then((response) => {
      const res = JSON.parse(response);
      dispatch({
        type: 'SEARCH_ALL_LIST',
        dashboards: res.hits.hits
      });
    }, (error)=>{
        dispatch({
           type: 'ERROR_LIST',
           errormsg: error.responseText
         });
      });
  };
}
