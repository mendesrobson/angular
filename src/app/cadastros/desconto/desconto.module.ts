import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
// components
import { DescontoComponent } from './desconto.component';
import { ListaDescontoComponent } from './lista-desconto/lista-desconto.component';
import { AdicionarDescontoComponent } from './adicionar-desconto/adicionar-desconto.component';
import { EditarDescontoComponent } from './editar-desconto/editar-desconto.component';
import { ExcluirDescontoComponent } from './excluir-desconto/excluir-desconto.component';
import { ReativarDescontoComponent } from './reativar-desconto/reativar-desconto.component';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';

// services
import { DescontoService } from './desconto.service';

// config
import { DescontoRouterConfig } from './desconto.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

// utils
import { DataTableModule } from "angular2-datatable";
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MaskService } from '../../services/mask.service';
import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';

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
   // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(DescontoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        OnlyNumberDirectiveModule,
        TextMaskModule,
        CurrencyMaskModule,
    ],
    declarations: [
        DescontoComponent,
        ListaDescontoComponent,
        AdicionarDescontoComponent,
        EditarDescontoComponent,
        ExcluirDescontoComponent,
        ReativarDescontoComponent
    ],
    providers: [      
      MaskService,
      DescontoService,
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlDirectiveModule,
        DisableControlCheckBoxDirectiveModule]
})

export class DescontoModule { }
