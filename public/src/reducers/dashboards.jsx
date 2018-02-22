const dashboards = (store=[], action) => {
  if (action.type === "SEARCH_ALL_DASHBOARDS") {
    var link = (window.location.protocol + '//'+ window.location.host + window.location.pathname).replace('quicknavi', 'kibana') + '#/dashboard/'
    var mappedDashboards = action.dashboards.map((dashboard)=>{
      return Object.assign({}, dashboard, {
        label: dashboard._source.title,
        value: dashboard._id,
        dashboard_id: dashboard._id,
        dashboard_title: dashboard._source.title,
        dashboard_description: dashboard._source.description,
        dashboard_link: link + dashboard._id
      })
    })
    return mappedDashboards
  }

  return store || [];
};

export default dashboards;
