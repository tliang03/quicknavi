import elasticsearch from "elasticsearch";
import url from 'url';
const readFile = (file) => require('fs').readFileSync(file, 'utf8');

module.exports = (server)=>{
  const es_url = server.config().get('elasticsearch.url');
  const config = server.config();
  const options = {
    url: config.get('elasticsearch.url'),
    username: config.get('elasticsearch.username'),
    password: config.get('elasticsearch.password'),
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
  //API Get dashbord ranking list
  server.route({
    method: ['GET'],
    path: '/api/dashrank/list',
    handler: (req, res) => {
      try {
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
}
