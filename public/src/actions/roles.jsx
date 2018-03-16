const $ = require('jquery');

const conf = {
  "index" : ".security",
  "doctype_role": "role"
}

export function searchAllRoles(query){
  return (dispatch) => {
    const url = `../api/dashrank/roles?index=${conf["index"]}&type=${conf["doctype_role"]}` ;
    return $.ajax({
       url: url,
       type: "GET"
    })
    .then((response) => {
      const res = JSON.parse(response);
      dispatch({
        type: 'SEARCH_ALL_ROLES',
        roles: res.hits.hits
      });
    }, (error) => {
      dispatch({
         type: 'ERROR_SEARCH_ROLES',
         errormsg: error.responseText
       });
    });
  };
};
