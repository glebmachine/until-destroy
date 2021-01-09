import { Component, Injectable, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { UntilDestroy, untilDestroyed } from 'until-destroyed';


@Injectable()
@UntilDestroy()
export class Demo1Service {
  constructor() {
    untilDestroyed(this);
  }
}

@UntilDestroy()
@Injectable()
export class Demo2Service implements OnDestroy {
  constructor() {
    timer(400).pipe(
      untilDestroyed(this)
    ).subscribe(v => console.log(v));
  }

  ngOnDestroy(): void {
    console.log("ДЕМО2 - удален")
  }
}

@Component({
  selector: 'app-services-demo',
  template: ``,
  providers: [Demo1Service, Demo2Service]
})
export class ServicesDemoComponent {
  constructor(
    private demo1: Demo1Service,
    private demo2: Demo2Service
  ) {

  }

}

@Component({
  selector: 'app-services',
  template: `
    <app-services-demo></app-services-demo>
  `,
})
export class ServicesComponent implements OnDestroy {
  constructor(
  ) {
  }

  ngOnDestroy(): void {}
}
