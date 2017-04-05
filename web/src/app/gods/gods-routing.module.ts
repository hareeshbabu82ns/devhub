import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { GodsComponent } from './gods.component';
import { GodTitlesComponent } from './god-titles/god-titles.component';

const routes: Routes = [
  {
    path: '',
    component: GodsComponent,
    data: {
      title: 'Gods'
    },
    children: [
      {
        path: ':id',
        component: GodTitlesComponent,
        data: {
          title: ''
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GodsRoutingModule {}
