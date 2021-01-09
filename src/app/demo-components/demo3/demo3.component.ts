import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { interval } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'app-demo3',
  templateUrl: './demo3.component.html',
  styleUrls: ['./demo3.component.css']
})
export class Demo3Component implements ControlValueAccessor, OnInit, OnDestroy {

  constructor() {
    untilDestroyed(this);
   }
  ngOnDestroy(): void {
    console.log('demo3 ngOnDestroy');
  }

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  demo(): void {
    interval(200).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: tickNumber => console.log('tick', tickNumber),
      complete: () => console.log('completed'),
      error: (err) => console.error('completed'),
    });
  }
}
