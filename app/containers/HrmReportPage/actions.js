/*
 *
 * LoginPage actions
 *
 */

import * as constants from './constants';

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}
