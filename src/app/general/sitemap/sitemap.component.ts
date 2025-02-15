import { Component } from '@angular/core';
import { PaiService } from '../../paisa.service';
import { ValidationErrors,Validator,FormGroup,FormControl, Validators,ValidatorFn, AbstractControl } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
import { Router } from '@angular/router';
import { Advertise } from '../../paisa';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.css'
})
export class SitemapComponent {
  sitemapUrls: string[] = [];

  constructor(private _service: PaiService, private _router: Router,private route: ActivatedRoute){};
    

  ngOnInit() {
    this._service.getSitemap().subscribe(xmlString => {
      this.parseSitemap(xmlString);
    });
  }

  parseSitemap(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const urlElements = xmlDoc.getElementsByTagName('loc');

    this.sitemapUrls = Array.from(urlElements).map(el => el.textContent || '');
  }
}
