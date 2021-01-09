import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { interval } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'app-demo1',
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.css']
})
export class Demo1Component implements ControlValueAccessor, OnInit {

  constructor() {
    untilDestroyed(this);
  }

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
    })
  }
}
