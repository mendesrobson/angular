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

import { SindicatoComponent } from './sindicato.component';
import { AdicionarSindicatoComponent } from './adicionar-sindicato/adicionar-sindicato.component';
import { EditarSindicatoComponent } from './editar-sindicato/editar-sindicato.component';
import { ExcluirSindicatoComponent } from './excluir-sindicato/excluir-sindicato.component';
import { ListaSindicatoComponent } from './lista-sindicato/lista-sindicato.component';
import { ReativarSindicatoComponent } from './reativar-sindicato/reativar-sindicato.component';
import { ListaSindicatocargoComponent } from './lista-sindicatocargo/lista-sindicatocargo.component';
import { AdicionarSindicatocargoComponent } from './adicionar-sindicatocargo/adicionar-sindicatocargo.component';

import { SindicatoService } from './sindicato.service';
import { sindicatoRouterConfig } from './sindicato.routes';
import { AdicionarSindicatoconvencaoComponent } from './adicionar-sindicatoconvencao/adicionar-sindicatoconvencao.component';
import { ListaSindicatoconvencaoComponent } from './lista-sindicatoconvencao/lista-sindicatoconvencao.component';
import { EditarSindicatoconvencaoComponent } from './editar-sindicatoconvencao/editar-sindicatoconvencao.component';
import { AdicionarDiretoriasindicalComponent } from './adicionar-diretoriasindical/adicionar-diretoriasindical.component';
import { EditarDiretoriasindicalComponent } from './editar-diretoriasindical/editar-diretoriasindical.component';
import { ListaDiretoriasindicalComponent } from './lista-diretoriasindical/lista-diretoriasindical.component';
import { AdicionarBaseterritorialsindicatoComponent } from './adicionar-baseterritorialsindicato/adicionar-baseterritorialsindicato.component';
import { EditarBaseterritorialsindicatoComponent } from './editar-baseterritorialsindicato/editar-baseterritorialsindicato.component';
import { ListaBaseterritorialsindicatoComponent } from './lista-baseterritorialsindicato/lista-baseterritorialsindicato.component';
import { MyDatePickerModule } from 'mydatepicker';
import { DxDateBoxModule } from 'devextreme-angular';


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
        RouterModule.forChild(sindicatoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        TextMaskModule,
        CurrencyMaskModule,
        MyDatePickerModule,
        DxDateBoxModule
    ],
    declarations: [
    SindicatoComponent,
    AdicionarSindicatoComponent,
    EditarSindicatoComponent,
    ExcluirSindicatoComponent,
    ListaSindicatoComponent,
    ReativarSindicatoComponent,
    ListaSindicatocargoComponent,
    AdicionarSindicatocargoComponent,
    AdicionarSindicatoconvencaoComponent,
    ListaSindicatoconvencaoComponent,
    EditarSindicatoconvencaoComponent,
    AdicionarDiretoriasindicalComponent,
    EditarDiretoriasindicalComponent,
    ListaDiretoriasindicalComponent,
    AdicionarBaseterritorialsindicatoComponent,
    EditarBaseterritorialsindicatoComponent,
    ListaBaseterritorialsindicatoComponent],
    providers: [
        SindicatoService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class SindicatoModule{}