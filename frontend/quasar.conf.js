/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
/* eslint func-names: 0 */
/* eslint global-require: 0 */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { configure } = require("quasar/wrappers");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = configure((ctx) => ({
  // https://quasar.dev/quasar-cli/supporting-ts
  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: "./src/**/*.{ts,tsx,js,jsx,vue}",
      },
    },
  },

  // app boot file (/src/boot)
  // https://quasar.dev/quasar-cli/boot-files
  boot: ["sentry", "i18n", "axios", "routeGuards", "capacitor"],

  // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
  css: ["app.scss"],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    "mdi-v5",
    "roboto-font", // optional, you are not bound to it
  ],

  // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
  build: {
    vueRouterMode: "history",
    env: {
      // When running with capacitor this value is used for the base URL for all API requests
      apiBaseUrl: process.env.API_BASE_URL,
    },

    showProgress: true,
    sourceMap: true,
    minify: true,
    transpile: true,

    // https://quasar.dev/quasar-cli/handling-webpack
    extendWebpack(cfg) {
      cfg.module.rules.push({
        test: /\.(afphoto)$/,
        use: "null-loader",
      });
      cfg.module.rules.push({
        test: /(LICENSE)$/,
        use: "null-loader",
      });

      cfg.resolve.alias = {
        ...cfg.resolve.alias,
        "@components": path.resolve(__dirname, "src/components/"),
        "@icons": path.resolve(__dirname, "src/icons/"),
        "@store": path.resolve(__dirname, "src/store/"),
        "@mixins": path.resolve(__dirname, "src/mixins/"),
        "@assets": path.resolve(__dirname, "src/assets/"),
      };

      cfg.resolve.fallback = {
        fs: false,
        child_process: false,
      };
    },
    chainWebpack(chain) {
      chain
        .plugin("eslint-webpack-plugin")
        .use(ESLintPlugin, [{ extensions: ["js", "ts", "vue"] }]);

      const nodePolyfillWebpackPlugin = require("node-polyfill-webpack-plugin");
      chain.plugin("node-polyfill").use(nodePolyfillWebpackPlugin);

      chain.module
        .rule("i18n-resource")
        .test(/\.(json5?|ya?ml)$/)
        .include.add(path.resolve(__dirname, "./src/i18n"))
        .end()
        .type("javascript/auto")
        .use("i18n-resource")
        .loader("@intlify/vue-i18n-loader");

      chain.module
        .rule("i18n")
        .resourceQuery(/blockType=i18n/)
        .type("javascript/auto")
        .use("i18n")
        .loader("@intlify/vue-i18n-loader");
    },
  },

  // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
  devServer: {
    https: false,
    port: 8080,
    open: true, // opens browser window automatically
    proxy: {
      // proxy requests when running dev server
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: false,
      },
      "/admin": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/static": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },

  // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
  framework: {
    lang: "en-US", // Quasar language pack
    config: {
      dark: "auto", // or Boolean true/false
      loadingBar: { color: "accent", skipHijack: ctx.mode.capacitor },
    },
    iconSet: "mdi-v5", // Quasar icon set

    // Quasar plugins
    plugins: ["Dialog", "LoadingBar", "Cookies"],
  },

  // animations: 'all', // --- includes all animations
  // https://quasar.dev/options/animations
  animations: ["fadeIn", "fadeOut"],

  // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
  ssr: {
    pwa: false,
  },

  // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
  pwa: {
    workboxPluginMode: "GenerateSW", // 'GenerateSW' or 'InjectManifest'
    workboxOptions: {}, // only for GenerateSW
    manifest: {
      name: "MemberMatters",
      short_name: "MemberMatters",
      description: "The MemberMatters frontend",
      display: "standalone",
      orientation: "portrait",
      background_color: "#ffffff",
      theme_color: "#7642FF",
      icons: [
        {
          src: "icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png",
        },
        {
          src: "icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
        {
          src: "icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },

  // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
  cordova: {
    // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
  },

  // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
  capacitor: {
    hideSplashscreen: false,
    iosStatusBarPadding: true,
  },

  // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
  electron: {
    bundler: "packager", // 'packager' or 'builder'

    packager: {
      // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
    },

    builder: {
      // https://www.electron.build/configuration/configuration
      appId: "membermatters",
    },

    // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
    nodeIntegration: true,

    extendWebpack(/* cfg */) {
      // do something with Electron main process Webpack cfg
      // chainWebpack also available besides this extendWebpack
    },
  },
}));
