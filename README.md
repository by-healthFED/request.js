# Request.js - A fetch api enhanced.


## Usages

```
import request from 'request';

request
  .get('/api/user', { id: 1 })
  .then(rs => {
    console.log(rs);
  })
  .catch(err => {
    console.log(err);
  });
```

## APIs

`request.get(url, [params], [options])`

`request.post(url, [payload], [options])`

`request.put(url, [payload], [options])`

`request.patch(url, [payload], [options])`

`request.delete(url, [options])`

`options`: 
  - baseUrl: 'http://www.exmaple.com/api/'
  - type: 'form' || 'json'
  - headers: {}
  - crossDomain: true || false 
  - middlewares: []

## Middleware

```
import request, { Request, middlewares } from 'request';

function json(request) {
  return request.then(response => response.text()
    .then(responseText => new Promise((resolve, reject) => {
      let resp;
      try {
        resp = JSON.parse(responseText);
      } catch (error) {
        return reject(resp);
      }
      
      return resp.status === '0' ? resolve(resp) : reject(resp);
    },
  )));
}

// apply global request
request.configs.middlewares.push((json));
// apply current request
request.get('api/user', {}, {
  middlewares: [json]
});
// apply new instalce
const restful = new Request({
  middlewares: [
    middlewares.http,
    json,
  ],
  crossDomain,
})
```

## MIT License

Copyright (c) 2016-2017 By-Health Co Ltd. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
