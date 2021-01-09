import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxdModule } from '@ngxd/core';
import { CvaAdapterComponent } from './cva-adapter.component';

@NgModule({
  declarations: [CvaAdapterComponent],
  exports: [CvaAdapterComponent],
  imports: [
    CommonModule,
    NgxdModule,
  ]
})
export class CvaAdapterModule { }
