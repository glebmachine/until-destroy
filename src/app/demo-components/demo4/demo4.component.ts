import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { interval } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'app-demo4',
  templateUrl: './demo4.component.html',
  styleUrls: ['./demo4.component.css']
})
export class Demo4Component implements ControlValueAccessor, OnInit, AfterViewInit {

  constructor() {
  }

  ngOnInit(): void {
    untilDestroyed(this);
  }

  ngAfterViewInit(): void {
    console.log('demo4 ngAfterViewInit');
    // untilDestroyed(this);
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
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
