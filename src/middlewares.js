/**
 * BY-Health Official Website
 *
 * Copyright © 2016-2017 By-Health Co Ltd. All rights reserved.
 */

/**
 * Http middleware
 *
 * @export
 * @param {Promise} request
 * @returns {Promise}
 */
export function http(request) {
  return request.then(response => (
    // response.ok may be undefined
    response.status >= 200 && response.status < 300
      ? Promise.resolve(response.text())
      : Promise.reject(response)
  ));
}

/**
 * RESTful middleware
 *
 * @export
 * @param {Promise} request
 * @returns {Promise}
 */
export function restful(request) {
  return request.then(response => response.text()
    .then(responseText => new Promise((resolve, reject) => {
      let resp;
      try {
        resp = JSON.parse(responseText);
      } catch (error) {
        resp = responseText;
      }
      // response.ok may be undefined
      return response.status >= 200 && response.status < 300 ? resolve(resp) : reject(resp);
    },
  )));
}

