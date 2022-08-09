import { AfterViewInit, Input, Output, EventEmitter, Component, ElementRef} from '@angular/core';

@Component({
  selector: '.player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements AfterViewInit {
  @Input() playlist!: Array<any>;
  @Input() i: number = 0;
  @Output() iChange: EventEmitter<any> = new EventEmitter<any>();
  // i: number = 0;
  player: any = null;
  volume: number = 1;
  playing: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  sleep: number = 0;

  constructor(private elementRef:ElementRef) {}

  ngAfterViewInit() {
    const self = this;
    this.player = this.elementRef.nativeElement.querySelector('#player');
    this.player.pause();
    // this.duration = this.player.duration;
    this.player.addEventListener('ended', this.afterTrack.bind(this));
    this.player.addEventListener('timeupdate', this.setTime.bind(this));

    // setInterval(function(){
    //   self.setTime();
    // }, 1000);
  }

  setTime(){
    this.currentTime = this.player.currentTime || 0;
    this.duration = this.player.duration || 0;
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

  currentTimeSeconds(){
    return this.parseSeconds(this.currentTime);
  }

  durationSeconds(){
    return this.parseSeconds(this.duration);
  }

  volumeChange(){
    // console.log('volume', this.volume);
    this.player.volume = this.volume;
  }

  afterTrack(e: Event){
    this.next();
  }

  positionChange(){
    this.player.currentTime = this.currentTime;
  }

  trackChange() {
    const self = this;
    this.setTime();
    this.iChange.emit(this.i);
    if (this.playing){
      setTimeout(function(){
        self.play();
      }, 200);
    }
  }

  prev() {
    this.i = Math.max(0, this.i - 1);
    this.trackChange();
  }

  next() {
    this.i = Math.min(this.i + 1, this.playlist.length - 1);
    this.trackChange();
  }

  current() {
    return this.playlist[this.i];
  }

  src() {
    return this.current().path.replace('./src', '');
  }

  name() {
    return this.current().name.replace(/^[0-9\s:-]+/m, '');
  }

  play() {
    this.player.play();
    this.playing = true;
  }

  pause() {
    this.player.pause();
    this.playing = false;
  }

  sleepTimer() {
    if (!this.playing){
      this.play();
    }
    const self = this;
    this.sleep = 5; // seconds
    const sleepInt = setInterval(function(){
      self.sleep = self.sleep - 1;
      if (self.sleep == 0){
        self.pause();
        clearInterval(sleepInt);
      }
    }, 1000);
  }
}
