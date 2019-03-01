import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

// components
import { DashboardComponent } from './dashboard.component';
import { ListaDashboardComponent } from './lista-dashboard/lista-dashboard.component';

// services
import { DashboardService } from './dashboard.service';

// config
import { dashboardRouterConfig } from './dashboard.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';


@NgModule({
    imports: [
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(dashboardRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        Ng2GoogleChartsModule
    ],
    declarations: [
        DashboardComponent,
        ListaDashboardComponent
    ],
    providers: [
      DashboardService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class DashboardModule { }