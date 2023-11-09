import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './landingpage/login/login.component';
import { RegistrationComponent } from './landingpage/registration/registration.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdvertisementformComponent } from './homepage/advertisementform/advertisementform.component';
import { ContactusComponent } from './contactus/contactus.component';
import { LandingnavbarComponent } from './landingpage/landingnavbar/landingnavbar.component';
import { LandingcontentComponent } from './landingpage/landingcontent/landingcontent.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    FooterComponent,
    LandingpageComponent,
    HomepageComponent,
    NavbarComponent,
    AdvertisementformComponent,
    ContactusComponent,
    LandingnavbarComponent,
    LandingcontentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
