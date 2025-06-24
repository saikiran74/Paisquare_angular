import { Component, OnInit, Input, HostListener, Renderer2 } from '@angular/core';
import { PaiService } from '../../../paisa.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../service/auth-service.service';
import { Meta, Title } from '@angular/platform-browser';
import { Comments, Follower, Visited, Like, Block, Report, Favourite, Advertise } from '../../../paisa';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface City {
  name: string,
  value: string
}

@Component({
  selector: 'app-alladvertisements',
  templateUrl: './alladvertisements.component.html',
  styleUrls: ['./alladvertisements.component.css']
})

export class AlladvertisementsComponent implements OnInit {
isFocusedPincode: boolean = false;
  sanitizePincode() {
    this.newPincode = this.newPincode.replace(/[^0-9]/g, '').slice(0, 6);
  }
  
  sanitizeHashtag() {
    this.newHashtag = this.newHashtag.replace(/[^a-zA-Z0-9]/g, '');
  }

  constructor(
    private _service: PaiService,
    private http: HttpClient,
    private _router: Router,
    private _route: ActivatedRoute,
    private authService: AuthService,
    private meta: Meta,
    private title: Title,
    private renderer: Renderer2
  ) {}

  advertisements: Advertise[] = [];
  userAdvertisementslist: any[] = [];
  blockedAdvertisementslist: any[] = [];
  followingAdvertisementslist: any[] = [];
  followerslist: any[] = [];
  userData: any[] = [];
  blockedlist: any[] = [];
  favouriteslist: any[] = [];
  userId = '';
  adId = '';
  cities!: City[];
  selectedCities!: City[];
  chips: { label: string }[] = [];
  activeChipIndex = 0;
  selectedCategory = '';
  categorySearch = '';
  location = '';
  newPincode = '';
  newHashtag = '';
  pincodes: string[] = [];
  hashtags: string[] = [];
  isFocusedCategory = false;
isFocusedLocation = false;
// Removed duplicate declaration
isFocusedHashtag = false;
  
get hasActiveFilters(): boolean {
  return (
    this.categorySearch.trim() !== '' ||
    this.location.trim() !== '' ||
    this.newPincode.trim().length === 6 ||
    this.newHashtag.trim() !== ''
  );
}

  categories = [
    'Travel', 'Health', 'Education', 'Business', 'Events', 'Agriculture',
    'Technology', 'Fashion', 'Food', 'Sports', 'Entertainment',
    'Real Estate', 'Automotive', 'Beauty', 'Finance'
  ];

  get filteredCategories(): string[] {
    return this.categories.filter(cat =>
      cat.toLowerCase().includes(this.categorySearch.toLowerCase())
    ).slice(0, 6);
  }
  
  addPincode() {
    const valid = /^\d{6}$/.test(this.newPincode);
    if (valid && !this.pincodes.includes(this.newPincode)) {
      this.pincodes.push(this.newPincode);
      this.newPincode = '';
    }
  }
  
  removePincode(pin: string) {
    this.pincodes = this.pincodes.filter(p => p !== pin);
  }
  
  addHashtag() {
    const tag = this.newHashtag.trim().toLowerCase();
    if (tag && !this.hashtags.includes(tag)) {
      this.hashtags.push(tag);
      this.newHashtag = '';
    }
  }
  
  removeHashtag(tag: string) {
    this.hashtags = this.hashtags.filter(h => h !== tag);
  }
  
  
clearAllFilters() {
  this.selectedCategory = '';
  this.categorySearch = '';
  this.location = '';
  this.pincodes = [];
  this.hashtags = [];
}

selectCategory(cat: string) {
  this.selectedCategory = this.selectedCategory === cat ? '' : cat;
}

handleSubmitFilters() {
  const trimmedPincode = this.newPincode.trim();

  // Case: Pincode-based filtering only (single or multiple)
  if (this.pincodes.length > 0) {
    this.querySearch = true;
    this._service.getAllAdvertisements().subscribe((ads: Advertise[]) => {
      // Match if any ad contains at least one matching pincode
      this.advertisements = ads.filter(ad =>
        ad.pincodes &&
        this.pincodes.some(pin => ad.pincodes.includes(pin))
      );
    });
    return;
  }

  // TODO: Extend logic for category, location, hashtags, etc. later
}


  // --- New Search Bar Properties ---
  query: string = '';
  isFocused: boolean = false;
  querySearch: boolean = false;

  ngOnInit() {
    this.checkViewport();
    this.fetchDistinctHashtags();
    this.advertisements = [];
    console.log("this.fetchDistinctHashtags();", this.fetchDistinctHashtags());
    this._route.queryParams.subscribe(params => {
      this.userId = params['userId'];

      if (this.userId) {
        this.fetchUserAdvertisements(this.userId);
      } else {
        this._route.params.subscribe(params => {
          this.adId = params['id'];
          if (this.adId) {
            this._service.getIDAdvertisements(+this.adId).subscribe(
              data => {
                if (data.length > 0) {
                  this.advertisements = data;
                  if (data && Array.isArray(data) && data.length > 0) {
                    const adData = data[0];
                    this.setMetaTags(adData);
                  }
                  if (this.advertisements.length > 0) {
                    this.insertJsonLdScript();
                  }
                } else {
                  this.fetchadvertisement();
                }
              },
              error => {
                console.log("Error occurred while retrieving the advertisement for ID:", this.adId);
              }
            );
          } else {
            this.fetchadvertisement();
          }
        });
      }
    });
    this.userId = this._service.userId;
  }

