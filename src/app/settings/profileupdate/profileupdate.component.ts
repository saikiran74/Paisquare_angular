import { Component,OnInit } from '@angular/core';
import { Profile } from '../../paisa';
import { Router } from '@angular/router';
import { PaiService } from '../../paisa.service';
import { Message, MessageService } from 'primeng/api';
import { ValidationErrors,Validator,FormGroup,FormControl, Validators,ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-profileupdate',
  templateUrl: './profileupdate.component.html',
  styleUrls: ['./profileupdate.component.css']
})
export class ProfileupdateComponent implements OnInit {
  profileImage: boolean=false; // Replace with your actual image path or null
  showPencil: boolean = false;

  messages: Message={ severity: 'success', summary: 'Success', detail: 'Message Content' };
  showMessageFor=''
  updatingInformation:boolean=false;
  userId=''
  agerange:number=18;
  ageRangeValues: number[] = [10, 100];
  constructor(private _service: PaiService,private _router: Router,private messageService: MessageService
    , private http: HttpClient
  ) {}

  categories: any[] = [
    { label: 'Blogging', value: 'Blogging' },
    { label: 'designer', value: 'designer' },
    { label: 'travelling', value: 'travelling' }
  ];
  country: any[] = [
    { label: 'India', value: 'IN' },
    { label: 'Other', value: 'O' }
  ];
 ngOnInit(){
    this.profileForm = this.createFormGroup();
    this.getProfileImage();
    // loading profile data
    this._service.getUserdata(this._service.userId).subscribe(
      data =>{
        this.profileData=data;
        this.profileForm.get('brandInformation.brandName')?.setValue(data.brandName);
        this.profileForm.get('brandInformation.brandDescription')?.setValue(data.brandDescription);
        this.profileForm.get('brandInformation.brandTagLine')?.setValue(data.brandTagLine);
        this.profileForm.get('brandInformation.website')?.setValue(data.website);
        this.profileForm.get('personalInformation.advertiserName')?.setValue(data.advertiserName);
        this.profileForm.get('personalInformation.mobileNumber')?.setValue(data.mobileNumber);
        this.profileForm.get('personalInformation.country')?.setValue(data.country);
        this.profileForm.get('personalInformation.email')?.setValue(data.email);
        this.profileForm.get('personalInformation.brandLocation')?.setValue(data.brandLocation);
        this.profileForm.get('socialMedia.youtube')?.setValue(data.youtube);
        this.profileForm.get('socialMedia.facebook')?.setValue(data.facebook);
        this.profileForm.get('socialMedia.instagram')?.setValue(data.instagram);
        this.profileForm.get('socialMedia.twitter')?.setValue(data.twitter);
        this.profileForm.get('socialMedia.pinterest')?.setValue(data.pinterest);
        this.profileForm.get('brandRecommendation.brandCategory')?.setValue(data.brandCategory);
        this.profileForm.get('brandRecommendation.brandTargetGender')?.setValue(data.brandTargetGender);
        this.profileForm.get('brandRecommendation.brandEstablishedIn')?.setValue(data.brandEstablishedIn);
        if(data.pinCodes){
          this.profileForm.get('brandRecommendation.pinCodes')?.setValue(data.pinCodes);
        } else{
          this.profileForm.get('brandRecommendation.pinCodes')?.setValue([]);
        }
        this.profileForm.get('brandRecommendation.brandCompanyEmployeeSize')?.setValue(data.brandCompanyEmployeeSize);
        if (data.brandHashTags) {
          this.profileForm.get('brandRecommendation.brandHashTags')?.setValue(data.brandHashTags);
        } else {
          this.profileForm.get('brandRecommendation.brandHashTags')?.setValue([]);
        }
        this.profileForm.get('brandRecommendation.brandTargetAges')?.setValue(data.brandTargetAges);
        this.profileForm.get('brandRecommendation.country')?.setValue(data.country);
        //this.profileForm.patchValue(data);
        },
      error=>{
        console.log("error occured in followerslist")
      }
    );
  }
  createFormGroup(): FormGroup {
    return new FormGroup({
      brandInformation: new FormGroup({
        brandName: new FormControl('',Validators.maxLength(20)),
        brandDescription: new FormControl(''),
        brandTagLine: new FormControl(''),
        website: new FormControl('',[this.urlValidator()])
      }),
      personalInformation: new FormGroup({
        advertiserName: new FormControl(''),
        mobileNumber: new FormControl('',[this.mobileNumberValidator()]),
        country: new FormControl(''),
        email: new FormControl(''),
        brandLocation: new FormControl('')
      }),
      
      socialMedia: new FormGroup({
        youtube: new FormControl('',[this.urlValidator()]),
        facebook: new FormControl('', [
          this.urlValidator()
        ]),
        instagram: new FormControl('',[this.urlValidator()]),
        twitter: new FormControl('',[this.urlValidator()]),
        pinterest: new FormControl('',[this.urlValidator()])
      }),
      
      brandRecommendation: new FormGroup({
        brandCategory: new FormControl(''),
        brandTargetGender: new FormControl(''),
        brandEstablishedIn: new FormControl(''),
        brandCompanyEmployeeSize: new FormControl(''),
        brandHashTags: new FormControl(''),
        pinCodes: new FormControl('',[this.pinCodeValidator()]),
        brandTargetAges: new FormControl(''),
        country: new FormControl('')
      })

    });
  }
  profileForm!: FormGroup<any>;
  profileData: any;
 
