import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TipoBeneficioService } from './tipobeneficio.service';
import { tipoBeneficioRouterConfig } from './tipobeneficio.routes';

import { TipoBeneficioComponent } from './tipobeneficio.component';
import { ListaTipoBeneficioComponent } from './lista-tipobeneficio/lista-tipobeneficio.component';

import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';
import { AdicionarTipoBeneficioComponent } from './adicionar-tipobeneficio/adicionar-tipobeneficio.component';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { EditarTipoBeneficioComponent } from './editar-tipobeneficio/editar-tipobeneficio.component';
import { ExcluirTipoBeneficioComponent } from './excluir-tipobeneficio/excluir-tipobeneficio.component';
import { ReativarTipoBeneficioComponent } from './reativar-tipobeneficio/reativar-tipobeneficio.component';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';

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
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoBeneficioRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CurrencyMaskModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule 
    ],
    declarations: [
        TipoBeneficioComponent,
        ListaTipoBeneficioComponent,
        AdicionarTipoBeneficioComponent,
        EditarTipoBeneficioComponent,
        ExcluirTipoBeneficioComponent,
        ReativarTipoBeneficioComponent
    ],
    providers: [
        TipoBeneficioService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        OnlyNumberDirectiveModule,
        DataFilterPipeModule]
})

export class TipoBeneficioModule { }

