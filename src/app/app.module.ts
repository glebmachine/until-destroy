import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CvaAdapterModule } from './cva-adapter/cva-adapter.module';
import { Demo1Directive, Demo2Directive, Demo3Directive } from './demo-components/demo-directives';
import { Demo1Component } from './demo-components/demo1/demo1.component';
import { Demo2Component } from './demo-components/demo2/demo2.component';
import { Demo3Component } from './demo-components/demo3/demo3.component';
import { Demo4Component } from './demo-components/demo4/demo4.component';
import { DirectivesComponent } from './directives/directives.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { EmptyComponent } from './empty/empty.component';
import { MainComponent } from './main/main.component';
import { SecondComponent } from './second/second.component';
import { ServicesComponent, ServicesDemoComponent } from './services/services.component';
import { TimeoutComponent } from './timeout/timeout.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SecondComponent,
    Demo1Component,
    Demo2Component,
    Demo3Component,
    Demo4Component,
    EmptyComponent,
    DynamicComponent,
    TimeoutComponent,
    Demo1Directive,
    Demo2Directive,
    Demo3Directive,
    DirectivesComponent,
    ServicesDemoComponent,
    ServicesComponent,
  ],
  imports: [
    CvaAdapterModule,
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        component: MainComponent
      },
      {
        path: 'empty',
        component: EmptyComponent
      },
      {
        path: 'second',
        component: SecondComponent,
      },
      {
        path: 'dynamic',
        component: DynamicComponent,
      },
      {
        path: 'timeout',
        component: TimeoutComponent,
      },
      {
        path: 'directives',
        component: DirectivesComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
