import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingcontentComponent } from './landingpage/landingcontent/landingcontent.component';
import { LoginComponent } from './landingpage/login/login.component';
import { RegistrationComponent } from './landingpage/registration/registration.component';
import { TermsandConditionsComponent } from './general/termsand-conditions/termsand-conditions.component';
import { PrivacyPolicyComponent } from './general/privacy-policy/privacy-policy.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContactusComponent } from './general/contactus/contactus.component';
import { AboutUSComponent } from './general/about-us/about-us.component';
import { ProfileComponent } from './settings/profile/profile.component';

const routes: Routes = [
  {
    path: 'advertiser',
    loadChildren: () => import('./advertiser/advertiser.module').then(m => m.AdvertiserModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    
  },
  { 
    path:'general',
    component:NavbarComponent,
    children:[
      { path:'termsandconditions',component: TermsandConditionsComponent},
      { path:'privacyandpolicy',component:PrivacyPolicyComponent},
      { path:'contactUs',component:ContactusComponent},
      { path:'aboutUs',component:AboutUSComponent},
      { path: 'profile/:id', component: ProfileComponent},
    ]
  },
  {
    path:'visit',
    component:NavbarComponent,
    children:[
      { path: 'profile/:id', component: ProfileComponent},
    ]
  },
  { path:'termsandconditions',component: TermsandConditionsComponent},
  { path:'privacyandpolicy',component:PrivacyPolicyComponent},
  { path: 'login', component: LoginComponent },
  { path: 'createaccount', component: RegistrationComponent },
  { path: '', component: LandingcontentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
