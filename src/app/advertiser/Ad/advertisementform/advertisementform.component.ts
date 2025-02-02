import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { PaiService } from '../../../paisa.service';
import { ValidationErrors,Validator,FormGroup,FormControl, Validators,ValidatorFn, AbstractControl } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { Router } from '@angular/router';
import { Advertise } from '../../../paisa';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-advertisementform',
  templateUrl: './advertisementform.component.html',
  styleUrls: ['./advertisementform.component.css']
})
export class AdvertisementformComponent implements OnInit{
  adId: string | null = null;
  constructor(private _service: PaiService, private _router: Router,private route: ActivatedRoute,private cdr: ChangeDetectorRef){};
  isEditAdvertisement:boolean=false;
  urlTypes = [
    { name: 'Web URL', value: 'web', icon: 'pi pi-globe' },
    { name: 'WhatsApp', value: 'whatsapp', icon: 'pi pi-whatsapp' }
  ];
  selectedUrlType = this.urlTypes[0].value;
  isMobileView:boolean=false;
  ngOnInit(): void {
    this.isMobileView=this._service.isMobileView;
    this.hashtags = []; // Set initial value
    this.cdr.detectChanges();
    this.adId = this.route.snapshot.paramMap.get('id');
    if (this.adId) {
      this.isEditAdvertisement=true;
      this.loadAdDetails(this.adId);
    }
    
    this._service.getUserdata(this._service.userId).subscribe(
      data=>{
        this.paisa=data.paisa
        this.pai=data.pai
      },
      error=>{
        console.log("error occured while retreiving the user data!")
      }
    );
  }
  advertise= new Advertise();
  hashtags: string[] = [];  // Assume these are arrays
  pincodes: string[] = []; 
  paiChecked: boolean = false;
  freeTypeChecked: boolean = false;
  paisaChecked: boolean = false;
  editorConfig = {
    // Configuration options
  };
  adBackground: string = 'background1';
  background1:string = 'linear-gradient(to bottom, #00ADFF, #B2579B)';
  background2:string = 'linear-gradient(to bottom, #4444E9, #30B4F2)';
  background3:string = 'linear-gradient(to bottom, #30B4F2, #035493)';
  background4:string = 'linear-gradient(to bottom, #5ABFEF, #8FB4F7)';
  backgroundMap: { [key: string]: string } = {
    background1: this.background1,
    background2: this.background2,
    background3: this.background3,
    background4: this.background4,
  };
  adBackgroundSelected:string=this.background1;
  
  onImageSelect(val: string) {
      this.adBackground = val;
      this.adBackgroundSelected=this.backgroundMap[val] || '';
  }
  message=''
  public editorData: string = '';
  
  hashTagSeparatorExp: RegExp = /,| /;
  onEditorChange(event: any) {
    this.editorData = event;
  }
  paisa=''
  pai=''
  
