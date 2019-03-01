import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// components
import { ConfiguracaopagamentoComponent } from './configuracaopagamento.component';
import { ListaConfiguracaopagamentoComponent } from './lista-configuracaopagamento/lista-configuracaopagamento.component';
import { AdicionarConfiguracaopagamentoComponent } from './adicionar-configuracaopagamento/adicionar-configuracaopagamento.component';
import { EditarConfiguracaopagamentoComponent } from './editar-configuracaopagamento/editar-configuracaopagamento.component';
import { ExcluirConfiguracaopagamentoComponent } from './excluir-configuracaopagamento/excluir-configuracaopagamento.component';
import { ReativarConfiguracaopagamentoComponent } from './reativar-configuracaopagamento/reativar-configuracaopagamento.component';

// services
import { ConfiguracaopagamentoService } from './configuracaopagamento.service';

// config
import { ConfiguracaopagamentoRouterConfig } from './configuracaopagamento.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MaskService } from '../../services/mask.service';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { HttpClientModule } from '@angular/common/http';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";

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
     //   SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(ConfiguracaopagamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        TextMaskModule,
        CurrencyMaskModule,
        OnlyNumberDirectiveModule,
        DxSelectBoxModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        ConfiguracaopagamentoComponent,
        ListaConfiguracaopagamentoComponent,
        AdicionarConfiguracaopagamentoComponent,
        EditarConfiguracaopagamentoComponent,
        ExcluirConfiguracaopagamentoComponent,
        ReativarConfiguracaopagamentoComponent,
        ListaConfiguracaopagamentoComponent,
        AdicionarConfiguracaopagamentoComponent,
        EditarConfiguracaopagamentoComponent,
        ExcluirConfiguracaopagamentoComponent,
        ReativarConfiguracaopagamentoComponent
    ],
    providers: [      
      MaskService,
      ConfiguracaopagamentoService,
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        OnlyNumberDirectiveModule]
})

export class ConfiguracaopagamentoModule { }