  onSubmitbrandInformationUpdate(){
    this.updatingInformation=true;
    const brandInformationControl = this.profileForm.get('brandInformation');
    if (brandInformationControl && brandInformationControl.valid) {
      const personalInfoData = brandInformationControl.value;
      this._service.ProfilebrandInformationUpdate(personalInfoData,this._service.userId).subscribe(
        data=>{
          this.messagesUpdate('success');
          this.showMessageFor='brandInformation';
          this._router.navigate(['home/profileupdate'])
        },
        error=>{
          this.messagesUpdate('error');
      })
    } else {
      this.messagesUpdate('info');
    }
    this.updatingInformation=false;
  }
  messagesUpdate(value:String){
    this.messageService.clear();
    if(value=='success')
      this.messageService.add({ severity:'success', summary:'Success', detail:'Successfully Updated'});
    else if(value=='error')
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
    else if(value=='warn')
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Message Content' });
    else
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'please enter details correctly' });
    console.log("this.messageService",this.messageService)
  }
  
  profileImageUrl: string ="";

  getProfileImage(): void {
    this._service.fetchAndProcessProfileImage(this.userId).subscribe(
      (url: string) => {
        this.profileImageUrl = url;
        this.profileImage = !!url; // Set flag if URL is valid
      },
      (error) => {
        console.error('Failed to load profile image:', error);
        // Show error message or fallback logic here
      }
    );
  }
  
  selectedFile: File | null = null;

  onPencilClick(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click(); // Open file dialog
  }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const file: File = event.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5 MB limit
      alert('File size exceeds the maximum limit of 5 MB.');
      return;
    }
    this.uploadImage();
  }
  uploadImage(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      this._service.uploadProfileImage(formData).subscribe({
        next: (response) => {
          alert(response); // Display the response
          this.getProfileImage(); // Refresh profile image
        },
        error: (err) => {
          console.error("Error uploading image:", err);
          alert("Failed to upload image. Please try again.");
        },
      });
    } else {
      alert("Select an image to upload.");
    }
  }
  
  onSubmitpersonalInformationUpdate(){
    this.updatingInformation=true;
    const personalInformationControl = this.profileForm.get('personalInformation');
    this.showMessageFor='personalInformation';
    if (personalInformationControl && personalInformationControl.valid) {
      const personalInfoData = personalInformationControl.value;
      this._service.ProfilepersonalInformationUpdate(personalInfoData,this._service.userId).subscribe(
        data=>{
          this.messagesUpdate('success');
          this._router.navigate(['home/profileupdate',this._service.userId])
      },
        error=>{
        this.messagesUpdate('error');
      })
    } else {
      this.messagesUpdate('info');
    }
    this.updatingInformation=false;
  }
  
  onSubmitBrandRecommendationUpdate(){
    this.updatingInformation=true;
    const brandRecommendationControl = this.profileForm.get('brandRecommendation');
    this.showMessageFor='BrandRecommendation';
    if (brandRecommendationControl && brandRecommendationControl.valid) {
      const brandRecommendationData = brandRecommendationControl.value;
      this._service.ProfileBrandRecommendationUpdate(brandRecommendationData,this._service.userId).subscribe(
        data=>{
          this.messagesUpdate('success');
          this._router.navigate(['home/profileupdate'])
      },
        error=>{
          console.log("profile not saved");
        this.messagesUpdate('error');
      })
    } else {
      this.messagesUpdate('info');
    }
    this.updatingInformation=false;
  }
  onSubmitSocialMediaUpdate(){
    this.updatingInformation=true;
    const socialMediaControl = this.profileForm.get('socialMedia');
    this.showMessageFor='SocialMedia';
    if (socialMediaControl && socialMediaControl.valid) {
      const socialMediaData = socialMediaControl.value;
      this._service.ProfileSocialMediaUpdate(socialMediaData,this._service.userId).subscribe(
        data=>{
          this.messagesUpdate('success');
          this._router.navigate(['home/profileupdate'])
      },
        error=>{
          console.log("profile not saved");
          this.messagesUpdate('error');
      })
    } else {
      this.messagesUpdate('info');
    }
    this.updatingInformation=false;
  }
  onSubmitpasswordUpdate(){
    //todo
    const passwordUpdateControl = this.profileForm.get('passwordUpdate');
    this.showMessageFor='password';
    if (passwordUpdateControl && passwordUpdateControl.valid) {
      const passwordUpdateData = passwordUpdateControl.value;
      this._service.ProfilepasswordUpdate(passwordUpdateData,this._service.userId).subscribe(
        data=>{
          this.messagesUpdate('success');
          this._router.navigate(['home/profileupdate',this._service.userId])
      },
        error=>{
          console.log("profile not saved");
        this.messagesUpdate('error');
      })
    } else {
      this.messagesUpdate('info');
    }
  }
  mobileNumberValidator() {
    return (control: AbstractControl) => {
      const isValid = /^\d{10}$/.test(control.value);
      return isValid ? null : { invalidMobileNumber: { value: control.value } };
    };
  }
  urlValidator() {
    return (control: AbstractControl) => {
      if (!control.value) {
        return null; // No validation needed if the field is empty
      }
      const pattern = /^(https?:\/\/)?([\w-]+\.)*[\w-]+(\.[a-z]{2,})?(:\d{1,5})?(\/\S*)?$/i;
      const isValid = pattern.test(control.value);
      return isValid ? null : { invalidUrl: { value: control.value } };
    };
  }
  invalidPinCodesList:any;
  pinCodeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const pinCodesStr: string = typeof control.value === 'string' ? control.value : control.value.toString();
      const pinCodes: string[] = pinCodesStr.split(',');
      if(pinCodes.length==0){
        return null;
      }
      const invalidPinCodes = pinCodes.filter(pin => !/^\d{6}$/.test(pin.trim()));
      this.invalidPinCodesList=invalidPinCodes.join(', ');
      return invalidPinCodes.length > 0 ? { invalidPinCode: true } : null;
    };
  }

  
  
}
