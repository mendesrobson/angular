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


import { AdicionarCidComponent } from './adicionar-cid/adicionar-cid.component';
import { ExcluirCidComponent } from './excluir-cid/excluir-cid.component';
import { EditarCidComponent } from './editar-cid/editar-cid.component';
import { ReativarCidComponent } from './reativar-cid/reativar-cid.component';
import { CidComponent } from './cid.component';
import { ListaCidComponent } from './lista-cid/lista-cid.component';
import { cidRouterConfig } from './cid.routes';
import { CidService } from './cid.service';

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
        RouterModule.forChild(cidRouterConfig),
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
    AdicionarCidComponent,
    ExcluirCidComponent,
    EditarCidComponent,
    ReativarCidComponent,
    CidComponent,
    ListaCidComponent],
    providers: [
       CidService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class CidModule { }
