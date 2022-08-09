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
  artistI: number = 0;
  albumI: number = 0;
  songI: number = 0;


  constructor(protected api: ApiService) {
    const self = this;
    this.api.post('assets/list').then(response => {
      self.assets = response;
    });
  }

  nextTrack() {
    this.songI = Math.min(this.songI + 1, this.album().children.length);
  }

  prevTrack() {
    this.songI = Math.max(this.songI - 1, 0);
    // alert('next');
  }

  artist(): any {
    return this.assets[this.artistI];
  }

  albumPrev() {
    var i = this.albumI;
    i = i - 1;
    i = Math.max(i, 0);
    this.albumI = i;

    this.songI = 0;
  }

  albumNext() {
    var i = this.albumI;
    i = i + 1;
    i = Math.min(i, this.artist().children.length - 1);
    this.albumI = i;

    this.songI = 0;
  }

  album(): any {
    if (this.artist()){
      return this.artist().children[this.albumI];
    }
  }
  track(): any {
    if (this.album()){
      return this.album().children[this.songI];
    }
  }

  src() {
    return this.track().path.replace('./src','');
  }
  trackName() {
    return this.track().name.replace(/[0-9-\s:]+/,'');
  }
}
