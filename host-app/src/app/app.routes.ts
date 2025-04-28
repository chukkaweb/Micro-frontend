import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'cards',
    loadComponent: () =>
      import('../../../cards-app/src/app/app.component').then((m) => {
        console.log('Loaded Remote Component:', m);
        return m.AppComponent;
      }),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../../../products-app/src/app/app.component').then(
        (m) => m.AppComponent
      ),
  },
];

// import { Routes } from '@angular/router';
// // export const routes: Routes = [];
// export const routes: Routes = [
//   {
//     path: 'cards',
//     loadComponent: () =>
//       import('cardsApp/AppComponent').then((m) => {
//         console.log('Cards  Component Loaded:', m);
//         return m.AppComponent;
//       }),
//   },
//   //   {
//   //     path: 'products',
//   //     loadChildren: () =>
//   //       import('../../../products-app/src/app/app.component').then(
//   //         (m) => m.AppComponent
//   //       ),
//   //   },
// ];