  paiCheckbox(){
    this.paiChecked=!this.paiChecked
    if(!this.paiChecked){
      this.paiChecked = true;
      this.advertise.advertisement_type="pai";
    }
    else
      this.paiChecked = false;
      this.advertise.pai=0;
      this.advertise.paiperclick=0;
  }
  paisaCheckbox(){
    this.paisaChecked=!this.paisaChecked
    if(!this.paisaChecked){
      this.paisaChecked = true;
      this.advertise.advertisement_type="paisa";
    }
    else
      this.paisaChecked = false;
      this.advertise.paisa=0;
      this.advertise.paisaperclick=0;
  }
  freeTypeCheckbox(){
    this.freeTypeChecked=!this.freeTypeChecked
    if(!this.freeTypeChecked){
      this.freeTypeChecked = true;
      this.advertise.advertisement_type="free";
    }
    else
      this.freeTypeChecked = false;
  }
  onUrlTypeChange(event: any) {
    this.selectedUrlType = event.value;
    this.advertise.url=''
  }
  advertisementForm(){
    if(this.selectedUrlType=='whatsapp' && !this.advertise.url.startsWith("https://wa.me/")){
      this.advertise.url="https://wa.me/"+this.advertise.url
    }
    this.message=''
    this.advertise.backGroundColor = this.adBackgroundSelected;
    this.advertise.status='Active';
    if(this.advertise.brandname==null || this.advertise.brandname==''){
      this.message="Please enter Brandname"
    } else if(this.advertise.brandname.length>50) {
      this.message="Please enter brand name less than 50 Characters"
    }
    else if(this.advertise.description==null || this.advertise.description==''){
      this.message="Please enter brand description"
    } else if(this.advertise.description.length>1000) {
      this.message = "Please enter description less than 1000 Characters";
    }
    else if(this.advertise.url==null || this.advertise.url==''){
      this.message="Please enter brand Website url"
    }
    else if(!this.advertise.url.startsWith('https://') ){
      this.message="Please enter valid url starts with https://.."
    } else if (this.selectedUrlType=="whatsapp" && !this.mobileNumberValidator(this.advertise.url)){
      this.message="Please check whatsapp number"
    }
    else if(!(this.paiChecked || this.paisaChecked) && !this.isEditAdvertisement && !this.freeTypeChecked){
      this.message="Please select advertisement type";
    } else if(this.pinCodeValidator(this.pincodes)){
      this.message="Enter 6 digit pin codes only"
    }
    else if(!this.isEditAdvertisement && ((this.paiChecked && this.validPai()) || (this.paisaChecked && this.validPaisa()))){
      //Correcting
    } else if (!this.advertise.backGroundColor) {
      this.message = "Please select a background color";
      return;
    } 
    else{
      this.advertise.hashtags = this.hashtags.join(', ');
      this.advertise.pincodes = this.pincodes.join(', '); 
      this._service.advertiseFromRemote(this.advertise,this._service.userId).subscribe(
        data=>{
          this._router.navigate(['advertiser'])
      },
        error=>{
        this.message="Invalid details";
      });
    }
  }
  validPai():Boolean{
    if(this.advertise.pai==null && this.advertise.pai == undefined){
      this.message="Please enter total pai's to advertise your brand"
      return true;
    }
    else if(this.advertise.paiperclick==null && this.advertise.paisa == undefined){
      this.message="Please enter Pai's which you want to give per click"
      return true;
    }
    else if(this.advertise.pai.valueOf()<=this.advertise.paiperclick.valueOf()){
      this.message="Please enter total Pai's greater than Pai's per click"
      return true;
    }
    else if(this.advertise.pai.valueOf()<300){
      this.message="Please enter more than 299 Pai's to advertise"
      return true;
    }
    else if(this.advertise.pai.valueOf()>+this.pai){
      this.message="Insufficient pai's to advertise, Please do check balance pai's"
      return true;
    }
    else if(this.advertise.paiperclick.valueOf()<5){
      this.message="Please enter more than 4 Pai's per click to advertise"
      return true;
    }
    else {
      return false;
    }
  }
  validPaisa():Boolean{
    if(this.advertise.paisa==null && this.advertise.paisa == undefined){
      this.message="Please enter total amount to advertise your brand"
      return true;
    }
    else if(this.advertise.paisaperclick==null && this.advertise.paisaperclick == undefined){
      this.message="Please enter amount which you want to give per click"
      return true;
    }
    else if(this.advertise.pai.valueOf()<=+this.paisa){
      this.message="Insufficient money to advertise, Please do check money"
      return true;
    }
    else if(this.advertise.paisa.valueOf()<=this.advertise.paisaperclick.valueOf()){
      this.message="Please enter total amount greater than amount per click"
      return true;
    }
    else {
      return false;
    }
  }
  showPreviewAd:boolean=false;
  showPreviewAdMethodErrorMethod:string='';
  showPreviewAdMethod(){ 
    if(this.advertise.brandname===''){
      this.showPreviewAdMethodErrorMethod="Enter BrandName to preview Ad";
    } else if(this.advertise.description==''){
      this.showPreviewAdMethodErrorMethod="Enter description to preview Ad";
    } else{
      this.showPreviewAd=true;

    }
  }

  closePreviewAdMethod(){
    this.showPreviewAd=false;
  }

  
  locationEnabled: boolean = false;
  onLocationToggle(event: any) {
    this.locationEnabled = event.checked;
  }
  pinCodeValidator(pincodes:string[]) {
      const invalidPinCodes = pincodes.filter(pin => !/^\d{6}$/.test(pin.trim()));
      const invalidPinCodesList=invalidPinCodes.join(', ');
      if(invalidPinCodesList.length>0){
        return true;
      }
      else{
        return false;
      }
  }
  loadAdDetails(adId: string) {
    this._service.getIDAdvertisements(+adId).subscribe(
      data => {
        this.advertise = data;
        this.hashtags = this.advertise.hashtags && this.advertise.hashtags.trim() 
          ? this.advertise.hashtags.split(',').map(pincode => pincode.trim()).filter(pincode => pincode) 
          : [];
        this.pincodes = this.advertise.pincodes && this.advertise.pincodes.trim() 
          ? this.advertise.pincodes.split(',').map(pincode => pincode.trim()).filter(pincode => pincode) 
          : [];
        if (this.advertise.url) {
          if (this.advertise.url.startsWith("https://wa.me/")) {
            this.advertise.url = this.advertise.url.replace("https://wa.me/", "");
            this.selectedUrlType = "whatsapp";
          } else {
            this.selectedUrlType = "web";
          }
        }
        if (this.advertise.gender) {
          this.advertise.gender = this.advertise.gender; // Preselect gender
        }
      },
        error=>{console.log("error occure while retrieving the data for ID -",adId)
    });
  }
  mobileNumberValidator(number:any) {
      const isValid = /^\d{10}$/.test(number.replace('https://wa.me/', ''));
      return isValid;
  }
  onAddChip(event: any): void {
    if (this.hashtags.length > 5) {
        this.hashtags.pop(); // Prevent adding more than 5 items
        alert('You can only add up to 5 hashtags.');
    }
    this.cdr.detectChanges();

  }
  removeChip(index: number): void {
    this.hashtags.splice(index, 1);
  }
}
