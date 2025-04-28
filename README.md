## Project setup
Overview of Micro-Frontend Setup

Create a Host Application: The main app that loads the micro-frontends.
Create Remote Applications: The child apps (micro-frontends) that are dynamically loaded into the host app.
Use Module Federation Plugin: To share modules and components between the host and remote apps.

Step 1 install the required things node , angular or reactjs. 
Step 2: Create the Host Application
ng new host-app --routing --style scss
Cd host-app
ng add @angular-architects/module-federation --project host-app --port 4200

Step 3: Create a Remote Applications ( i think we need create separate and configure in host app properly ) 
same above steps but project name create 

Step 4: Connect Remote to Host
Update Host's webpack.config.js: Add the remote app in the remotes section:
remotes: {
  remoteApp: "remoteApp@http://localhost:4201/remoteEntry.js",
},

Load Remote Components in the Host App: Use Angular's dynamic module loading in the host app.

Host app-routing.module.ts:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'remote',
    loadChildren: () =>
      import('remoteApp/Component').then((m) => m.AppComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

If a standalone component .
 we don't have ​​Host app-routing.module.ts:file  we have app.routes.ts and app.config.ts so separate need to create 

1. Why the app.config.ts File Instead of app.routing.ts?
In Angular 18, the standalone routing API uses provideRouter to define routes directly in app.config.ts instead of using RouterModule with a module.

Traditional Routing (app.routing.module.ts):
Uses RouterModule inside an NgModule.
Standalone Routing (app.config.ts):
Uses the provideRouter function in a configuration file (app.config.ts).

4. Why Does This Happen?
Angular 18 Changes:
With app.config.ts, Angular now uses standalone routing APIs, which might feel unfamiliar compared to older versions.
Incorrect Module Federation Setup:
If paths in webpack.config.js are incorrect, the host app cannot find the remote module.
Remote App Issues:
If the remoteEntry.js file or exposed component isn’t correctly configured, the host will fail to load the remote.



Step 5: Share Modules Between Host and Remote
Share Common Modules: In both webpack.config.js files, ensure common Angular modules like @angular/core and @angular/router are shared:

shared: {
  "@angular/core": { singleton: true, strictVersion: true },
  "@angular/common": { singleton: true, strictVersion: true },
  "@angular/router": { singleton: true, strictVersion: true },
},
Run the Host App:
ng serve --port 4200
Test the Micro-Frontend: Open http://localhost:4200/remote to see the remote component loaded into the host app.

Step 7: Optimize and Deploy
Optimize Builds:
Use production builds:
bash
Copy code
ng build --configuration production
Deploy:

Deploy the host app and remote apps to a web server or CDN, ensuring the remoteEntry.js URLs are accessible by the host app.




# Example 2

## Configure the remote app paths in the host app step-by-step

 1. Verify Remote App Configuration

### Step 1.1: Check `webpack.config.js` in Remote App
In your remote app, ensure the `ModuleFederationPlugin` exposes the required components/modules and specifies the `remoteEntry.js` file.

Example (`remote-app/webpack.config.js`):

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "remoteApp",
    publicPath: "http://localhost:4201/", // Replace with the actual URL or port
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "remoteApp",
      filename: "remoteEntry.js", // This file will be served from the remote app
      exposes: {
        './Component': './src/app/remote/remote.component.ts', // Exposing this component
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
      },
    }),
  ],
};


### Step 1.2: Run the Remote App
Start the remote app to serve the `remoteEntry.js` file.

bash
ng serve --port 4201


- Confirm the `remoteEntry.js` is accessible at `http://localhost:4201/remoteEntry.js` by opening the URL in a browser.

---

 2. Configure Remote Path in Host App

Step 2.1: Update Host App `webpack.config.js`
In the host app, configure the `remotes` property to point to the `remoteEntry.js` file of the remote app.

Example (`host-app/webpack.config.js`):

const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "hostApp",
    publicPath: "http://localhost:4200/",
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hostApp",
      remotes: {
        remoteApp: "remoteApp@http://localhost:4201/remoteEntry.js", // Map to remote app
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
      },
    }),
  ],
};


### Step 2.2: Dynamically Load Remote Components
Use Angular's lazy loading in the `app.config.ts` file to load components/modules from the remote app.

Example (`host-app/src/app/app.config.ts`):

import { provideRouter, Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'remote',
    loadChildren: () =>
      import('remoteApp/Component').then((m) => m.RemoteComponent),
  },
];

export const appConfig = [
  provideRouter(routes),
];


---

 3. Run Both Applications

1. Start the Remote App:
   bash
   cd remote-app
   ng serve --port 4201
   

2. Start the Host App:
   bash
   cd host-app
   ng serve --port 4200
   

3. Access the Host App:
   Open the host app at `http://localhost:4200/remote`.

---

 ### 4. Real-Time Considerations for Remote Paths

Case 1: Remote Apps Deployed to Different Servers
If the remote apps are deployed on different servers or CDNs, replace `http://localhost:4201/remoteEntry.js` with the actual URL of the remote app.

Example:

remotes: {
  remoteApp: "remoteApp@https://your-remote-app-domain.com/remoteEntry.js",
},


Case 2: Multiple Remote Apps
If you have multiple remote apps, you can add them to the `remotes` property.

Example:

remotes: {
  remoteApp1: "remoteApp1@http://localhost:4201/remoteEntry.js",
  remoteApp2: "remoteApp2@http://localhost:4202/remoteEntry.js",
},


Case 3: Dynamic Remote Paths
For dynamic environments (e.g., dev, staging, prod), you can configure the paths dynamically using environment variables.

Example:

remotes: {
  remoteApp: `remoteApp@${process.env.REMOTE_APP_URL || 'http://localhost:4201'}/remoteEntry.js`,
},


 ### 5. Debugging Tips

1. Check Console Errors:
   - If the host app cannot find the remote module, verify:
     - `remoteEntry.js` URL in the browser.
     - The `remotes` configuration in `webpack.config.js`.

2. Verify Exposed Components:
   - Ensure the exposed component/module path in the remote app is correct.

3. Test Static Imports:
   - Temporarily test importing the remote component directly in the host app:
     
     import('remoteApp/Component').then((m) => {
       console.log('Remote Component Loaded:', m);
     });
     

---

###  Summary

1. Ensure the `remoteEntry.js` file in the remote app is accessible.
2. Configure the `remotes` property in the host app's `webpack.config.js` to point to the remote app.
3. Use Angular's lazy loading (`loadChildren`) to dynamically load components from the remote app.
4. Run both applications and verify the integration.

This setup ensures a seamless connection between the host app and separate remote apps in a micro-frontend architecture.
