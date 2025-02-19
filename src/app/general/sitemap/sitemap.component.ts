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
  sitemapXml: string = '';

  constructor(private _service: PaiService, private _router: Router,private route: ActivatedRoute){};
    

  ngOnInit() {
    this._service.getSitemap().subscribe(
      
      xmlString => {
        console.log("xmlString",xmlString)
        this.parseSitemap(xmlString);
        },
      error => {
        console.error('Error fetching sitemap:', error);
      }
      
    );
  }

  parseSitemap(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const urlElements = xmlDoc.getElementsByTagName('loc');

    this.sitemapUrls = Array.from(urlElements).map(el => el.textContent || '');
  }
  serveSitemap(xmlContent: string) {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    // Redirect browser to download the sitemap.xml file
    window.location.href = url;
  }
  downloadSitemap() {
    const blob = new Blob([this.sitemapXml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml'; // Download file as sitemap.xml
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Clean up
    window.URL.revokeObjectURL(url); // Free memory
  }
}
