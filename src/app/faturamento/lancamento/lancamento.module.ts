import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "angular2-datatable";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';

// components
import { LancamentoComponent } from './lancamento.component';
import { ListaLancamentoComponent } from './lista-lancamento/lista-lancamento.component';
import { AdicionarLancamentoComponent } from './adicionar-lancamento/adicionar-lancamento.component';
import { EditarLancamentoComponent } from './editar-lancamento/editar-lancamento.component';
import { ExcluirLancamentoComponent } from './excluir-lancamento/excluir-lancamento.component';
import { ReativarLancamentoComponent } from './reativar-lancamento/reativar-lancamento.component';

// services
import { LancamentoService } from './lancamento.service';

// config
import { lancamentoRouterConfig } from './lancamento.routes';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';


// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

import { MyDatePickerModule } from 'mydatepicker';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    //allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: " ",
    suffix: "",
    thousands: "."
};

@NgModule({
    imports: [
    //    SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(lancamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        CurrencyMaskModule,
        MultiselectDropdownModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        MyDatePickerModule 
    ],
    declarations: [
        LancamentoComponent,
        ListaLancamentoComponent,
        AdicionarLancamentoComponent,
        EditarLancamentoComponent,
        ExcluirLancamentoComponent,
        ReativarLancamentoComponent
    ],
    providers: [
        MaskService,
        LancamentoService,        
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule ]
})

export class LancamentoModule { }
