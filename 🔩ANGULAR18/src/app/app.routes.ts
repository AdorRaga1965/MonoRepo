import { Routes } from '@angular/router';
// import {AppComponent} from './app.component';

export const routes: Routes = [
  // {  path: '', component: AppComponent},

  {  path: 'container',
    loadComponent: ()=> import("../Components/container/container.component").then(m => m.ContainerComponent) },

  { path: '*/*', redirectTo: '' },// Redirect to home component

  {  path: 'home',
    loadComponent: ()=> import("./app.component").then(m => m.AppComponent) },
];
