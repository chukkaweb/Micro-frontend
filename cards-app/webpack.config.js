const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "cardsApp", // Remote app name
    publicPath: "http://localhost:1200/", // Remote app's public path
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "cardsApp", // Name of the remote app
      filename: "remoteEntry.js", // Entry file for the remote app
      exposes: {
        "./AppComponent": "./src/app/app.component.ts", // Exposing AppComponent
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
//     uniqueName: "cardsApp",
//     publicPath: "http://localhost:1200/",
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
//       name: "cardsApp",
//       filename: "remoteEntry.js",
//       exposes: {
//         "./AppComponent": "./src/app/app.component.ts", // Path to the exposed component
//       },

//       // For hosts (please adjust)
//       // remotes: {
//       //     "mfe1": "http://localhost:3000/remoteEntry.js",

//       // },

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
