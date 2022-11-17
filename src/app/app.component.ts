import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { CookiesService } from './cookies.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-base-update';
  assets: Array<any> = [];
  playing: string = '';
  collectionI: number = -1;
  bookI: number = -1;
  trackI: number = 0;
  page: string = 'collections';

  constructor(protected api: ApiService, protected cookies: CookiesService) {
    const self = this;
    this.api.post('assets/list').then(response => {
      self.assets = response;
      let c = parseInt(this.cookies.get('collection'));
      if (c > -1) {
        this.setCollection(c, true);
        this.page = 'books';
      }
      let b = parseInt(this.cookies.get('book'));
      if (b > -1) {
        this.setBook(b, true);
        this.page = 'tracks';
      }
      let t = parseInt(this.cookies.get('track'));
      if (t > -1) {
        this.setTrack(t, true);
        this.page = 'tracks';
      }
    });
  }

  setCollection(i: number, init: boolean = false) {
    this.collectionI = i;
    if (!init) {
      this.cookies.set('collection', i.toString());
      this.page = 'books';
    }
    this.setBook(-1, init);
    this.setTrack(-1, init);
  }

  setBook(i: number, init: boolean =  false) {
    this.bookI = i;
    this.setTrack(0, init);
    if (!init){
      this.cookies.set('book', i.toString());
      if (i > -1){
        this.page = 'tracks';
      }
    }
  }

  setTrack(i: number, init: boolean =  false) {
    if (!init){
      this.cookies.set('track', i.toString());
    }
    this.trackI = i;
  }

  isHP(): boolean {
    return this.collection().name.indexOf('Harry Potter') > -1;
  }

  nameFormat(text: string, keepNumber: boolean = false) {
    const regex = /^(Chapter|chapter|Track|track|book|Book)*[ -:]*([0-9])+[ -:]*/gm;
    let name = text;
    let rep = keepNumber ? '$2. ' : '';
    name = name.replace(regex, rep);
    return name;
  }

  nextTrack() {
    const i = Math.min(this.trackI + 1, this.book().children.length);
    this.setTrack(i);
  }

  prevTrack() {
    const i = Math.max(this.trackI - 1, 0);
    this.setTrack(i);
  }

  collection(): any {
    if (this.collectionI > -1){
      return this.assets[this.collectionI];
    } else {
      return null;
    }
  }

  bookPrev() {
    var i = this.bookI;
    i = i - 1;
    i = Math.max(i, 0);

  }

  bookNext() {
    var i = this.bookI;
    i = i + 1;
    i = Math.min(i, this.collection().children.length - 1);
    this.bookI = i;

    this.trackI = 0;
  }

  book(): any {
    if (this.collection()) {
      return this.collection().children[this.bookI];
      this.trackI = 0;
    } else {
      return null;
    }
  }

  track(): any {
    if (this.book()){
      return this.book().children[this.trackI];
    } else {
      return null;
    }
  }

  src() {
    return this.track().path.replace('./src/assets/Library','./assets/Library').replace("'",'%27');
  }

  trackName() {
    return this.track().name.replace(/[0-9-\s:]+/,'');
  }

}
