import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { interval } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'app-demo2',
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.css']
})
export class Demo2Component implements ControlValueAccessor, OnInit {

  constructor() { }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnInit(): void {

  }

  demo() {
    interval(200).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: tickNumber => console.log('tick', tickNumber),
      complete: () => console.log('completed'),
      error: (err) => console.error('completed'),
    });
  }
}
