import { Component, OnInit,AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
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
export class ChatComponent implements OnInit, AfterViewChecked  {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  chatHistoryUsers: any[] = [];
  messages: any[] = [];
  searchQuery='';
  filteredUsers: any[] = [];
  currentUserId = this._service.userId; // Logged-in user
  currentUserName = this._service.userName; // Logged-in user
  selectedUserId!: number;
  selectedUserProfileImage: string = '';
  userSelected:boolean=false;
  messageText: string = '';
  selectedUserName: string ='';
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router,private _route: ActivatedRoute) {
       
  }

  ngOnInit(): void {
    this.updateScreenSize();
    this._service.getChatHistoryUsers(this._service.userId).subscribe({
      
      next: (data) => {
        this.chatHistoryUsers.push(...data);
        this.filteredUsers = data;
        // Now check query params AFTER users are loaded
        this._route.queryParams.subscribe((params) => {
          const advertiserId = +params['userId'];
          const advertiserName = params['name'];
          if (advertiserId && advertiserName) {
            const alreadyExists = this.chatHistoryUsers.some(user => user.id === advertiserId);
  
            if (!alreadyExists) {
              this.chatHistoryUsers.push({ id: advertiserId, username: advertiserName });
            }
  
            this.selectedUserId = advertiserId;
            this.selectedUserName = advertiserName;
            this.userSelected = true;
  
            this.getMessages(this.currentUserId, advertiserId)
          }
        });
      },
      error: (error) => {
        console.error("Error occurred while retrieving chat history:", error);
      }
    });
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.warn('Scroll to bottom failed:', err);
    }
  }
  
  
  getChatHistoryUsers(): void {
    console.log("getChatHistoryUsers");
    // Fetch chat history users and handle data asynchronously
    this._service.getChatHistoryUsers(this._service.userId).subscribe({
      next: (data) => {
        this.chatHistoryUsers.push(...data); 
      },
      error: (error) => {
        console.error("Error occurred while retrieving chat history:", error);
      },
      complete: () => {
        console.log("");
      }
    });
    
  }
  getMessages(sender:any,receiver:any): void {
    this._service.getMessages(sender, receiver).subscribe((data) => {
      this.messages = data;
      this.messages.forEach((msg: any) => {
        console.log('Sender:', msg.sender);
        console.log('Receiver:', msg.receiver);
        console.log('Message:', msg.message);
        console.log('Timestamp:', msg.timestamp);
      });
    });
  }
  selectUser(user: any): void {
    this.userSelected=true;
    this.selectedUserProfileImage = user.profileImage;
    this.selectedUserName = user.username;
    this.selectedUserId = user.id;
    this.getMessages(this.currentUserId, this.selectedUserId)
    this.selectedUserName=user.username;
    this.chatHistoryUsers = [];
    this.getChatHistoryUsers()
  }
  sendMessage(): void {
    if (this.messageText.trim() && this.selectedUserId) {
      const chat = {
        sender: this.currentUserId,
        receiver: this.selectedUserId,
        message: this.messageText,
      };
      this._service.sendMessage(chat).subscribe((data) => {
        this.getMessages(this.currentUserId, this.selectedUserId)
      });
    }
    this.messageText=''
  }
  
  initializeChat(advertiserId: number): void {
    const chat = { sender: this.currentUserId, receiver: advertiserId, message: '' };
    this._service.initializeChat(chat).subscribe();
  }
  
  closeOpenedChatWindow(){
    this.userSelected=!this.userSelected
    this.getChatHistoryUsers()
  }

  isLargeScreen: boolean = true;
  updateScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992; // 'lg' breakpoint in PrimeFlex
  }

  filterUsers() {
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.chatHistoryUsers.filter(user =>
      user.username.toLowerCase().includes(query)
    );
  }
  
}
