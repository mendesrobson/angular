import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ListaDashboardComponent } from './lista-dashboard/lista-dashboard.component';

export const dashboardRouterConfig: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            { path: '', component: ListaDashboardComponent },            
            { path: 'lista', component: ListaDashboardComponent }
        ]
    }
];