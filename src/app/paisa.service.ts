import { Injectable } from '@angular/core';
import { Advertise, User,Contactus,Comments, Follower, Visited } from './paisa';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable } from 'rxjs';
import {HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaiService {
  userId: any;
  lastName: any;
  firstName: any;
  constructor( private _http : HttpClient) { }

  public loginUserFromRemote(user: User ):Observable<any>{
     return this._http.post<any>("http://localhost:3300/login",user)
  }
  public registerUserFromRemote(user: User ):Observable<any>{
    return this._http.post<any>("http://localhost:3300/registeruser",user)
 }
  public advertiseFromRemote(advertise: Advertise,userid:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/${userid}/advertise`,advertise)
  }
  public ContactusFromRemote(contactus: Contactus):Observable<any>{
    return this._http.post<any>("http://localhost:3300/contactus",contactus)
  }
  public CommentsFromRemote(comments: Comments,advertisementid: Number,userid:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/${userid}/${advertisementid}/comments`,comments)
  }
  public getAllAdvertisements() {
    return this._http.get<any>("http://localhost:3300/advertisements");
  }
  public getAllCommentList(){
    return this._http.get<any>("http://localhost:3300/commentslist");
  }
  public getAllFollowersList(){
    return this._http.get<any>("http://localhost:3300/followerslist");
  }
  public CommentsListFromRemote(advertisementid: Number){
    return this._http.get<any>(`http://localhost:3300/${advertisementid}/commentslist`);
  }
  public FollowerFromRemote(follower:Follower,advertiserid: Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/${advertiserid}/follow`,follower)
  }
  public VisitedFromRemote(visited:Visited,userid:Number,advertiserid: Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/${userid}/${advertiserid}/visit`,visited)
  }
}
