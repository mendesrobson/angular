import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { alterarVencimentoLoteRouterConfig } from './alterarvencimentolote.routes';
import { AlterarVencimentoLoteComponent } from './alterarvencimentolote.component';
import { ListaParcelaPagarComponent } from './lista-parcelapagar/lista-parcelapagar.component';
import { ListaParcelaReceberComponent } from './lista-parcelareceber/lista-parcelareceber.component';
import { AlterarVencimentoLoteService } from './alterarvencimentolote.service';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DataTableModule } from "ng2-data-table";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { DxDateBoxModule } from '../../../../node_modules/devextreme-angular';

@NgModule({
    imports: [
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(alterarVencimentoLoteRouterConfig),
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
        DxDateBoxModule
    ],
    declarations: [
        AlterarVencimentoLoteComponent,
        ListaParcelaPagarComponent,
        ListaParcelaReceberComponent
    ],
    providers: [
        AlterarVencimentoLoteService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule
    ]
})

export class AlterarVencimentoLoteModule { }