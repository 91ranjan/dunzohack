import config from "./config";
import App from "./src/App";

const port = 3001;
const elasticsearch = require("elasticsearch");
const express = require("express");
const app = express();

export const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

// ping the client to be sure Elasticsearch is up
/*client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    // at this point, eastic search is down, please check your Elasticsearch service
    if (error) {
      console.error("elasticsearch cluster is down!");
    } else {
      console.log("Everything is ok");
      client.indices
        .exists({
          index: "store-name"
        })
        .then(exists => {
          if (!exists) { // If indices do not exist, create it
            client.indices.create(
              {
                index: "store-name",
                body: {
                  mappings: {
                    words: {
                      properties: {
                        store_name: { type: "text" },
                        product_name: { type: "text" }
                      }
                    }
                  }
                }
              },
              function(error, response, status) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("created a new index", response);
                }
              }
            );
          }
        });
    }
  }
);*/

// add a data to the index that has already been created
/*client.index({
    index: 'store-name',
    id: '1',
    type: 'Reciepts',
    body: {
        "mobile": "09986720241",
        "store_name": "Nobel Super Bazaar",
        "product_name": "Tomato",
    }
}, function(err, resp, status) {
    console.log(resp);
});*/

(async function() {
  await App._init();
  App.express.listen(config.server_port, err => {
    if (err) {
      return console.log(err);
    }

    return console.log(`App server is listening on ${port}`);
  });
})();
