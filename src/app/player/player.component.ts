import { AfterViewInit, Input, Output, EventEmitter, Component, ElementRef} from '@angular/core';
import { CookiesService } from '../cookies.service';

@Component({
  selector: '.player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {
  @Input() src: string = '';
  @Output() OnNext: EventEmitter<any> = new EventEmitter<any>();
  @Output() OnPrev: EventEmitter<any> = new EventEmitter<any>();
  // i: number = 0;
  player: any = null;
  volume: number = 1;
  playing: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  sleepMax: number = 60 * 60; // 1 hr in seconds
  sleep: number = 0;
  playTimer: any = null;
  showSleepOptions: boolean = false;

  constructor(private elementRef:ElementRef, protected cookies: CookiesService) {}

  ngAfterViewInit() {
    const self = this;
    this.player = this.elementRef.nativeElement.querySelector('#player');
     setTimeout(() => {
      let t = parseFloat(self.cookies.get('time'));
      if (isNaN(t)) {
        t = 0;
      }
      self.player.currentTime = t;
      self.duration = t;

      self.player.addEventListener('ended', self.afterTrack.bind(self));
      self.player.addEventListener('timeupdate', self.setTime.bind(self));
     });
  }

  setTime() {
    const self = this;
    this.currentTime = this.player.currentTime ? this.player.currentTime : 0;
    this.duration = this.player.duration ? this.player.duration : 0;
    this.cookies.set('time', self.player.currentTime.toString());
  }

  toggleSleepOptions() {
    this.showSleepOptions = !this.showSleepOptions;
  }

  setSleep(m: number) {
    const self = this;
    self.sleepMax = m * 60; // convert minutes to seconds
  }

  startSleepTimer() {
    this.sleepTimerStart();
    this.showSleepOptions = false;
  }

  displayVolume() {
    return Math.floor(this.volume * 100) + '%';
  }

  setSleepMinus(m: number) {
    const self = this;
    self.sleep -= (m * 60); // convert minutes to seconds
  }
  setSleepPlus(m: number) {
    const self = this;
    self.sleep += (m * 60); // convert minutes to seconds
  }

  parseSeconds(n: number) {
    var s = Math.floor(n);
    var m = Math.floor(s / 60);
    s = (s - (m * 60));

    var h = Math.floor(m / 60);
    m = (m - (h * 60));
    let str = `${("00" + m).slice(-2)}:${("00" + s).slice(-2)}`;
    if (h > 0){
      str = `${("00" + h).slice(-2)}:${str}`;
    }
    return str;
  }

  currentTimeSeconds() {
    return this.parseSeconds(this.currentTime);
  }

  durationSeconds() {
    return this.parseSeconds(this.duration);
  }

  volumeChange() {
    this.player.volume = this.volume;
  }

  afterTrack(e: Event) {
    this.next();
  }

  positionChange() {
    this.player.currentTime = this.currentTime;
  }

  trackChange() {
    const self = this;
    this.setTime();
    if (this.playing){
      setTimeout(function(){
        self.play();
      }, 200);
    }
  }

  prev() {
    this.OnPrev.emit(true);
    this.trackChange();
  }

  next() {
    this.OnNext.emit(true);
    this.trackChange();
  }

  play() {
    const self = this;
    this.player.play();
    this.playing = true;
  }

  pause() {
    this.player.pause();
    this.playing = false;
    clearTimeout(this.playTimer);
  }

  sleepTimerStart() {
    if (!this.playing) {
      this.play();
    }
    const self = this;
    self.sleep = self.sleepMax;
    const sleepInt = setInterval(function(){
      self.sleep = self.sleep - 1;
      if (self.sleep == 0){
        self.pause();
        clearInterval(sleepInt);
      }
    }, 1000);
  }
  sleepTimerStop() {
    const self = this;
    self.sleep = 1;
  }
}
