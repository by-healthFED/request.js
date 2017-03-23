/**
 * BY-Health Official Website
 *
 * Copyright © 2016-2017 By-Health Co Ltd. All rights reserved.
 */

import Request from './request';
import * as middlewares from './middlewares';

export { Request, middlewares };
export default new Request({
  middlewares: [middlewares.http],
});
