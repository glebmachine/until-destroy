import { Component, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'until-destroyed';



@Injectable()
export class Demo3Service implements OnDestroy {
  constructor() {
    setTimeout(() => {
      untilDestroyed(this);
    }, 3000);
  }

  ngOnDestroy(): void {
    alert('пизда сервису');
  }
}

@Component({
  selector: 'app-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.css'],
  providers: [Demo3Service]
})
export class TimeoutComponent implements OnDestroy {
  constructor(
    private router: Router,
    private demo: Demo3Service,
  ) {

    setTimeout(() => {
      this.router.navigateByUrl('/empty');
      setTimeout(() => {
        // Тестируем на подпись на компонент, который уже куку
        untilDestroyed(this);
      }, 100);
    }, 2000);
  }

  ngOnDestroy(): void {
  }
}
