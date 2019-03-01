import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { DxDateBoxModule } from '../../../../node_modules/devextreme-angular';

import { DataTableModule } from "angular2-datatable";;
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';



import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { remessaRouterConfig } from './remessa.routes';
import { RemessaComponent } from './remessa.component';
import { GerarRemessaComponent } from './gerar-remessa/gerar-remessa.component';
import { RemessaService } from './remessa.service';



@NgModule({
    imports: [
     //   SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(remessaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        MyDatePickerModule,
        BusyModule,
        DxDateBoxModule	
    ],
    declarations: [
        RemessaComponent,
        GerarRemessaComponent
    ],
    providers: [
        RemessaService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule ]
})

export class RemessaModule { }