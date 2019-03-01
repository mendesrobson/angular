import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { AuthGuard } from '../guards/auth.guard';
import { ListaDashboardComponent } from '../dashboard/dashboard/lista-dashboard/lista-dashboard.component';
import { ListaComponent } from './lista/lista.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
    {
      path: 'dashboard1',
      component: Dashboard1Component,
      data: {
        title: 'Dashboard',
        urls: [{title: 'Dashboard',url: '/dashboard/dashboard1'},{title: 'Dashboard'}]
      }
    }, 
    {  
      path: 'dashboard2',
      component: Dashboard2Component,
      data: {
        title: 'Classic Dashboard',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Classic Dashboard'}]
      }
    }, {
      path: 'dashboard3',
      component: Dashboard3Component,
      data: {
        title: 'Analytical Dashboard',
        urls: [{title: 'Dashboard',url: '/dashboard'},{title: 'Analytical Dashboard'}]
      },
    },
    { 
      path:'lista',
      component: ListaComponent,
      data:{
          title:'DashBoard',
          urls:[{title: 'Dashboard',url:'/dashboard/lista'},{title: 'Lista'}]
      }
    }
  ]
  }
];
