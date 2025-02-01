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
  chatHistoryUsers: any[] = [];
  messages: any[] = [];
  currentUserId = this._service.userId; // Logged-in user
  currentUserName = this._service.userName; // Logged-in user
  selectedUserId!: number;
  userSelected:boolean=false;
  messageText: string = '';
  selectedUserName: string ='';
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }

  ngOnInit(): void {
    this.getChatHistoryUsers();
    this._route.queryParams.subscribe((params) => {
      const advertiserId = +params['userId'];
      const advertiserName = params['name'];
      if (advertiserId && advertiserName) {
        const alreadyExists = this.chatHistoryUsers.some((user) => user.id === advertiserId);
        if (!alreadyExists) {
          this.chatHistoryUsers.push({ id: advertiserId, username: advertiserName });
        }
        this._service.getMessages(this.currentUserId, advertiserId).subscribe((data) => {
          this.messages = data;
        });
      }
    });
  }
  
  getChatHistoryUsers(): void {
    // Fetch chat history users and handle data asynchronously
    this._service.getChatHistoryUsers(this._service.userId).subscribe({
      next: (data) => {
        this.chatHistoryUsers.push(...data); 
      },
      error: (error) => {
        console.error("Error occurred while retrieving chat history:", error);
      },
      complete: () => {
        console.log("Chat history retrieval completed");
      }
    });
    
  }

  selectUser(user: any): void {
    this.selectedUserId = user.id;
    this._service.getMessages(this.currentUserId, this.selectedUserId).subscribe((data) => {
      this.messages = data;
      this.selectedUserName=user.username;
      this.chatHistoryUsers = [];
      this.getChatHistoryUsers()
    });
    this.userSelected=true;
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
  
  initializeChat(advertiserId: number): void {
    const chat = { senderId: this.currentUserId, receiverId: advertiserId, message: '' };
    this._service.initializeChat(chat).subscribe();
  }
  
  closeOpenedChatWindow(){
    console.log("userSelected",this.userSelected)
    this.userSelected=!this.userSelected
    console.log("userSelected",this.userSelected)
  }
}
