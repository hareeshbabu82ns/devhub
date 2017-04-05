import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'gods.component.html'
})
export class GodsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }

  public gods: Array<any> = [
    {
      id: "1",
      name: "Sri Ganesh",
      icon: "icon"
    },
    {
      id: "2",
      name: "Sri Rama",
      icon: "icon"
    },
    {
      id: "3",
      name: "Sri Saraswathi",
      icon: "icon"
    },
    {
      id: "4",
      name: "Sri Lakshmi",
      icon: "icon"
    },
    {
      id: "5",
      name: "Sri Hanuman",
      icon: "icon"
    }
  ];
}
