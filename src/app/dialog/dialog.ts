import { Component } from '@angular/core';
import { User } from './model';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  protected readonly users: User[] = [
    { 
      name: "Jon Tony", 
      email: "j.tony@gmail.com", 
      img: "assets/avatar1.jpg", 
      tag: "owner" 
    },
    { 
      name: "Brooklyn Simmons", 
      email: "b.simmons@gmail.com", 
      img: "assets/avatar2.png" 
    },
    { 
      name: "Tina Wong", 
      email: "t.wong@gmail.com", 
      img: "assets/avatar3.png" 
    },
  ]
}
