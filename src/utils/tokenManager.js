/**
 * tokenManager.js
 * -----------------------------------------------------------------------------
 * DEPRECATED in favour of `utils/auth/tokenStorage.js`. Kept as a thin alias so
 * existing imports keep working. Please update new code to:
 *
 *   import { tokenStorage } from '../utils/auth/tokenStorage';
 * -----------------------------------------------------------------------------
 */

import { tokenStorage } from './auth/tokenStorage';

const tokenManager = {
  setToken: (token) => tokenStorage.setToken(token),
  getToken: () => tokenStorage.getToken(),
  removeToken: () => tokenStorage.clear({ broadcast: true }),
};

export default tokenManager;
