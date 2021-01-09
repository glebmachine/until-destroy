import { Directive, OnDestroy } from "@angular/core";
import { interval } from "rxjs";
import { untilDestroyed } from "until-destroyed";



@Directive({
  selector: '[appDemo1]',
})
export class Demo1Directive{
  constructor(){
    untilDestroyed(this);
  }
}

@Directive({
  selector: '[appDemo2]',
})
export class Demo2Directive implements OnDestroy {
  constructor(){
    setTimeout(() => this.demo(), 200);
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

  ngOnDestroy() {
  }
}

@Directive({
  selector: '[appDemo3]',
})
export class Demo3Directive{
  constructor(){
    setTimeout(() => {
      console.log('директива подписывается, в этот момент она уже все');
      untilDestroyed(this);
    }, 3000);
  }
}
