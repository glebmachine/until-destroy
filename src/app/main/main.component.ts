import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { untilDestroyed } from 'until-destroyed';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() {
    // untilDestroyed(this);

    // interval(200).pipe(
    //   untilDestroyed(this)
    // ).subscribe({
    //   next: tickNumber => console.log('tick', tickNumber),
    //   complete: () => console.log('completed'),
    //   error: (err) => console.error('completed'),
    // });
  }

  ngOnInit(): void {
  }

}
