import { Component, OnInit } from '@angular/core';
import { PaiService } from '../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { startingLetterPipe } from 'src/app/static/startingLetterPipe.pipe';
import { Comments,Follower,Visited,Like, Block, Report,Favourite, Profile } from '../../paisa';
import { ExponentialStrengthPipe } from 'src/app/static/exponential-strength.pipe';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  users: any[] = [];
  messages: any[] = [];
  currentUserId = 1; // Logged-in user
  selectedUserId: number | null = null;
  messageText: string = '';
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }

  ngOnInit(): void {
    // Fetch user list from API (placeholder for now)
    this.users = [
      { id: 2, name: 'Advertiser 1' },
      { id: 3, name: 'Advertiser 2' },
    ];
  }

  selectUser(user: any): void {
    this.selectedUserId = user.id;
    this._service.getMessages(this.currentUserId, user.id).subscribe((data) => {
      this.messages = data;
    });
  }

  sendMessage(): void {
    if (this.messageText.trim() && this.selectedUserId) {
      const chat = {
        senderId: this.currentUserId,
        receiverId: this.selectedUserId,
        message: this.messageText,
      };

      this._service.sendMessage(chat).subscribe((data) => {
        this.messages.push(data);
        this.messageText = '';
      });
    }
  }
  get selectedUserName(): string {
    const selectedUser = this.users.find((user) => user.id === this.selectedUserId);
    return selectedUser ? selectedUser.name : 'Select a user to chat';
  }
  
  
  
}
