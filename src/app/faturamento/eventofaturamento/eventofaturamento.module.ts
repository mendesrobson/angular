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
import { EventoFaturamentoComponent } from './eventofaturamento.component';
import { ListaEventoFaturamentoComponent } from './lista-eventofaturamento/lista-eventofaturamento.component';
import { AdicionarEventoFaturamentoComponent } from './adicionar-eventofaturamento/adicionar-eventofaturamento.component';
import { EditarEventoFaturamentoComponent } from './editar-eventofaturamento/editar-eventofaturamento.component';
import { ExcluirEventoFaturamentoComponent } from './excluir-eventofaturamento/excluir-eventofaturamento.component';
import { ReativarEventoFaturamentoComponent } from './reativar-eventofaturamento/reativar-eventofaturamento.component';


// services
import { EventoFaturamentoService } from './eventofaturamento.service';

// config
import { eventoFaturamentoRouterConfig } from './eventofaturamento.routes';


// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";



 
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
   // allowZero: true,
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
        RouterModule.forChild(eventoFaturamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        CurrencyMaskModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        EventoFaturamentoComponent,
        ListaEventoFaturamentoComponent,
        AdicionarEventoFaturamentoComponent,
        EditarEventoFaturamentoComponent,
        ExcluirEventoFaturamentoComponent,
        ReativarEventoFaturamentoComponent
    ],
    providers: [
        MaskService,
        EventoFaturamentoService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule ]
})

export class EventoFaturamentoModule { }