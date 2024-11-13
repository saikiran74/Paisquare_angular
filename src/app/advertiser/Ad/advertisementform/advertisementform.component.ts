import { Component, OnInit } from '@angular/core';
import { PaiService } from '../../../paisa.service';
import { Router } from '@angular/router';
import { Advertise } from '../../../paisa';
@Component({
  selector: 'app-advertisementform',
  templateUrl: './advertisementform.component.html',
  styleUrls: ['./advertisementform.component.css']
})
export class AdvertisementformComponent implements OnInit{
  /* todo included p-clips add respective code for hastages 
  add hashTagSeparatorExp in html*/
  advertise= new Advertise();
  paiChecked: boolean = false;
  paisaChecked: boolean = false;
  editorConfig = {
    // Configuration options
  };
  editorContent="Hi"
  message=''
  text="www";
  value='wwwwwwwwwwwwwwwwwwwwwww'
  public editorData: string = '';
  
  hashTagSeparatorExp: RegExp = /,| /;
  constructor(private _service: PaiService, private _router: Router){};
  onEditorChange(event: any) {
    this.editorData = event;
  }
  paisa=''
  pai=''
  
  ngOnInit(): void {
    this._service.getUserdata(this._service.userId).subscribe(
      data=>{
        console.log(data)
        data.forEach((user:any)=>{
          this.paisa=user.paisa
          this.pai=user.pai
        });
      },
      error=>{
        console.log("error occured while retreiving the user data!")
      }
    );
  }
  paiCheckbox(){
    this.paiChecked=!this.paiChecked
    if(!this.paiChecked)
      this.paiChecked = true;
    else
      this.paiChecked = false;
      this.advertise.pai=0;
      this.advertise.paiperclick=0;
    console.log("this.paiChecked+",this.paiChecked)
  }
  paisaCheckbox(){
    console.log("this.paisaChecked-",this.paisaChecked)
    this.paisaChecked=!this.paisaChecked
    if(!this.paisaChecked)
      this.paisaChecked = true;
    else
      this.paisaChecked = false;
      this.advertise.paisa=0;
      this.advertise.paisaperclick=0;
    console.log("this.paisaChecked+",this.paisaChecked)
  }
  advertisementForm(){
    this.message=''
    if(this.advertise.brandname==null || this.advertise.brandname==''){
      this.message="Please enter Brandname"
    }
    else if(this.advertise.description==null || this.advertise.description==''){
      this.message="Please enter brand description"
    }
    else if(this.advertise.url==null || this.advertise.url==''){
      this.message="Please enter brand Website url"
    }
    else if(!this.advertise.url.startsWith('https://')){
      this.message="Please enter valid url starts with https://.."
    }
    else if(!(this.paiChecked || this.paisaChecked)){
      this.message="Please select advertisement type";
    }
    else if(((this.paiChecked && this.validPai()) || (this.paisaChecked && this.validPaisa()))){
      //Correcting
    }
    else{
      this._service.advertiseFromRemote(this.advertise,this._service.userId).subscribe(
        data=>{
          console.log("Response received--------------->",data);
          this._router.navigate(['alladvertisements'])
      },
        error=>{console.log(this.advertise);
          console.log("not saved");
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

  adBackground: string = 'background1'; // Initialize with an empty string or default image
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
  locationEnabled: boolean = false;
  viewLocationValue: boolean = false;
  viewLocation(){
    this.viewLocationValue=true;
  }
  onLocationToggle(event: any) {
    console.log('Toggled:', event.checked);
    this.locationEnabled = event.checked;
    console.log('locationEnabled:', this.locationEnabled);
}
}
