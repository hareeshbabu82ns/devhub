import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GodsComponent } from './gods.component';
import { GodsRoutingModule } from './gods-routing.module';
import { GodTitlesComponent } from './god-titles/god-titles.component';

@NgModule({
  imports: [
    CommonModule,
    GodsRoutingModule
  ],
  declarations: [ GodsComponent, GodTitlesComponent ]
})
export class GodsModule { }
