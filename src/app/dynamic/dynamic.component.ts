import { Component, OnDestroy, OnInit } from '@angular/core';
import { Demo1Component } from '../demo-components/demo1/demo1.component';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css']
})
export class DynamicComponent implements OnInit {

  public config = [
    Demo1Component, Demo1Component,
    Demo1Component, Demo1Component,
  ];

  public records = [
    {}, {}, {}, {},
    {}, {}, {}, {}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
