import axios from "axios";

const HTTP = axios.create({
  baseURL: process.env.VUE_APP_URL
});
let interceptor;

const applyInterceptors = instance => {
  const errorResponseHandler = error => {
    if (error?.response?.status === 401) {
      logout(instance);
      return Promise.reject("alert.defaultError");
    }
    const data = ((error.response || {}).data || {}).Error;
    let errorMsg = "";

    if (typeof data === "string") {
      errorMsg = data;
    } else if (typeof data?.Error !== "undefined") {
      errorMsg = data.Error;
    } else {
      errorMsg = (data?.error || [])[0] || instance.$t("alert.defaultError");
    }
    return Promise.reject(errorMsg);
  };

  HTTP.interceptors.request.use(
    config => {
      config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD";
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers.Allow = "GET, POST, PUT, DELETE, OPTIONS, HEAD";
      config.crossDomain = true;
      config.headers["YouCheckin-Hotel-Slug"] = localStorage.getItem("settings.slug");
      config.headers["YouCheckin-Trace-Id"] = localStorage.getItem("settings.traceId");
      return config;
    },
    error => Promise.reject(error)
  );
  interceptor = HTTP.interceptors.response.use(response => response, errorResponseHandler);
};

const removeInterceptor = () => {
  HTTP.interceptors.response.eject(interceptor);
};

const setToken = (instance, token) => {
  clearToken(instance);
  instance.$http.defaults.headers.common = {
    Authorization: `Bearer ${token}`
  };
};

const clearToken = instance => {
  delete instance.$http.defaults.headers.common.Authorization;
};

const logout = instance => {
  clearToken(instance);
  instance.$store.dispatch("LOGOUT");
  instance.$router.push({
    name: "Login"
  });
};

export { HTTP, applyInterceptors, removeInterceptor, setToken, clearToken };
