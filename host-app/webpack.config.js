const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "hostApp", // Host app name
    publicPath: "http://localhost:4200/", // Host app's public path
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes: {
        cardsApp: "cardsApp@http://localhost:1200/remoteEntry.js",
        productsApp: "productsApp@http://localhost:2200/remoteEntry.js",
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
      },
    }),
  ],
};

// const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
// const mf = require("@angular-architects/module-federation/webpack");
// const path = require("path");
// const share = mf.share;

// const sharedMappings = new mf.SharedMappings();
// sharedMappings.register(path.join(__dirname, "tsconfig.json"), [
//   /* mapped paths to share */
// ]);

// module.exports = {
//   output: {
//     uniqueName: "hostApp",
//     publicPath: "http://localhost:4200/",
//     // publicPath: "auto",
//   },
//   optimization: {
//     runtimeChunk: false,
//   },
//   resolve: {
//     alias: {
//       ...sharedMappings.getAliases(),
//     },
//   },
//   experiments: {
//     outputModule: true,
//   },
//   plugins: [
//     new ModuleFederationPlugin({
//       library: { type: "module" },

//       // For remotes (please adjust)
//       // name: "hostApp",
//       // filename: "remoteEntry.js",
//       // exposes: {
//       //     './Component': './/src/app/app.component.ts',
//       // },

//       // For hosts (please adjust)
//       remotes: {
//         cardsApp: "cardsApp@http://localhost:1200/remoteEntry.js",
//         productsApp: "productsApp@http://localhost:2200/remoteEntry.js",
//       },

//       shared: share({
//         "@angular/core": {
//           singleton: true,
//           strictVersion: true,
//           requiredVersion: "auto",
//         },
//         "@angular/common": {
//           singleton: true,
//           strictVersion: true,
//           requiredVersion: "auto",
//         },
//         "@angular/common/http": {
//           singleton: true,
//           strictVersion: true,
//           requiredVersion: "auto",
//         },
//         "@angular/router": {
//           singleton: true,
//           strictVersion: true,
//           requiredVersion: "auto",
//         },
//         ...sharedMappings.getDescriptors(),
//       }),
//     }),
//     sharedMappings.getPlugin(),
//   ],
// };
