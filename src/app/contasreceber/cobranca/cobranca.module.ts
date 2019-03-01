import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { cobrancaRouterConfig } from './cobranca.routes';
import { DataTableModule } from "ng2-data-table";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CobrancaComponent } from './cobranca.component';
import { CobrancaService } from './cobranca.service';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { SelectModule } from 'ng2-select';
//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { FiltroCobrancaparcelaComponent } from './filtro-cobrancaparcela/filtro-cobrancaparcela.component';
import { AdicionarCobrancacontatoComponent } from './adicionar-cobrancacontato/adicionar-cobrancacontato.component';
import { ListaCobrancacontatoComponent } from './lista-cobrancacontato/lista-cobrancacontato.component';
import { DxDateBoxModule, DxSelectBoxModule } from 'devextreme-angular';

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
    //    SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(cobrancaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        MyDatePickerModule,
        BusyModule,
        SelectModule,
        CurrencyMaskModule,
        CheckBoxSetDirectiveModule,
        //MultiselectDropdownModule,
        AngularMultiSelectModule,
        DxDateBoxModule,DxSelectBoxModule
    ],
    declarations: [
        CobrancaComponent,
        FiltroCobrancaparcelaComponent,
        AdicionarCobrancacontatoComponent,
        ListaCobrancacontatoComponent
    ],
    providers: [
        CobrancaService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        CheckBoxSetDirectiveModule,
        DataFilterPipeModule ]
})

export class CobrancaModule { }