import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { ConciliacaoBancariaComponent } from './conciliacaobancaria.component';
import { ListaConciliacaoBancariaComponent } from './lista-conciliacaobancaria/lista-conciliacaobancaria.component';
import { EditarConciliacaoBancariaComponent } from './editar-conciliacaobancaria/editar-conciliacaobancaria.component';

// services
import { ConciliacaoBancariaService } from './conciliacaobancaria.service';

// config
import { conciliacaobancariaRouterConfig } from './conciliacaobancaria.routes';

// my modules
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
//import { SharedModule } from '../shared/shared.module';
import { DataFilterPipeModule } from '../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../diretivas/checkboxset.module';
import { DxDateBoxModule } from 'devextreme-angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
  //  allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: " ",
    suffix: "",
    thousands: "."
};

@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(conciliacaobancariaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        TextMaskModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DxDateBoxModule,CurrencyMaskModule
    ],
    declarations: [
        ConciliacaoBancariaComponent,
        ListaConciliacaoBancariaComponent,
        EditarConciliacaoBancariaComponent    ],
    providers: [
      ConciliacaoBancariaService,
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule]
})

export class ConciliacaoBancariaModule { }