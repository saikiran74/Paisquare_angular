import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './landingpage/login/login.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { RegistrationComponent } from './landingpage/registration/registration.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdvertisementformComponent } from './homepage/advertisementform/advertisementform.component';
import { LandingcontentComponent } from './landingpage/landingcontent/landingcontent.component';

const routes: Routes = [
  { path: 'login', component:LoginComponent },
  { path: 'advertisementform', component:AdvertisementformComponent},
  { path: 'createaccount', component:RegistrationComponent },
  { path: 'homepage', component:HomepageComponent },
  { path: '', component:LandingcontentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
