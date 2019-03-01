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
import { ParametroFaturamentoComponent } from './parametrofaturamento.component';
import { ReativarParametroFaturamentoComponent } from './reativar-parametrofaturamento/reativar-parametrofaturamento.component';
import { ListaParametroFaturamentoComponent } from './lista-parametrofaturamento/lista-parametrofaturamento.component';
import { AdicionarParametroFaturamentoComponent } from './adicionar-parametrofaturamento/adicionar-parametrofaturamento.component';
import { ExcluirParametroFaturamentoComponent } from './excluir-parametrofaturamento/excluir-parametrofaturamento.component';
import { EditarParametroFaturamentoComponent } from './editar-parametrofaturamento/editar-parametrofaturamento.component';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';

// services
import { ParametroFaturamentoService } from './parametrofaturamento.service';

// config
import { parametroFaturamentoRouterConfig } from './parametrofaturamento.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';

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
        //SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(parametroFaturamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        CurrencyMaskModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        OnlyNumberDirectiveModule  
    ],
    declarations: [
        ParametroFaturamentoComponent,
        ListaParametroFaturamentoComponent,
        AdicionarParametroFaturamentoComponent,
        EditarParametroFaturamentoComponent,
        ExcluirParametroFaturamentoComponent,
        ReativarParametroFaturamentoComponent
    ],
    providers: [
        MaskService,
        ParametroFaturamentoService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlCheckBoxDirectiveModule
        ]
})

export class ParametroFaturamentoModule { }