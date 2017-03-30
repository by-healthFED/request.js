import fetch from 'isomorphic-fetch';
import { stringify } from 'query-string';
import compose from './compose';
import { isAbsoluteUrl } from './utils';

class Request {

  constructor() {
    this.defaults = {
      baseUrl: '',
      method: 'GET',
      headers: {},
      cache: false,
    };
    this.middlewares = [];
  }

  createContext = (url, options) => {
    const context = Object.create(null);
    context.url = url;
    context.method = options.method;
    context.baseUrl = options.baseUrl;
    context.headers = options.headers;
    context.params = options.params;
    context.body = options.body;
    context.withCredentials = options.withCredentials;
    context.cache = options.cache;
    return context;
  }

  use = (fn) => {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be a functions!');
    }

    this.middlewares.push(fn);
  }

  applyFetch = ({ url, params, ...ctx }) => {
    const baseUrl = isAbsoluteUrl(url) ? '' : ctx.baseUrl;
    const queryString = stringify(params);
    const concatSymbol = url.indexOf('?') > -1 ? '&' : '?';

    return fetch(`${baseUrl}${url}${queryString && (concatSymbol + queryString)}`, {
      method: ctx.method,
      headers: ctx.headers,
      cache: ctx.cache,
      credentials: ctx.withCredentials ? 'include' : 'same-origin',
      mode: ctx.withCredentials ? 'cors' : 'same-origin',
      body: ctx.body,
    });
  }

  fetch = (url, options) => {
    const context = this.createContext(url, options);
    const fn = compose(this.middlewares);

    return fn(context, this.applyFetch);
  }

  head = (url, options) => this.fetch(url, {
    ...options,
    method: 'HEAD',
  })

  options = (url, options) => this.fetch(url, {
    ...options,
    method: 'OPTIONS',
  })

  get = (url, options) => this.fetch(url, {
    ...options,
    method: 'GET',
  })

  post = (url, payload, options) => this.fetch(url, {
    ...options,
    method: 'POST',
    body: payload,
  })

  put = (url, payload, options) => this.fetch(url, {
    ...options,
    method: 'PUT',
    body: payload,
  })

  patch = (url, payload, options) => this.fetch(url, {
    ...options,
    method: 'PATCH',
    body: payload,
  })

  delete = (url, options) => this.fetch(url, {
    ...options,
    method: 'DELETE',
  })
}

export default Request;
