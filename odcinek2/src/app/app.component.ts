import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular Hello World';
  message = 'Welcome to your Angular application!';

  getWelcomeMessage(): string {
    return `Hello, ${this.title}!`;
  }

  getYear(): number {
    return new Date().getFullYear();
  }
}
