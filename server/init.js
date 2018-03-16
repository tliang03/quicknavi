import elasticsearch from "elasticsearch";
import url from 'url';
const readFile = (file) => require('fs').readFileSync(file, 'utf8');

module.exports = (server)=>{
  const es_url = server.config().get('elasticsearch.url');
  const config = server.config();

  const options = {
    url: config.get('elasticsearch.url'),
    username: 'elastic',
    password: 'changeme',
    verifySsl: config.get('elasticsearch.ssl.verificationMode') == 'none' ? false : true,
    clientCrt: config.get('elasticsearch.ssl.certificate'),
    clientKey: config.get('elasticsearch.ssl.key'),
    apiVersion: "5.6",
    pingTimeout: config.get('elasticsearch.pingTimeout'),
    requestTimeout: config.get('elasticsearch.requestTimeout'),
    keepAlive: true,
    auth: true
  };

  const uri = url.parse(options.url);
  let authorization;
  if (options.auth && options.username && options.password) {
    uri.auth = options.username+ ':' + options.password;
  }

  const ssl = { rejectUnauthorized: options.verifySsl };
  if (options.clientCrt && options.clientKey) {
    ssl.cert = readFile(options.clientCrt);
    ssl.key = readFile(options.clientKey);
  }
  if (options.ca) {
    ssl.ca = options.ca.map(readFile);
  }

  const host = {
    host: uri.hostname,
    port: uri.port,
    protocol: uri.protocol,
    path: uri.pathname,
    auth: uri.auth,
    query: uri.query,
    headers: config.get('elasticsearch.customHeaders')
  };

  let client = new elasticsearch.Client({
    host,
    ssl,
    plugins: options.plugins,
    apiVersion: options.apiVersion,
    keepAlive: options.keepAlive,
    pingTimeout: options.pingTimeout,
    requestTimeout: options.requestTimeout
  });

  let getRoles = (user)=> {
    let hasAll = false;
    let roles = user.roles.reduce((curr, role)=>{
      if(role === 'superuser') {
        hasAll = true;
      }
      if(curr !== '') {
        curr += ' OR ';
      }
      return curr + role;
    }, '');

    if(hasAll) {
      roles = '*';
    } else {
      if(roles === '') {
        roles = 'all';
      } else {
        roles += ' OR all'
      }
    };
    return roles;
  }
  //API Get dashbord ranking list
  server.route({
    method: ['GET'],
    path: '/api/dashrank/list',
    handler: (req, res) => {
      const searchFunc = (req, res)=> {
        client.search({
          "index": req.query.index,
          "body": {
            "query": {
              "match_all": {}
            }
          }
        })
        .then((response) => {
          res(JSON.stringify(response));
        }, (error)=>{
          res(error.message).statusCode= 500;
        });
      }
      try {
        if (server.plugins.security && server.plugins.security.getUser) {
          server.plugins.security.getUser(req).then((user) => {
            if(user){
              let roles = getRoles(user);
              client.search({
                "index": req.query.index,
                "body": {
                  "query": {
                    "query_string": {
                      "query": roles
                    }
                  }
                }
              })
              .then((response) => {
                res(JSON.stringify(response));
              }, (error)=>{
                res(error.message).statusCode= 500;
              });
            } else {
              searchFunc(req, res);
            }
          });
        } else {
          searchFunc(req, res);
        }

      } catch (err) {
        res(err.message).statusCode= 500;
      }
    }
  });
  //API Get dashbord ranking sections
  server.route({
    method: ['GET'],
    path: '/api/dashrank/section',
    handler: (req, res) => {
      try {
        let searchSection = (req, res) => {
          client.search({
            "index": req.query.index,
            "body": {
              "size": 0,
              "aggs": {
                "sections": {
                  "terms": {
                    "field": "section",
                    "size": 100000
                  }
                }
              }
            }
          })
          .then((response) => {
            res(JSON.stringify(response));
          }, (error)=>{
            res(error.message).statusCode= 500;
          });
        }
        if (server.plugins.security && server.plugins.security.getUser) {
          server.plugins.security.getUser(req).then((user) => {
            if(user) {
              let roles = getRoles(user);
              client.search({
                "index": req.query.index,
                "body": {
                  "query": {
                    "query_string":{
                      "query":"roles: " + roles
                    }
                  },
                  "size": 0,
                  "aggs": {
                    "sections": {
                      "terms": {
                        "field": "section",
                        "size": 100000
                      }
                    }
                  }
                }
              })
              .then((response) => {
                res(JSON.stringify(response));
              }, (error)=>{
                res(error.message).statusCode= 500;
              });
            } else {
              searchSection(req, res);
            }
          });
        } else {
          searchSection(req, res);
        }
      } catch (err) {
        res(err.message).statusCode= 500;
      }
    }
  });
  //API Get all dashboards
  server.route({
    method: ['GET'],
    path: '/api/dashrank/dashboards',
    handler: (req, res) => {
      try {
        client.search({
          "index": req.query.index,
          "type": req.query.type,
          "body": {
            "query": {
              "match_all": {}
            }
          }
        })
        .then((response) => {
          res(JSON.stringify(response));
        }, (error)=>{
          res(error.message).statusCode= 500;
        });
      } catch (err) {
        res(err.message).statusCode= 500;
      }
    }
  });
  //API Delete dashboard by Id
  server.route({
    method: ['DELETE'],
    path: '/api/dashrank/dashboard',
    handler: (req, res) => {
      try {
        const body = [{
          "delete": {
            "_index": req.query.index,
            "_type": req.query.type,
            "_id": req.query.id
          }
        }]
        client.bulk({
          "body": body
        })
        .then((response) => {
          res(JSON.stringify(response));
        }, (error)=>{
          res(error.message).statusCode= 500;
        });
      } catch (err) {
        res(err.message).statusCode= 500;
      }
    }
  });
  //API Add new dashboard
  server.route({
    method: ['POST'],
    path: '/api/dashrank/dashboard',
    handler: (req, res) => {
      const payload = req.payload;
      try {
        const body = [{
          "index": {
      			"_index": payload.index,
      			"_type": payload.type,
            "_id": payload.id
      		}
        }];
        body.push({
          "section": payload.section,
          "roles": payload.roles,
          "creation_ts": payload.creation_ts,
          "dashboard_id": payload.dashboard_id,
          "dashboard_title": payload.dashboard_title,
          "dashboard_description": payload.dashboard_description
        });
        client.bulk({
          "body": body
        })
        .then((response) => {
          res(JSON.stringify(response));
        }, (error)=>{
          res(error.message).statusCode= 500;
        });
      } catch (err) {
        res(err.message).statusCode= 500;
      }
    }
  });
  //API Get all roles
  server.route({
    method: ['GET'],
    path: '/api/dashrank/roles',
    handler: (req, res) => {
      try {
        if (server.plugins.security && server.plugins.security.getUser) {
          server.plugins.security.getUser(req).then((user)=>{
            let roleBody = {
              hits:{
                hits:user.roles.map((role) => {
                  return {
                    _id: role
                  }
                })
              }
            }
            res(JSON.stringify(roleBody));
          }, (error)=>{
            res(error.message).statusCode= 500;
          })
        } else {
          client.search({
            "index": req.query.index,
            "type": req.query.type,
            "body": {
              "query": {
                "match_all": {}
              }
            }
          })
          .then((response) => {
            res(JSON.stringify(response));
          }, (error)=>{
            res(error.message).statusCode= 500;
          });
        }
      } catch (err) {
        res(err.message).statusCode= 500;
      }
    }
  });
}
