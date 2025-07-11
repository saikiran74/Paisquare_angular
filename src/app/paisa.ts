export enum URLs{
    FAQ='https://www.paisquare.in/2025/05/everything-you-need-to-know-about-paisquare-in-2025-advertising.html',
}

export class User {
    id!:Number;
    email!:string;
    username!:string;
    firstname!:string;
    lastname!:string;
    password!:string;
    emailOTP!:string;
    accountType!: String;
    constructor(){}
}

export class Advertise{
    brandname:string='';
    description:string='';
    url:string='';
    userid:Number=0;
    location:string=' ';
    backGroundColor:string='';
    gender!:string;
    pai:Number=0;
    paiperclick:Number=0;
    paisa!:Number;
    paisaperclick!:Number;
    country!:string;
    advertisement_type!:string;
    state!:string;
    district!:string;
    hashtags!: string;
    status!:string;
    pincodes!:string;
    category!:string;
    commenteduser!:Number[];
    visiteduser!:Number[];
    constructor(){}
}
export class Contactus{
    name:string=''; 
    email:string='';
    username:string='';
    userid:number=0;
    mobilenumber:string='';
    issue:string='';
    opendate:string='';
    closedate:string='';
    remarks:string='';
    constructor(){}
}

export class Profile{
    username!:string;
    userId!:number;
    paisa!:number;
    pai!:number;
    brandName!:string;
    brandDescription!:string;
    brandTagLine!:string;
    website!:string;
    advertiserName!:string;
    mobileNumber!:Number;
    country!:string;
    email!:string;
    brandLocation!:string;
    password!:string;
    brandCategory!:string;
    brandTargetGender!:string;
    brandEstablishedIn!:string;
    brandCompanyEmployeeSize!:string;
    brandHashTags!: string[];
    pinCodes!:number[];
    brandTargetAge!:string;
    followers!:Number[];
    following!:Number[];
    ads!:Number[];
    accountType!:String;
    rating!:number;
    profileImage!:string;
    noOfRating!:number;
    youtube!:string;
    facebook!:string;
    instagram!:string;
    twitter!:string;
    pinterest!:string;
}

export class Comments{
    advertisementid!:Number;
    userid!:string;
    adid!:Number;
    comment!:string;
    remark!:string;
    temp1!:string;
}

export class Follower{
    advertiserid!:Number;
    userid!:string;
    following!:boolean;
}

export class Visited{
    advertisementid!:Number;
    userid!:string;
    visited!:boolean;
}

export class Like{
    advertisementid!:Number;
    userid!:string;
    visited!:boolean;
}

export class Rating{
    advertiser!:Number;
    user!:Number;
    rating!:Number;
}

export class Block{
    advertiserid!:Number;
    userid!:string;
    blocked!:boolean;
}

export class Report{
    advertisementid!:Number;
    userid!:string;
    reportedtext!:string;
}

export class Favourite{
    advertisementid!:Number;
    userid!:string;
}
export enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
  }
  
  export enum PaymentMethod {
    UPI = "UPI",
    CARD = "CARD",
    NET_BANKING = "NET_BANKING"
  }
  
export class Payment {
    id?: number;
    userId?: number;
    orderId?: string;
    upiId?: string;
    amount?: number;
    currency?: string;
    paymentStatus?: PaymentStatus;
    transactionId?: string;
    paymentMethod?: PaymentMethod;
    createdAt?: string;
  }