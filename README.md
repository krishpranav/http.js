# http.js

## About:
- A Simple & Lightweight http library built using and for node.

# Installation:

## Pre-Requirements:
- latest node version
- macOS/Linux/Windows

## Installing The Library:
- you can install http.js via cli:
```
npm install https://github.com/krishpranav/http.js
```

## Usage:
- basic http request
```js
// import the http js library
const httpjs = require('http.js')

async function getResponse() {
    const res = await httpjs('https://google.com')

    console.log(res)
}

getResponse();
```

- post:
```js
const httpjs = require('http.js')

async function postResponse() {
    await httpjs({
        url: 'https://yourpostresponse.yourdomain',
        method: 'POST',
        data: {
            hey: 'heyyy'
        }
    })
}

postResponse();
```

## License:
- http.js is licensed under [MIT-License]()