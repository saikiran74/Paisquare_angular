import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProfileupdateComponent } from './profileupdate/profileupdate.component';
const routes: Routes = [
  {
    path:'',
    component:NavbarComponent,
    children:[
      //{ path: 'profile/:id', component: ProfileComponent },
      { path: 'visit/:type/:id', component: ProfileComponent },
      { path: 'profileupdate', component: ProfileupdateComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
