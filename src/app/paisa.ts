export class User {
    id!:Number;
    email!:String;
    username!:String;
    firstname!:String;
    lastname!:String;
    password!:String;
    constructor(){}
}

export class Advertise{
    brandname!:String;
    description!:String;
    url!:String
    pai!:Number;
    paiperclick!:Number;
    paisa!:Number;
    paisaperclick!:Number;
    country!:String;
    state!:String;
    district!:String;
    constructor(){}
}
export class Contactus{
    name!:String; 
    email!:String;
    mobilenumber!:String;
    issue!:String;
    opendate!:String;
    closedate!:String;
    remarks!:String;
    constructor(){}
}

export class Comments{
    advertisementid!:Number;
    userid!:String;
    adid!:Number;
    comment!:String;
    remark!:String;
    temp1!:String;
}

export class Follower{
    advertiserid!:Number;
    userid!:String;
    following!:boolean;
}

export class Visited{
    advertisementid!:Number;
    userid!:String;
    visited!:boolean;
}