  fetchUserAdvertisements(userId: string) {
    this._service.getUserAdvertisements(+this.userId).subscribe(
      data => {
        this.advertisements = data;
        if (this.advertisements.length > 0) {
          this.insertJsonLdScript();
        }
      },
      error => {
        console.log("error occurred while retrieving the data for userId -", this.userId);
      }
    );
  }

  fetchadvertisement() {
    this._service.getAllAdvertisements().subscribe(
      data => {
        this.userId = this._service.userId;
        this.advertisements = data.reverse();
        if (this.advertisements.length > 0) {
          this.insertJsonLdScript();
        }
      },
      error => {
        console.log("error occur while retrieving the data!")
      }
    );
  }

  fetchDistinctHashtags() {
    this._service.getHashTags().subscribe(data => {
      this.chips = [{ label: 'All' }, ...data.map((hashtag: string) => ({ label: hashtag }))];
    });
  }

  onChipClick(index: number) {
    this.activeChipIndex = index;
    const selectedHashtag = this.chips[index].label;
    if (selectedHashtag === 'All') {
      this.fetchadvertisement();
    } else {
      this.getHashTagsAdvertisement(selectedHashtag);
    }
  }

  getHashTagsAdvertisement(query: string) {
    this._service.getHashTagsAdvertisement(query).subscribe(data => {
      this.advertisements = data;
    });
  }

  // Your old method -- KEEP IT
  onSearch(queryEvent: Event): void {
    const inputElement = queryEvent.target as HTMLInputElement;
    let query = inputElement.value?.trim();
    this.querySearch = true;
    if (!query.trim()) {
      this.querySearch = false;
    }
    if (query == '') {
      query = 'all';
    }
    this._service.getPincodesAdvertisement(query).subscribe(
      data => {
        this.userId = this._service.userId;
        this.advertisements = data;
      },
      error => {
        console.log("error occurred while retrieving the data for query -", query)
      }
    );
  }

  // --- NEW: Modern Unified Search Method ---
  onSearchSubmit() {
    if (this.query.trim()) {
      console.log('Search query:', this.query);
      this.querySearch = true;
      this.searchAdvertisements(this.query.trim());
    }
  }

  searchAdvertisements(query: string) {
    let searchType = '';

    if (/^\d{6}$/.test(query)) {
      searchType = 'pincode';
    } else if (query.startsWith('#')) {
      searchType = 'hashtag';
    } else {
      searchType = 'general';
    }

    // This method must exist in your PaiService!
    this.getSearchResults(query, searchType);
  }

  
  public getSearchResults(query: string, type: string) {
    if (type === 'hashtag') {
      return this._service.getHashTagsAdvertisement(query).subscribe(
        data => {
          this.advertisements = data;
        },
        error => {
          console.error('Error occurred while searching advertisements:', error);
        }
      );
    } else if (type === 'pincode') {
      return this._service.getPincodesAdvertisement(query).subscribe(
        data => {
          this.advertisements = data;
        },
        error => {
          console.error('Error occurred while searching advertisements:', error);
        }
      );
    } else {
      return this._service.getGlobalSearchresult(query).subscribe(
        data => {
          this.advertisements = data;
        },
        error => {
          console.error('Error occurred while searching advertisements:', error);
        }
      );
    }
  }


  isMobileView: boolean = false;
  showSearchBox = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 768;
    if (this.isMobileView) {
      this.showSearchBox = false;
    }
  }

  toggleSearchBox() {
    this.showSearchBox = !this.showSearchBox;
  }

  setMetaTags(ad: any) {
    this.title.setTitle(ad.brandname || 'Advertisement');
    this.meta.updateTag({ name: 'description', content: this.stripHtml(ad.description) || 'Discover amazing advertisements' });
    this.meta.updateTag({ name: 'keywords', content: ad.hashtags || 'advertisement, online ads' });
    if (ad.url) {
      this.meta.updateTag({ property: 'og:url', content: ad.url });
    }
    this.meta.updateTag({ property: 'og:title', content: ad.brandname || 'Advertisement' });
    this.meta.updateTag({ property: 'og:description', content: this.stripHtml(ad.description) || 'Discover amazing advertisements' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'author', content: ad.advertiser?.advertiserName || 'Anonymous' });
    if (ad.location) {
      this.meta.updateTag({ name: 'geo.placename', content: ad.location });
    }
    if (ad.country) {
      this.meta.updateTag({ name: 'geo.country', content: ad.country });
    }
    if (ad.state) {
      this.meta.updateTag({ name: 'geo.region', content: ad.state });
    }
    if (ad.pincodes) {
      this.meta.updateTag({ name: 'geo.postalcode', content: ad.pincodes });
    }
  }

  stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  insertJsonLdScript() {
    if (!this.advertisements || this.advertisements.length === 0) {
      return;
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": this.advertisements.map((ad: any) => ({
        "@type": "Advertisement",
        "name": ad.title,
        "description": ad.description,
        "image": ad.imageUrl || "https://yourwebsite.com/default-image.jpg",
        "url": `https://yourwebsite.com/ad/${ad.id}`,
        "datePosted": ad.datePosted || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": ad.author || "Anonymous"
        }
      }))
    };
    const existingScript = document.getElementById('json-ld-script');
    if (existingScript) {
      existingScript.remove();
    }
    const script = this.renderer.createElement('script');
    script.id = "json-ld-script";
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);

    this.renderer.appendChild(document.head, script);
  }
}
function selectCategory(cat: any, string: any) {
  throw new Error('Function not implemented.');
}
