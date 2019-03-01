import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { boletoRouterConfig } from './boleto.routes';
import { DataTableModule } from "ng2-data-table";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { BoletoComponent } from './boleto.component';
import { BoletoService } from './boleto.service';
import { GerarBoletoComponent } from './gerar-boleto/gerar-boleto.component';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';


@NgModule({
    imports: [
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(boletoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        MyDatePickerModule,
        BusyModule,
        SelectModule,
        MultiselectDropdownModule,
        AngularMultiSelectModule
        
    ],
    declarations: [
        BoletoComponent,
        GerarBoletoComponent
    ],
    providers: [
        BoletoService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule ]
})

export class BoletoModule { }