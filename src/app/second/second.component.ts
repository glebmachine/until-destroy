import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})
export class SecondComponent implements OnInit {
  constructor() {
  }
  ngOnInit() {}
}
