import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';

import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

import { CurrencyMaskModule } from "ng2-currency-mask";

import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";


import { legislacaoRouterConfig } from './legislacao.routes';
import { ListaLegislacaoComponent } from './lista-legislacao/lista-legislacao.component';
import { AdicionarLegislacaoComponent } from './adicionar-legislacao/adicionar-legislacao.component';
import { ReativarLegislacaoComponent } from './reativar-legislacao/reativar-legislacao.component';
import { EditarLegislacaoComponent } from './editar-legislacao/editar-legislacao.component';
import { ExcluirLegislacaoComponent } from './excluir-legislacao/excluir-legislacao.component';
import { LegislacaoService } from './legislacao.service';
import { LegislacaoComponent } from './legislacao.component';
import { MyDatePickerModule } from 'mydatepicker';

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
    CommonModule,
        FormsModule,
        RouterModule.forChild(legislacaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        TextMaskModule,
        DisableControlDirectiveModule,
        MyDatePickerModule
    ],
    declarations: [
        ListaLegislacaoComponent,
        AdicionarLegislacaoComponent,
        ExcluirLegislacaoComponent,
        ReativarLegislacaoComponent,
        EditarLegislacaoComponent,
        LegislacaoComponent
    ],
    providers: [
       LegislacaoService,
       { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class LegislacaoModule { }
