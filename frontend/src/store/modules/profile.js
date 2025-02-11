import dayjs from "dayjs";
import idleTimeout from "idle-timeout";
import { Platform } from "quasar";
import { api } from "src/boot/axios";
// import Vue from "vue";

const getDefaultState = () => ({
  loggedIn: false,
  profile: {},
  doorAccess: [],
  interlockAccess: [],
  siteSignedIn: false,
});

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    loggedIn: (state) => state.loggedIn,
    profile: (state) => state.profile,
    doorAccess: (state) => state.doorAccess,
    interlockAccess: (state) => state.interlockAccess,
    siteSignedIn: (state) => state.siteSignedIn,
  },
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    setLoggedIn(state, payload) {
      // If we're on electron, logged in, and not in dev then enable auto logout after 20s
      if (
        Platform.is.electron &&
        payload === true &&
        process.env.NODE_ENV !== "Development"
      ) {
        window.IDLETIMEOUT = idleTimeout(
          () => {
            this.$router.push({ name: "logout" });
          },
          {
            element: document,
            timeout: 1000 * 20,
            loop: false,
          }
        );
      }
      state.loggedIn = payload;
    },
    setProfile(state, payload) {
      state.profile = payload;
    },
    setDoorAccess(state, payload) {
      state.doorAccess = payload;
    },
    setInterlockAccess(state, payload) {
      state.interlockAccess = payload;
    },
    setSiteSignedIn(state, payload) {
      state.siteSignedIn = payload;
    },
  },
  actions: {
    getAccess({ commit }) {
      return new Promise((resolve) => {
        api.get("/api/access/permissions/").then((response) => {
          commit("setDoorAccess", response.data.doors);
          commit("setInterlockAccess", response.data.interlocks);
          resolve();
        });
      });
    },
    getProfile({ commit }) {
      return new Promise((resolve) => {
        api.get("/api/profile/").then((response) => {
          response.data.firstJoined = dayjs(response.data.firstJoined).format(
            "D MMMM YYYY"
          );
          commit("setProfile", response.data);
          commit("setLoggedIn", true);
          resolve();
        });
      });
    },
    getLoggedIn({ commit }) {
      return new Promise((resolve) => {
        api
          .get("/api/loggedin/")
          .then(() => {
            commit("setLoggedIn", true);
            resolve();
          })
          .catch(() => {
            commit("setLoggedIn", false);
            resolve();
          });
      });
    },
    getSiteSignedIn({ commit }) {
      return new Promise((resolve) => {
        api
          .get("/api/sitesessions/check/")
          .then((response) => {
            commit("setSiteSignedIn", response.data);
            resolve();
          })
          .catch(() => {
            resolve();
          });
      });
    },
  },
};
