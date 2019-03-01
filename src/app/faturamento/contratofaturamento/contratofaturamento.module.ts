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
import { ContratoFaturamentoComponent } from './contratofaturamento.component';
import { ListaContratoFaturamentoComponent } from './lista-contratofaturamento/lista-contratofaturamento.component';
import { AdicionarContratoFaturamentoComponent } from './adicionar-contratofaturamento/adicionar-contratofaturamento.component';
import { EditarContratoFaturamentoComponent } from './editar-contratofaturamento/editar-contratofaturamento.component';
import { ExcluirContratoFaturamentoComponent } from './excluir-contratofaturamento/excluir-contratofaturamento.component';
import { ReativarContratoFaturamentoComponent } from './reativar-contratofaturamento/reativar-contratofaturamento.component';


// services
import { ContratoFaturamentoService } from './contratofaturamento.service';

// config
import { contratoFaturamentoRouterConfig } from './contratofaturamento.routes';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { DxSelectBoxModule, DxDateBoxModule, DxTagBoxModule, DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';

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
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(contratoFaturamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        CurrencyMaskModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        OnlyNumberDirectiveModule,
        DxSelectBoxModule,
        DxDropDownBoxModule,
        DxDataGridModule,
        DxDateBoxModule,
        DxTagBoxModule
    ],
    declarations: [
        ContratoFaturamentoComponent,
        ListaContratoFaturamentoComponent,
        AdicionarContratoFaturamentoComponent,
        EditarContratoFaturamentoComponent,
        ExcluirContratoFaturamentoComponent,
        ReativarContratoFaturamentoComponent
    ],
    providers: [
        MaskService,
        ContratoFaturamentoService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        OnlyNumberDirectiveModule
     ]
})

export class ContratoFaturamentoModule { }