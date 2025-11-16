import { Routes } from '@angular/router';
import { TeamComponent } from './team-component/team-component';
import { DienstplanComponent } from './dienstplan-component/dienstplan-component';
// import { ArchivComponent } from './archiv-component/archiv-component';

export const routes: Routes = [
  { path: 'team', component: TeamComponent },
  { path: 'dienstplan', component: DienstplanComponent },
    // path: 'kinder', component: KinderComponent, 
    // path: 'eltern', component: ElternComponent,
  { path: '', redirectTo: '/team', pathMatch: 'full' }
];
