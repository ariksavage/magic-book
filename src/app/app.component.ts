import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-base-update';

  constructor(protected api: ApiService) {
    this.api.get('test').then(response => {
      console.log('get', response);
    });
    this.api.post('test').then(response => {
      console.log('post', response);
    });
  }
}
