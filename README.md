# Test Manager

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Test manager backend contains the definitions and the workflow executor for the test cases.

### Installation

Test Manager requires
  - [Node.js](https://medium.com/@kkostov/how-to-install-node-and-npm-on-macos-using-homebrew-708e2c3877bd) v4+.
  - [MongoDb](https://medium.com/@himeshvats19/up-running-with-mongodb-in-7-simple-steps-using-brew-on-macos-sierra-785730a7e6b0)
  - [Redis Server](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298 )

Steps :-
```
$ git clone https://gitlab.com/91ranjan/test-manager-backend.git
$ cd test-manager-backend
$ npm install | yarn install
```

### Run server
On one tab:-
```
$ redis-server
```

On the other one
```
$ npm run start | yarn start
```

For frontend installation [read this](https://gitlab.com/91ranjan/test-manager-ui).

License
----

MIT


**Free Software, Hell Yeah!**