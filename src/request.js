/**
 * BY-Health Official Website
 *
 * Copyright © 2016-2017 By-Health Co Ltd. All rights reserved.
 */
/* eslint-disable class-methods-use-this */

import extend from 'extend';
import { stringify } from 'query-string';

/**
 * Request - A fetch api enhanced.
 */
class Request {

  /**
   * Global configs
   */
  configs = {
    baseUrl: '',
    type: 'form',
    headers: {},
    crossDomain: false,
    middlewares: [],
  };

  /**
   * Create request instance
   *
   * @param {object} configs
   */
  constructor(configs) {
    this.configs = extend(true, {}, this.configs, configs);
  }

  /**
   * Content-Type
   */
  contentType(type) {
    switch (type) {
      case 'form':
        return { 'Content-Type': 'application/x-www-form-urlencoded' };
      case 'json':
        return { 'Content-Type': 'application/json' };
      default:
        return {};
    }
  }

  /**
   * FormData serialize
   */
  serialize(type, payload) {
    if (payload === undefined || payload === null || typeof payload === 'string') {
      return payload;
    }

    switch (type) {
      case 'form':
        return stringify(payload);
      case 'json':
        return JSON.stringify(payload);
      default:
        return payload;
    }
  }

  /**
   * Is http url
   *
   * @param {string} url
   * @returns {boolean}
   */
  isHttp(url) {
    return /^(http(s)?:)?\/\//.test(url);
  }

  /**
   * Send request
   *
   * @param {string} method
   * @param {string} url
   * @param {object} options
   */
  request(method = 'GET', url = '', options = {}) {
    const opts = extend(true, {}, this.configs, options);

    const baseUrl = this.isHttp(url) ? '' : opts.baseUrl;
    const queryString = stringify(opts.params);
    const concatSymbol = url.indexOf('?') > -1 ? '&' : '?';
    const uri = `${baseUrl}${url}${queryString && (concatSymbol + queryString)}`;

    const defered = fetch(uri, {
      method,
      headers: {
        ...opts.headers,
        ...this.contentType(opts.type),
      },
      credentials: opts.crossDomain ? 'include' : 'same-origin',
      mode: opts.crossDomain ? 'cors' : 'same-origin',
      body: this.serialize(opts.type, opts.payload),
    });

    return opts.middlewares.reduce((chain, fn) => fn(chain), defered);
  }

  /**
   * Send GET request
   *
   * @param {string} url
   * @param {object} params
   * @param {object} options
   */
  get(url, params, options) {
    return this.request('GET', url, {
      ...options,
      params,
    });
  }

  /**
   * Send POST request
   *
   * @param {string} url
   * @param {object} payload
   * @param {object} options
   */
  post(url, payload, options) {
    return this.request('POST', url, {
      ...options,
      payload,
    });
  }

  /**
   * Send PUT request
   *
   * @param {string} url
   * @param {object} payload
   * @param {object} options
   */
  put(url, payload, options) {
    return this.request('PUT', url, {
      ...options,
      payload,
    });
  }

  /**
   * Send PATCH request
   *
   * @param {string} url
   * @param {object} payload
   * @param {object} options
   */
  patch(url, payload, options) {
    return this.request('PATCH', url, {
      ...options,
      payload,
    });
  }

  /**
   * Send DELETE request
   *
   * @param {string} url
   * @param {object} options
   */
  delete(url, options) {
    return this.request('DELETE', url, {
      ...options,
    });
  }
}

export default Request;
