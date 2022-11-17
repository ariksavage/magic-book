import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[popup]',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  open: boolean = false;
  @Input() title: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.open = !this.open;
  }

}
