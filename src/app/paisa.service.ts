import { Injectable } from '@angular/core';
import { Advertise, User,Contactus,Comments, Follower, Visited, Like, Profile,Favourite, Block, Report } from './paisa';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable } from 'rxjs';
import {HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaiService {
  userId: any;
  userName: any;
  constructor( private _http : HttpClient) { }

  public loginUserFromRemote(user: User ):Observable<any>{
     return this._http.post<any>("http://localhost:3300/login",user)
  }
  //OTP call
  /*
  public verifyOTPCallFromRemote(email: string, otp: string):Observable<any>{
    return this._http.post<any>("http://localhost:3300/verifyOTP",{ email, otp })
 }*/
  public verifyOTPCallFromRemote(user: User): Observable<any> {
    return this._http.post<any>("http://localhost:3300/verifyOTP", user);
}
  public registerUserFromRemote(user: User ):Observable<any>{
    return this._http.post<any>("http://localhost:3300/registeruser",user)
 }
  public advertiseFromRemote(advertise: Advertise,userid:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/advertise/${userid}`,advertise)
  }
  public ContactusFromRemote(contactus: Contactus):Observable<any>{
    return this._http.post<any>("http://localhost:3300/contactus",contactus)
  }
  public CommentsFromRemote(comments: Comments,advertisementid: Number,userid:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/comments/${userid}/${advertisementid}`,comments)
  }
  public getAllAdvertisements() {
    return this._http.get<any>(`http://localhost:3300/advertisements`);
  }
  public getAllCommentList(){
    return this._http.get<any>("http://localhost:3300/commentslist");
  }
  public CommentsListFromRemote(advertisementid: Number){
    return this._http.get<any>(`http://localhost:3300/commentslist/${advertisementid}`);
  }
  public FollowerFromRemote(follower:Follower,advertiserid: Number,userId:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/follow/${userId}/${advertiserid}`,follower)
  }
  public VisitedFromRemote(visited:Visited,userid:Number,advertiserid: Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/visit/${userid}/${advertiserid}`,visited)
  }
  public LikeFromRemote(like:Like,userid:Number,advertisementid:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/like/${userid}/${advertisementid}`,like)
  }
  //Updating profiles
  public getProfileList(userId:Number) {
    return this._http.get<any>(`http://localhost:3300/profile/${userId}`);
  }
  public getUserdata(userId:Number){
    return this._http.get<any>(`http://localhost:3300/userdata/${userId}`);
  }
  public ProfileSocialMediaUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/updateProfile/socialMediaLinks/${userId}`,profile)
  }
  public ProfileBrandRecommendationUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/updateProfile/BrandRecommendation/${userId}`,profile)
  }
  public ProfilepasswordUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/updateProfile/password/${userId}`,profile)
  }
  public ProfilepersonalInformationUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/updateProfile/personalInformation/${userId}`,profile)
  }
  public ProfilebrandInformationUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`http://localhost:3300/updateProfile/brandInformation/${userId}`,profile)
  }
  //-----------------------
  public getIDAdvertisements(advertisementid:Number){
    return this._http.get<any>(`http://localhost:3300/idadvertisements/${advertisementid}`);
  }
  public getUserAdvertisements(userId:Number){
    return this._http.get<any>(`http://localhost:3300/useradvertisements/${userId}`);
  }
  public getUserFollowingProfiles(userId:number){
    return this._http.get<any>(`http://localhost:3300/UserFollowingProfiles/${userId}`);
  }
  public getUserBlockedProfiles(userId:number){
    return this._http.get<any>(`http://localhost:3300/UserBlockedProfiles/${userId}`);
  }
  public postBlockAdvertiser(block:Block,userid:Number,advertiserId:Number){
    return this._http.post<any>(`http://localhost:3300/blockadvertiser/${userid}/${advertiserId}`,block);
  }
  public postReportadvertisement(report:Report){
    return this._http.post<any>(`http://localhost:3300/reportadvertisement`,report);
  }
  public postfavouriteAdvertisement(favourite:Favourite,userid:Number,advertisementid:Number){
    return this._http.post<any>(`http://localhost:3300/addAdvetisementToFavourite/${userid}/${advertisementid}`,favourite);
  }
  //Data for graphs
  public getVisitorGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`http://localhost:3300/visitorgraph/${userId}/${reportperiod}`);
  }
  public getFollowersGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`http://localhost:3300/followersgraph/${userId}/${reportperiod}`);
  }
  public getLikeGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`http://localhost:3300/likesgraph/${userId}/${reportperiod}`);
  }
  public getFavouriteGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`http://localhost:3300/favouritegraph/${userId}/${reportperiod}`);
  }
  //------------------For userdashboard----------------
  public getFavouriteAdvertisements(){
    return this._http.get<any>(`http://localhost:3300/getfavouriteadvertisementslist/${this.userId}`);
  }
  public getLikedAdvertisements(){
    return this._http.get<any>(`http://localhost:3300/getlikedadvertisementslist/${this.userId}`);
  }
  public getFollowingAdvertisements(){
    return this._http.get<any>(`http://localhost:3300/getfollowingadvertisementslist/${this.userId}`);
  }
  public getBlockedAdvertisements(){
    return this._http.get<any>(`http://localhost:3300/getUserBlockedAdvertisementsList/${this.userId}`);
  }
  public getVisitedAdvertisements(){
    return this._http.get<any>(`http://localhost:3300/getvisitedadvertisementslist/${this.userId}`);
  }


  public getAdvertisementTransactionData(){
    return this._http.get<any>(`http://localhost:3300/getadvertisementtransactiondata/${this.userId}`);
  }

  //Search functionally
  public getGlobalSearchresult(query:string){
    return this._http.get<any>(`http://localhost:3300/search?query=${query}`);
  }
  public getHashTags(){
    return this._http.get<any>(`http://localhost:3300/getHashTags`);
  }
  public getHashTagsAdvertisement(query:string){
    return this._http.get<any>(`http://localhost:3300/getHashTagsAdvertisement/${query}`);
  }
  public getPincodesAdvertisement(query:string){
    return this._http.get<any>(`http://localhost:3300/getpincodesadvertisement/${query}`);
  }
  
}

