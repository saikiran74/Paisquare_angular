import { Component, OnInit } from '@angular/core';
import { PaiService } from '../../paisa.service';
import {HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Advertise } from '../../paisa';

@Component({
  selector: 'app-advertiserreports',
  templateUrl: './advertiserreports.component.html',
  styleUrls: ['./advertiserreports.component.css']
})
export class AdvertiserreportsComponent implements OnInit{
  visitors:any;
  followers:any;
  likes:any;
  favourite:any;
  options: any;
  constructor(private _service: PaiService,private http: HttpClient,private _router: Router) {}
VisitorsLabels:any[]=[];
VisitorsData:any[]=[];
likesLabels:any[]=[];
likesData:any[]=[];
followersLabels:any[]=[];
followersData:any[]=[];
favouriteLabels:any[]=[];
favouriteData:any[]=[];
documentStyle = getComputedStyle(document.documentElement);
textColor = this.documentStyle.getPropertyValue('--text-color');
textColorSecondary =  this.documentStyle.getPropertyValue('--text-color-secondary');
surfaceBorder =  this.documentStyle.getPropertyValue('--surface-border');
noDataFavourite:Boolean=false;
noDataLikes:Boolean=false;
noDataFollowers:Boolean=false;
noDataVisitors:Boolean=false;
period:any;
/* Todo Get daily graph and change possion*/
selectedPeriod:any;
ngOnInit() {
    this.period = [
        { name: 'weekly', value: 'weekly' },
        { name: 'Today', value: 'Today' },
        { name: 'This month', value: 'thismonth' },
        { name: 'Last month', value: 'lastmonth' },
        { name: 'Yearly', value: 'yearly' }
    ];
    this.getFavouriteGraphFromRemote('weekly')
    this.getLikeGraphFromRemote('weekly')
    this.getVisitorGraphFromRemote('weekly')
    this.getFollowersGraphFromRemote('weekly')
    
    this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color:  this.textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color:  this.textColorSecondary
                },
                grid: {
                    color:  this.surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color:  this.textColorSecondary
                },
                grid: {
                    color:  this.surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}
selectedtype(period:String){
    this.getFavouriteGraphFromRemote(period)
    this.getLikeGraphFromRemote(period)
    this.getVisitorGraphFromRemote(period)
    this.getFollowersGraphFromRemote(period)
}
getFavouriteGraphFromRemote(period:any){
    this._service.getFavouriteGraphFromRemote(this._service.userId,period).subscribe(
        data=>{
            this.favouriteLabels=[]
            this.favouriteData=[]
            data.length
            if(data.length==0){
                this.noDataFavourite=true
            }
            else{
                data.forEach((obj: any) => {
                    this.favouriteLabels.push(obj[0])
                    this.favouriteData.push(obj[1])
                  });
            }
            
            this.favourite = {
                labels: this.favouriteLabels,
                datasets: [
                    {
                        label: 'favourite',
                        data: this.favouriteData,
                        fill: false,
                        borderColor:  this.documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.4
                    }
                ]
            };
    
        },
        error=>{
            console.log("likes graph from error occured!");
        });
}
getLikeGraphFromRemote(period:any){
    this._service.getLikeGraphFromRemote(this._service.userId,period).subscribe(
        data=>{
            this.likesData=[]
            this.likesLabels=[]
            if(data.length==0){
                this.noDataLikes=true
            }
            else{
                data.forEach((obj: any) => {
                    this.likesLabels.push(obj[0])
                    this.likesData.push(obj[1])
                });
            }
            this.likes= {
                labels: this.likesLabels,
                datasets: [
                    {
                        label: 'Likes',
                        data: this.likesData,
                        fill: false,
                        borderColor:  this.documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.4
                    }
                ]
            };
    
        },
        error=>{
            console.log("likes graph from error occured!");
        });
}
getVisitorGraphFromRemote(period:any){
    this._service.getVisitorGraphFromRemote(this._service.userId,period).subscribe(
        data=>{
            this.VisitorsLabels=[]
            this.VisitorsData=[]
            if(data.length==0){
                this.noDataVisitors=true
            }
            else{
                data.forEach((obj: any) => {
                    this.VisitorsLabels.push(obj[0])
                    this.VisitorsData.push(obj[1])
                });
            }
            this.visitors = {
                labels: this.VisitorsLabels,
                datasets: [
                    {
                        label: 'Visitors',
                        data: this.VisitorsData,
                        fill: false,
                        borderColor:  this.documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.4
                    }
                ]
            };
    
        },
        error=>{
            console.log("visitor graph from error occured!");
        });
}
getFollowersGraphFromRemote(period:any){
    this._service.getFollowersGraphFromRemote(this._service.userId,period).subscribe(
        data=>{
            this.followersLabels=[]
            this.followersData=[]
            if(data.length==0){
                this.noDataFollowers=true
            }
            else{
                data.forEach((obj: any) => {
                    this.followersLabels.push(obj[0])
                    this.followersData.push(obj[1])
                    });
            }
            this.followers = {
                labels: this.followersLabels,
                datasets: [
                    {
                        label: 'Followers',
                        data: this.followersData,
                        fill: false,
                        borderColor:  this.documentStyle.getPropertyValue('--blue-500'),
                        tension: 0.4
                    }
                ]
            };
        },
        error=>{
            console.log("Follower graph from error occured!");
        }
        );
}
}
