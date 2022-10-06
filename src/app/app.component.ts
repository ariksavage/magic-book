import { Component } from '@angular/core';
import { ApiService } from './api.service';

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
  chapterI: number = 0;
  page: string = 'collections';

  constructor(protected api: ApiService) {
    const self = this;
    this.api.post('assets/list').then(response => {
      self.assets = response;
      console.log('collection.assets', self.assets);
    });
  }

  setCollection(i: number) {
    this.collectionI = i;
    this.page = 'books';
  }

  setBook(i: number) {
    this.bookI = i;
    this.page = 'chapters';
  }

  isHP(text: string): boolean {
    return text.indexOf('Harry Potter') > -1;
  }

  nameFormat(text: string, keepNumber: boolean = false) {
    const regex = /^(Chapter|chapter|book|Book)*[ -:]*([0-9])+[ -:]*/gm;
    let name = text;
    let rep = keepNumber ? '$2: ' : '';
    name = name.replace(regex, rep);
    return name;
  }

  nextChapter() {
    this.chapterI = Math.min(this.chapterI + 1, this.book().children.length);
  }

  prevChapter() {
    this.chapterI = Math.max(this.chapterI - 1, 0);
  }

  collection(): any {
    if (this.collectionI > -1){
      return this.assets[this.collectionI];
    } else {
      return null;
    }
  }

  selectBook(i: number) {
    this.bookI = i;
    this.chapterI = 0;
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

    this.chapterI = 0;
  }

  book(): any {
    if (this.collection()) {
      return this.collection().children[this.bookI];
    } else {
      return null;
    }
  }
  chapter(): any {
    if (this.book()){
      return this.book().children[this.chapterI];
    } else {
      return null;
    }
  }

  src() {
    return this.chapter().path.replace('./src/assets/library','./assets/Library');
  }
  chapterName() {
    return this.chapter().name.replace(/[0-9-\s:]+/,'');
  }

}
