import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from "angular2-datatable";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { Ng2DragDropModule } from 'ng2-drag-drop';

// components
import { ChequeproprioComponent } from './chequeproprio.component';

// services
import { ChequeProprioService } from './chequeproprio.service';

// config
import { chequeProprioRouterConfig } from './chequeproprio.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

// Master-Detail DevExtreme
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';

import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { ListaChequeproprioComponent } from './lista-chequeproprio/lista-chequeproprio.component';
import { AdicionarChequetalaoComponent } from './adicionar-chequetalao/adicionar-chequetalao.component';
import { ListaChequefolhaComponent } from './lista-chequefolha/lista-chequefolha.component';
import { EditarChequetalaoComponent } from './editar-chequetalao/editar-chequetalao.component';
import { ListaChequefolhahistoricoComponent } from './lista-chequefolhahistorico/lista-chequefolhahistorico.component';
import { AdicionarChequehistoricoComponent } from './adicionar-chequehistorico/adicionar-chequehistorico.component';
import { HttpClientModule } from '@angular/common/http';
 
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
        RouterModule.forChild(chequeProprioRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        CurrencyMaskModule,
        Ng2DragDropModule.forRoot(),
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlDirectiveModule,
        DxDataGridModule,
        DxTemplateModule
    ],
    declarations: [
        ChequeproprioComponent,
        ListaChequeproprioComponent,
        AdicionarChequetalaoComponent,
        ListaChequefolhaComponent,
        EditarChequetalaoComponent,
        ListaChequefolhahistoricoComponent,
        AdicionarChequehistoricoComponent
    ],
    providers: [
        MaskService,
        ChequeProprioService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlDirectiveModule ]
})

export class ChequeProprioModule { }