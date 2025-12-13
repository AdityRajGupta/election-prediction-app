let token = null;

const AuthStore = {
  setToken(t) {
    token = t;
  },
  clear() {
    token = null;
  },
  getToken() {
    return token;
  },
};

export default AuthStore;
