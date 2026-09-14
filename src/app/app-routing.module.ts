import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResultComponent } from './components/result/result.component';
import { PnrStatusComponent } from './components/pnr-status/pnr-status.component';
import { LiveStatusComponent } from './components/live-status/live-status.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { CoachPositionComponent } from './components/coach-position/coach-position.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'results', component: ResultComponent},
  {path: 'pnr', component: PnrStatusComponent},
  {path: 'live-status', component: LiveStatusComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'coach-position', component: CoachPositionComponent},
  {path: '', component: HomeComponent},
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
