import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { PrimengModule } from '../static/primeng.module';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { startingLetterPipe } from '../static/startingLetterPipe.pipe';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    UserdashboardComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    PrimengModule,
  ]
})
export class UserModule { }
