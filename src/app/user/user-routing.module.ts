import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { UseractivitiesComponent } from './useractivities/useractivities.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { ProfileComponent } from '../settings/profile/profile.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path:'',
    component:NavbarComponent,
    children:[
      { path: 'useractivities', component: UseractivitiesComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'userdashboard',component:UserdashboardComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
