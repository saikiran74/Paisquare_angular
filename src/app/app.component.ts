import { Component , OnInit} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showFooter: boolean = false;
  title = 'pai_square';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showFooter = this.shouldShowFooter();
    });
  }

  shouldShowFooter(): boolean {
    const currentRoute = this.router.url;
    // List of routes where footer should be visible
    return currentRoute === '/' || currentRoute === '/createaccount' || currentRoute === '/login'|| currentRoute === '/termsandconditions' || currentRoute === '/privacyandpolicy';
  }
}
