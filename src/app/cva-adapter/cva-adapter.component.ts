import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, ValidationErrors, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'cva-adapter',
  template: `
    <ng-container
      [ngxComponentOutlet]="component"
      (ngxComponentOutletActivate)="bind($event)"
    ></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvaAdapterComponent implements ControlValueAccessor, Validators, OnDestroy {
  @Input() public component: any;

  public childInstance: any;
  public onChange: (_: any) => void;
  public onTouched: (_: any) => void;
  public value: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public writeValue(obj: any): void {
    this.value.next(obj);
  }

  public validate(): ValidationErrors | null {
    return this.childInstance ? this.childInstance.validate() : null;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (this.childInstance?.setDisabledState) {
      this.childInstance.setDisabledState(isDisabled);
    }
  }

  public bind(childInstance: any) {
    this.childInstance = childInstance;
    this.childInstance.registerOnChange(this.onChange);
    this.childInstance.registerOnTouched(this.onTouched);
    this.value.pipe(
      untilDestroyed(this)
    ).subscribe(value => {
      this.childInstance.writeValue(value);
    });
  }

  ngOnDestroy(): void {
    this.childInstance = undefined;
  }
}
