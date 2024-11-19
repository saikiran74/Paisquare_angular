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
  selectedUserId!: number;
  messageText: string = '';
  selectedUserName: string ='';
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }

  ngOnInit(): void {
    // Initial log for chat history users (empty initially)
    console.log("Before calling getChatHistoryUsers ->", this.chatHistoryUsers);
  
    // Fetch chat history users from the service
    this.getChatHistoryUsers();
  
    // Handle query parameters once the component is initialized
    this._route.queryParams.subscribe((params) => {
      const advertiserId = +params['userId'];
      const advertiserName = params['name'];
      console.log("advertiserId ->", advertiserId, "advertiserName", advertiserName);
  
      if (advertiserId && advertiserName) {
        // Check if the advertiser already exists in the chat history
        const alreadyExists = this.chatHistoryUsers.some((user) => user.id === advertiserId);
        if (!alreadyExists) {
          // Add the new advertiser to the chat history list
          this.chatHistoryUsers.push({ id: advertiserId, username: advertiserName });
          console.log("Updated chatHistoryUsers:", this.chatHistoryUsers);
        }
  
        // Fetch messages between the current user and the selected advertiser
        this._service.getMessages(this.currentUserId, advertiserId).subscribe((data) => {
          this.messages = data;
          console.log("Messages loaded:", this.messages);
        });
      }
    });
    console.log("final getChatHistoryUsers ->", this.chatHistoryUsers);

  }
  
  getChatHistoryUsers(): void {
    // Fetch chat history users and handle data asynchronously
    this._service.getChatHistoryUsers(this._service.userId).subscribe({
      next: (data) => {
        this.chatHistoryUsers.push(...data); 
        console.log("Fetched chatHistoryUsers:", this.chatHistoryUsers);
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
    console.log("currentUserId-->"+this.currentUserId," selectedUserId", this.selectedUserId)
    this._service.getMessages(this.currentUserId, this.selectedUserId).subscribe((data) => {
      this.messages = data;
      console.log("this.messages",this.messages)
      this.selectedUserName=user.username;
      this.chatHistoryUsers = [];
      this.getChatHistoryUsers()
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
  
  initializeChat(advertiserId: number): void {
    const chat = { senderId: this.currentUserId, receiverId: advertiserId, message: '' };
    this._service.initializeChat(chat).subscribe();
  }
  
  
}
