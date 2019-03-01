import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// components
import { CartaoComponent } from './cartao.component';
import { ListaCartaoComponent } from './lista-cartao/lista-cartao.component';
import { AdicionarCartaoComponent } from './adicionar-cartao/adicionar-cartao.component';
import { EditarCartaoComponent } from './editar-cartao/editar-cartao.component';
import { ExcluirCartaoComponent } from './excluir-cartao/excluir-cartao.component';
import { ReativarCartaoComponent } from './reativar-cartao/reativar-cartao.component';

// services
import { CartaoService } from './cartao.service';

// config
import { CartaoRouterConfig } from './cartao.routes';

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
import { HttpClientModule } from '@angular/common/http';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { DxSelectBoxModule } from 'devextreme-angular';

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
        RouterModule.forChild(CartaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        TextMaskModule,
        CurrencyMaskModule, 
        DxSelectBoxModule 
    ],
    declarations: [
        CartaoComponent,
        ListaCartaoComponent,
        AdicionarCartaoComponent,
        EditarCartaoComponent,
        ExcluirCartaoComponent,
        ReativarCartaoComponent
    ],
    providers: [      
      MaskService,
      CartaoService,
      { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlCheckBoxDirectiveModule]
})

export class CartaoModule { }
