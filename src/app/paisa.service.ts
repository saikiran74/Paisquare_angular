import { Injectable,HostListener } from '@angular/core';
import { Advertise, User,Contactus,Comments, Follower, Visited, Like, Profile,Favourite, Block, Report } from './paisa';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { Observable } from 'rxjs';
import {HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaiService {
  userId: any;
  userName: any;
  constructor( private _http : HttpClient) { }
  private apiUrl = environment.apiUrl;
  
  isMobileView:boolean=false;
  @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.checkViewport();
    }
    checkViewport() {
      this.isMobileView = window.innerWidth <= 768;
      console.log("this.isMobileView",this.isMobileView)
    }
  public loginUserFromRemote(user: User ):Observable<any>{
    console.log("this.apiUrl",this.apiUrl);
     return this._http.post<any>(`${this.apiUrl}/login`,user)
  }
  //OTP call
  /*
  public verifyOTPCallFromRemote(email: string, otp: string):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/verifyOTP`,{ email, otp })
 }*/
  public verifyOTPCallFromRemote(user: User): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/verifyOTP`, user);
}
  public registerUserFromRemote(user: User ):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/registeruser`,user)
 }
  public advertiseFromRemote(advertise: Advertise,userid:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/advertise/${userid}`,advertise)
  }
  public ContactusFromRemote(contactus: Contactus):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/contactus`,contactus)
  }
  public CommentsFromRemote(comments: Comments,advertisementid: Number,userid:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/comments/${userid}/${advertisementid}`,comments)
  }
  public getAllAdvertisements() {
    return this._http.get<any>(`${this.apiUrl}/advertisements`);
  }
  public getAllCommentList(){
    return this._http.get<any>(`${this.apiUrl}/commentslist`);
  }
  public getlikeFromRemote(){
    return this._http.get<any>(`${this.apiUrl}/likelist/${this.userId}`);
  }
  public getVisitedFromRemote(){
    return this._http.get<any>(`${this.apiUrl}/vistlist/${this.userId}`);
  }
  public CommentsListFromRemote(advertisementid: Number){
    return this._http.get<any>(`${this.apiUrl}/commentslist/${advertisementid}`);
  }
  public FollowerFromRemote(follower:Follower,advertiserid: Number,userId:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/follow/${userId}/${advertiserid}`,follower)
  }
  public saveRatingFromRemote(rating:any,advertiserid:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/rating/${this.userId}/${advertiserid}`,rating)
  }
  public VisitedFromRemote(visited:Visited,userid:Number,advertiserid: Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/visit/${userid}/${advertiserid}`,visited)
  }
  public LikeFromRemote(like:Like,userid:Number,advertisementid:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/like/${userid}/${advertisementid}`,like)
  }
  //Updating profiles
  public getProfileList(userId:Number) {
    return this._http.get<any>(`${this.apiUrl}/profile/${userId}`);
  }
  public getUserdata(userId:Number){
    return this._http.get<any>(`${this.apiUrl}/userdata/${userId}`);
  }
  public ProfileSocialMediaUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/updateProfile/socialMediaLinks/${userId}`,profile)
  }
  public ProfileBrandRecommendationUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/updateProfile/BrandRecommendation/${userId}`,profile)
  }
  public ProfilepasswordUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/updateProfile/password/${userId}`,profile)
  }
  public ProfilepersonalInformationUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/updateProfile/personalInformation/${userId}`,profile)
  }
  public ProfilebrandInformationUpdate(profile:Profile,userId:Number):Observable<any>{
    return this._http.post<any>(`${this.apiUrl}/updateProfile/brandInformation/${userId}`,profile)
  }
  public uploadProfileImage(formData: FormData): Observable<string> {
    return this._http.post<string>(
      `${this.apiUrl}/updateProfile/upload-image/${this.userId}`,
      formData,
      { responseType: 'text' as 'json' } // Specify that the response is plain text
    );
  }
  
  public getProfileImage(): Observable<Blob> {
    return this._http.get<ArrayBuffer>(`${this.apiUrl}/updateProfile/profile-image/${this.userId}`, {
      responseType: 'arraybuffer' as 'json' // Ensure you receive it as an ArrayBuffer
    }).pipe(
      map((response: ArrayBuffer) => {
        // Convert the ArrayBuffer to a Blob
        return new Blob([response], { type: 'image/png' }); // Adjust the MIME type accordingly
      })
    );
  }
  public fetchAndProcessProfileImage(userId: string): Observable<string> {
    return this._http.get<ArrayBuffer>(
      `${this.apiUrl}/updateProfile/profile-image/${this.userId}`, 
      {
        responseType: 'arraybuffer' as 'json', // Explicitly fetch as ArrayBuffer
      }
    ).pipe(
      map((response: ArrayBuffer) => {
        // Convert ArrayBuffer to Blob
        const blob = new Blob([response], { type: 'image/png' }); // Adjust MIME type
        return URL.createObjectURL(blob); // Return Object URL
      }),
      catchError((error) => {
        console.error(`Error fetching profile image:`, error);
        throw error; // Re-throw the error for the component to handle
      })
    );
  }
  
  
  
  //-----------------------
  public getIDAdvertisements(advertisementid:number){
    return this._http.get<any>(`${this.apiUrl}/idadvertisements/${advertisementid}`);
  }
  public getUserAdvertisements(userId:number){
    return this._http.get<any>(`${this.apiUrl}/useradvertisements/${userId}`);
  }
  public getUserFollowingProfiles(userId:number){
    return this._http.get<any>(`${this.apiUrl}/UserFollowingProfiles/${userId}`);
  }
  public getUserBlockedProfiles(userId:number){
    return this._http.get<any>(`${this.apiUrl}/UserBlockedProfiles/${userId}`);
  }
  public postBlockAdvertiser(block:Block,userid:Number,advertiserId:Number){
    return this._http.post<any>(`${this.apiUrl}/blockadvertiser/${userid}/${advertiserId}`,block);
  }
  public postReportadvertisement(report:Report){
    return this._http.post<any>(`${this.apiUrl}/reportadvertisement`,report);
  }
  public postfavouriteAdvertisement(favourite:Favourite,userid:Number,advertisementid:Number){
    return this._http.post<any>(`${this.apiUrl}/addAdvetisementToFavourite/${userid}/${advertisementid}`,favourite);
  }
  //Data for graphs
  public getVisitorGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`${this.apiUrl}/visitorgraph/${userId}/${reportperiod}`);
  }
  public getFollowersGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`${this.apiUrl}/followersgraph/${userId}/${reportperiod}`);
  }
  public getLikeGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`${this.apiUrl}/likesgraph/${userId}/${reportperiod}`);
  }
  public getFavouriteGraphFromRemote(userId:Number,reportperiod:String){
    return this._http.get<any>(`${this.apiUrl}/favouritegraph/${userId}/${reportperiod}`);
  }
  //------------------For userdashboard----------------
  public getFavouriteAdvertisements(){
    return this._http.get<any>(`${this.apiUrl}/getfavouriteadvertisementslist/${this.userId}`);
  }
  public getLikedAdvertisements(){
    return this._http.get<any>(`${this.apiUrl}/getlikedadvertisementslist/${this.userId}`);
  }
  public getFollowingAdvertisements(){
    return this._http.get<any>(`${this.apiUrl}/getfollowingadvertisementslist/${this.userId}`);
  }
  public getBlockedAdvertisements(){
    return this._http.get<any>(`${this.apiUrl}/getUserBlockedAdvertisementsList/${this.userId}`);
  }
  public getVisitedAdvertisements(){
    return this._http.get<any>(`${this.apiUrl}/getvisitedadvertisementslist/${this.userId}`);
  }


  public getAdvertisementTransactionData(){
    return this._http.get<any>(`${this.apiUrl}/getadvertisementtransactiondata/${this.userId}`);
  }

  //Search functionally
  public getGlobalSearchresult(query:string){
    return this._http.get<any>(`${this.apiUrl}/search?query=${query}`);
  }
  public getHashTags(){
    return this._http.get<any>(`${this.apiUrl}/getHashTags`);
  }
  public getHashTagsAdvertisement(query:string){
    return this._http.get<any>(`${this.apiUrl}/getHashTagsAdvertisement/${query}`);
  }
  public getPincodesAdvertisement(query:string){
    return this._http.get<any>(`${this.apiUrl}/getpincodesadvertisement/${query}`);
  }

  /* Chat */
  sendMessage(chat: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/chat/send`, chat);
  }

  getMessages(senderId: number, receiverId: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/chat/getmessages/${senderId}/${receiverId}`);
  }

  getChatHistoryUsers(userId: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/chat/getchathistoryusers/${userId}`);
  }
  initializeChat(chat: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/chat/initialize-chat`, chat);
  }

  sellCoins(coins: number, price: number) {
    const payload = {
      coins,
      price,
    };
    return this._http.post(`${this.apiUrl}/sell-coins`, payload);
  }
  addFunds(userId: number, amount: number): Observable<any> {
    const url = `/api/addFunds`; // Replace with your backend API endpoint
    return this._http.post(url, { userId, amount });
  }

  // Withdraw Funds method
  withdrawFunds(userId: number, amount: number): Observable<any> {
    const url = `/api/withdrawFunds`; // Replace with your backend API endpoint
    return this._http.post(url, { userId, amount });
  }
}

