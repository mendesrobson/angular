import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DataTableModule } from "ng2-data-table";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { DxDateBoxModule, DxDropDownBoxModule, DxTreeViewModule, DxDataGridModule, DxTreeViewComponent } from '../../../../node_modules/devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';

import { GerarArquivoPagamentoComponent } from './gerar-arquivopagamento/gerar-arquivopagamento.component';
import { gerarRemessaPagamentoRouterConfig } from './gerarremessapagamento.routes';
import { GerarRemessaPagamentoComponent } from './gerarremessapagamento.component';
import { GerarRemessaPagamentoService } from './gerarremessapagamento.service';

@NgModule({
    imports: [
    //    SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(gerarRemessaPagamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        MyDatePickerModule,
        BusyModule,
        SelectModule,
        MultiselectDropdownModule,
        AngularMultiSelectModule,
        DisableControlDirectiveModule,
        AngularMultiSelectModule,
        DxDateBoxModule,
        DxTreeViewModule,
        DxDropDownBoxModule,
        HttpClientModule,
        DxDataGridModule
    ],
    declarations: [
        GerarRemessaPagamentoComponent,
        GerarArquivoPagamentoComponent
 
    ],
    providers: [
        GerarRemessaPagamentoService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule
    ]
})

export class GerarRemessaPagamentoModule { }