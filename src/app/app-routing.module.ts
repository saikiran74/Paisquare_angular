import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './landingpage/login/login.component';
import { RegistrationComponent } from './landingpage/registration/registration.component';
import { HomepageComponent } from './advertiser/Ad/advertisements/homepage.component';
import { AdvertisementformComponent } from './advertiser/Ad/advertisementform/advertisementform.component';
import { LandingcontentComponent } from './landingpage/landingcontent/landingcontent.component';
import { ContactusComponent } from './general/contactus/contactus.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ProfileupdateComponent } from './user/profileupdate/profileupdate.component';
import { AdvertiserreportsComponent } from './advertiser/advertiserreports/advertiserreports.component';
import { UseractivitiesComponent } from './advertiser/useractivities/useractivities.component';
import { AlladvertisementsComponent } from './advertiser/Ad/alladvertisements/alladvertisements.component';
import { AdvertiserdashboardComponent } from './advertiser/advertiserdashboard/advertiserdashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
const routes: Routes = [
  { path: 'profileupdate', component:ProfileupdateComponent},
  { path: 'login', component:LoginComponent },
  { path: 'advertisementform', component:AdvertisementformComponent},
  { path: 'createaccount', component:RegistrationComponent },
  { path: 'alladvertisements', component:AlladvertisementsComponent },
  { path: 'contactus',component:ContactusComponent},
  { path: 'advertisement/:id', component: AlladvertisementsComponent }, 
  { path: 'myadvertisement/:userId', component: AlladvertisementsComponent },
  { path: 'profile/:id', component:ProfileComponent},
  { path: 'block/:id', component:LandingcontentComponent},
  { path: 'reportadvertisement/:id', component:LandingcontentComponent},
  { path: 'save/:id', component:LandingcontentComponent},
  { path: 'advertiserreport', component:AdvertiserreportsComponent},
  { path: 'useractivities', component:UseractivitiesComponent},
  { path: 'advertiserdashboard',component:AdvertiserdashboardComponent},
  { path: 'home',component:NavbarComponent},
  { path: '', component:LandingcontentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
