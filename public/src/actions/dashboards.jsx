
const $ = require('jquery');

const conf = {
  "index" : ".kibana",
  "doctype": "dashboard"
}

export function searchAllDashboards(query){
  return (dispatch) => {
    const url = `../api/dashrank/dashboards?index=${conf["index"]}&type=${conf["doctype"]}` ;
    return $.ajax({
       url: url,
       type: "GET"
    })
    .then((response) => {
      const res = JSON.parse(response);
      dispatch({
        type: 'SEARCH_ALL_DASHBOARDS',
        dashboards: res.hits.hits
      });
    }, (error)=>{
      dispatch({
         type: 'ERROR_SEARCH',
         errormsg: error.responseText
       });
    });
  };
};
