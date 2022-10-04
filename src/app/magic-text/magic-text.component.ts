import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '.magic-text',
  templateUrl: './magic-text.component.html',
  styleUrls: ['./magic-text.component.scss']
})
export class MagicTextComponent implements OnInit {
  @Input() text: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  letters(): Array<string> {
    let letters = [];
    for(var i = 0;i<this.text.length;i++){
      letters.push(this.text[i]);
    }
    return letters;
  }

}
