import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { reajusteContratoFaturamentoRouterConfig } from './reajustecontratofaturamento.routes';
import { DataTableModule } from 'ng2-data-table';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SelectModule } from 'ng2-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { ReajusteContratoFaturamentoComponent } from './reajustecontratofaturamento.component';

import { ReajusteContratoFaturamentoService } from './reajustecontratofaturamento.service';
import { ListaContratoFaturamentoComponent } from './lista-contratofaturamento/lista-contratofaturamento.component';
import { MaskService } from '../../services/mask.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
    imports: [
    //    SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(reajusteContratoFaturamentoRouterConfig),
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
        TextMaskModule
    ],
    declarations: [
        ReajusteContratoFaturamentoComponent,
        ListaContratoFaturamentoComponent
        
    ],
    providers: [
        ReajusteContratoFaturamentoService,
        MaskService
        
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule
    ]
})

export class ReajusteContratoFaturamentoModule { }