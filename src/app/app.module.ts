import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './landingpage/login/login.component';
import { RegistrationComponent } from './landingpage/registration/registration.component';
import { FooterComponent } from './general/footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContactusComponent } from './general/contactus/contactus.component';
import { LandingnavbarComponent } from './landingpage/landingnavbar/landingnavbar.component';
import { LandingcontentComponent } from './landingpage/landingcontent/landingcontent.component';
import { TermsandConditionsComponent } from './general/termsand-conditions/termsand-conditions.component';
import { PrivacyPolicyComponent } from './general/privacy-policy/privacy-policy.component';
import { AppRoutingModule } from './app-routing.module';
import { PrimengModule } from './static/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { startingLetterPipe } from './static/startingLetterPipe.pipe';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './service/jwt-interceptor.service';
import {SitemapComponent} from './general/sitemap/sitemap.component'
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    FooterComponent,
    ContactusComponent,
    LandingnavbarComponent,
    LandingcontentComponent,
    TermsandConditionsComponent,
    PrivacyPolicyComponent,
    SitemapComponent,
  ],
  imports: [
    BrowserModule, 
    RouterModule.forRoot([]),
    AppRoutingModule,
    BrowserAnimationsModule,
    PrimengModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
