# Binance Futures API Trading PWA
Working sample is at https://beatcoin.io
To trade you need to enter API keays at settings. Orders are placed as market. 

![Sample UI](https://github.com/mpuz/BINBUTT/raw/master/beatcoin.io.png =200x)

With only three buttons and couple of settings. Made for easy and fast entering to and exiting from position without mobile Binance app. Uses API keys generated at Binance.com.. Keys are used locally on your device. 

Websocket connection used for BTCUSDT price ticker. In order to work in browser it needs some modification. And you will have to do it after any "npm i" command reinstalling binance-api-node module. Comment the following lines in the node_modules/binance-api-node/dist/open-websocket.js

```
...
var _default = function _default(url) {
  var rws = new _reconnectingWebsocket.default(url, [], {
    //WebSocket: _ws.default,
    connectionTimeout: 4e3,
    debug: false,
    maxReconnectionDelay: 10e3,
    maxRetries: Infinity,
    minReconnectionDelay: 4e3
  });

  var pong = function pong() {
    return rws._ws.pong(function () {
      return null;
    });
  };

  // rws.addEventListener('open', function () {
  //   rws._ws.on('ping', pong);
  // });
  return rws;
```
otherwise websocket connection will not work.


npm build and npm run start will not work, only static version made with "npm run generate" or "nuxt generate" will work

> 

## Development

``` bash
# Install dependencies
yarn add binance-buttons

# Serve with hot-reload at localhost:3000
yarn run dev


# Generate static project
yarn run generate
```
