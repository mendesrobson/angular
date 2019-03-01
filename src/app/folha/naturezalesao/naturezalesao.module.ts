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

import { ReativarNaturezalesaoComponent } from './reativar-naturezalesao/reativar-naturezalesao.component';
import { ExcluirNaturezalesaoComponent } from './excluir-naturezalesao/excluir-naturezalesao.component';
import { EditarNaturezalesaoComponent } from './editar-naturezalesao/editar-naturezalesao.component';
import { NaturezalesaoComponent } from './naturezalesao.component';
import { ListaNaturezalesaoComponent } from './lista-naturezalesao/lista-naturezalesao.component';
import { naturezalesaoRouterConfig } from './naturezalesao.routes';
import { NaturezaLesaoService } from './naturezalesao.service';
import { AdicionarNaturezalesaoComponent } from './adicionar-naturezalesao/adicionar-naturezalesao.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
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
        RouterModule.forChild(naturezalesaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
     AdicionarNaturezalesaoComponent,
    ReativarNaturezalesaoComponent,
    ExcluirNaturezalesaoComponent,
    EditarNaturezalesaoComponent,
    NaturezalesaoComponent,
    ListaNaturezalesaoComponent],
    providers: [
        NaturezaLesaoService,
       { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class NaturezaLesaoModule { }
