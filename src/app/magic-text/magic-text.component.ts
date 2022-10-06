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

  words(): Array<string> {
    return this.text.split(' ');
  }
  letters(word: string): Array<string> {
    let letters = [];

    for(var i = 0;i<word.length;i++){
      letters.push(word[i]);
    }
    return letters;
  }

}
