import { Component , OnInit, ViewChild, HostListener  } from '@angular/core';
import { PaiService} from '../paisa.service';
import { Router } from '@angular/router';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import {HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';
import { AuthService } from '../service/auth-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  implements OnInit{
  nodes!: TreeNode[];
  isMobileView: boolean = false;
  isSidebarVisible: boolean = true;
  constructor(private _service: PaiService,private http: HttpClient, private authService: AuthService,private _router: Router,private _route: ActivatedRoute) {
       
  }
  userId='';
  @ViewChild('tree') tree: Tree | undefined;
  sidebarVisible: boolean = false;
  sidebarVisible1:boolean=true;
  userName=' ';
    ngOnInit() {
      this.checkViewport();
      const token = localStorage.getItem('token');
      console.log("token in navbar-->",token)
      if (token && this.authService.isAuthenticated()) {
        const userdetails=this.authService.getUserDetails()
        console.log("userdetails-->",userdetails)
        this.userId=userdetails.id;
        this._service.userId=userdetails.id;
        this._service.userName=userdetails.username;
        this.userName=userdetails.username;
      } else {
        console.log("Token is not authencated in navbar")
        this._router.navigate(['/login']);
      }
      this.nodes = [
          {
              key: '0',
              label: 'User',
              children: [
                  { key: '0-0', label: 'Dashboard', data: 'user/userdashboard', type: 'url',icon:'pi pi-home'},
                  { key: '0-1', label: 'Your activities', data: 'user/useractivities', type: 'url',icon:'pi pi-chart-line'},
                  { key: '0-3', label: 'Withdraw', data: 'user/withdraw', type: 'url',icon:'pi-cart-plus'},
                  { key: '0-4', label: 'Chat', data: 'user/chat', type: 'url',icon:'pi-cart-plus'}
              ]
          },
          {
              key: '1',
              label: 'Advertiser',
              children: [
                  { key: '1-0', label: 'Dashboard', data: 'advertiser/advertiserdashboard', type: 'url',icon:'pi pi-home' },
                  { key: '1-1', label: 'Report', data: 'advertiser/advertiserreport', type: 'url' ,icon:'pi pi-chart-bar'},
                  //{ key: '1-2', label: 'My Advertisment', data: 'advertiser/myadvertisement/:userId', type: 'url',icon:'pi pi-folder' },
                  { key: '1-2', label: 'My Advertisment', data: '/myadvertisement', type: 'url',icon:'pi pi-folder' },
                  { key: '1-3', label: 'Advertise', data: 'advertiser/advertise', type: 'url',icon:'pi pi-plus' }
              ]
          },
          {
            key: '2',
            label: 'Settings',
            children: [
                { key: '2-0', label: 'Profile', data: 'home/profile/:userId', type: 'url',icon:'pi pi-home'},
                { key: '2-1', label: 'Update profile', data: 'home/profileupdate', type: 'url',icon:'pi pi-chart-line'},
                { key: '2-2', label: 'logout', data: 'logout', type: 'url',icon:'pi pi-sign-out'},
            ]
          },
      ];
    }
  componentViewMethod(val:String){
    console.log(val)
    if (val.includes('myadvertisement')) {
      //this._router.navigate([val.replace(':userId', this.userId)]);
      console.log('Navigating to myadvertisement with userId:', this.userId);
      this._router.navigate(['/advertiser/myadvertisement'], {
        queryParams: { userId: this.userId },
      });
      console.log('Navigating to myadvertisement with userId:', this.userId);

      //this._router.navigate(['/advertiser/myadvertisement'], {state: { userId: this.userId },});
    }else if (val.includes('home/profile/')) {
      this._router.navigate([val.replace(':userId', this.userId)]);
    } else if (val.includes('logout')) {
      this.authService.logout();
      this._router.navigate(['/login']);
    } 
     else {
      this._router.navigate([val]);
    }
  }
  ngAfterViewInit() {
    if (this.tree) {
      this.expandAllNodes(this.tree.value);
    }
  }

  expandAllNodes(nodes: TreeNode[]) {
    nodes.forEach(node => {
      node.expanded = true; // Expand current node
      if (node.children && node.children.length > 0) {
        this.expandAllNodes(node.children); // Recursively expand children
      }
    });
  }
  advertisements:any[]=[];
  querySearch:boolean=false;

  onSearch(queryEvent: Event): void {
    console.log('In query search',queryEvent);
    const inputElement = queryEvent.target as HTMLInputElement;
    const query = inputElement.value?.trim();
    this.querySearch=true;
    if (!query.trim()) {
        this.querySearch = false;
        console.log('Search query is empty');
    }
    this._service.getGlobalSearchresult(query).subscribe(
      data => {
        this.userId=this._service.userId;
        this.advertisements = data;
        console.log("advertisment list for userId: ",this.advertisements)
      },
        error=>{console.log("error occurred while retrieving the data for query -",query)
    });
  }
  checkViewport() {
    this.isMobileView = window.innerWidth <= 768;
    console.log("this.isMobileView ",this.isMobileView,window.innerWidth)
    this.isSidebarVisible = !this.isMobileView; // Sidebar hidden by default on mobile
  }

  @HostListener('window:resize', [])
  @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.checkMobileView();
    }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    console.log("isSidebarVisible ",this.isSidebarVisible)
  }
  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= 768; // Adjust width as needed
  }
}
