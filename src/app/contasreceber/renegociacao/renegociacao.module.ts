import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { renegociacaoRouterConfig } from './renegociacao.routes';
import { DataTableModule } from "ng2-data-table";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { RenegociacaoComponent } from './renegociacao.component';
import { RenegociacaoService } from './renegociacao.service';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { SelectModule } from 'ng2-select';
//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ListaRenegociacaoComponent } from './lista-renegociacao/lista-renegociacao.component';
import { AdicionarRenegociacaoComponent } from './adicionar-renegociacao/adicionar-renegociacao.component';
import { FiltroRenegociacaoparcelaComponent } from './filtro-renegociacaoparcela/filtro-renegociacaoparcela.component';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { EditarRenegociacaoComponent } from './editar-renegociacao/editar-renegociacao.component';
import { EditarTituloparcelaComponent } from './editar-tituloparcela/editar-tituloparcela.component';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { TextMaskModule } from 'angular2-text-mask';
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
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(renegociacaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        CurrencyMaskModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        DisableControlDirectiveModule,
        MyDatePickerModule,
        BusyModule,
        AngularMultiSelectModule                              
    ],
    declarations: [
        RenegociacaoComponent,
        ListaRenegociacaoComponent,
        AdicionarRenegociacaoComponent,
        FiltroRenegociacaoparcelaComponent,
        EditarRenegociacaoComponent,
        EditarTituloparcelaComponent
    ],
    providers: [
        RenegociacaoService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        CheckBoxSetDirectiveModule,
        DataFilterPipeModule,
        DisableControlCheckBoxDirectiveModule,
        DisableControlDirectiveModule ]
})

export class RenegociacaoModule { }