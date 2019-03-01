import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "angular2-datatable";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';



// components
import { TituloComponent } from './titulo.component';
import { ListaTituloComponent } from './lista-titulo/lista-titulo.component';
import { AdicionarTituloComponent } from './adicionar-titulo/adicionar-titulo.component';
import { EditarTituloComponent } from './editar-titulo/editar-titulo.component';
import { ExcluirTituloComponent } from './excluir-titulo/excluir-titulo.component';
import { ReativarTituloComponent } from './reativar-titulo/reativar-titulo.component';
import { AdicionarTitulodescontoComponent } from './adicionar-titulodesconto/adicionar-titulodesconto.component';
import { ListaTitulodescontoComponent } from './lista-titulodesconto/lista-titulodesconto.component';
import { EditarTitulodescontoComponent } from './editar-titulodesconto/editar-titulodesconto.component';
import { ListaTitulocentrocustoComponent } from './lista-titulocentrocusto/lista-titulocentrocusto.component';
import { ListaTitulocentroresultadoComponent } from './lista-titulocentroresultado/lista-titulocentroresultado.component';
import { EditarTitulocentrocustoComponent } from './editar-titulocentrocusto/editar-titulocentrocusto.component';
import { EditarTitulocentroresultadoComponent } from './editar-titulocentroresultado/editar-titulocentroresultado.component';
import { AdicionarTitulocentroresultadoComponent } from './adicionar-titulocentroresultado/adicionar-titulocentroresultado.component';
import { AdicionarTitulocentrocustoComponent } from './adicionar-titulocentrocusto/adicionar-titulocentrocusto.component';
import { AdicionarTituloparcelaComponent } from './adicionar-tituloparcela/adicionar-tituloparcela.component';
import { ListaTituloparcelaComponent } from './lista-tituloparcela/lista-tituloparcela.component';
import { EditarTituloparcelaComponent } from './editar-tituloparcela/editar-tituloparcela.component';
import { ListaTituloparceladescontoComponent } from './lista-tituloparceladesconto/lista-tituloparceladesconto.component';
import { AdicionarTituloparceladescontoComponent } from './adicionar-tituloparceladesconto/adicionar-tituloparceladesconto.component';

// services
import { TituloService } from './titulo.service';

// config
import { tituloRouterConfig } from './titulo.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { ListaTituloparcelaapropriacaoComponent } from './lista-tituloparcelaapropriacao/lista-tituloparcelaapropriacao.component';
import { EditarTituloparceladescontoComponent } from './editar-tituloparceladesconto/editar-tituloparceladesconto.component';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

// import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule, DxDateBoxModule, DxTagBoxModule, DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';


//import { DialogComponent } from './dialog/dialog.component';

 
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
        RouterModule.forChild(tituloRouterConfig),
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
        // BrowserModule,
        DxDataGridModule,
        DxSelectBoxModule,
        DxDropDownBoxModule,
        DxDateBoxModule,
        DxTagBoxModule
    ],
    declarations: [
        TituloComponent,
        ListaTituloComponent,
        AdicionarTituloComponent,
        EditarTituloComponent,
        ExcluirTituloComponent,
        ReativarTituloComponent,
        AdicionarTitulodescontoComponent,
        ListaTitulodescontoComponent,
        ListaTitulocentrocustoComponent,
        ListaTitulocentroresultadoComponent,
        EditarTitulocentrocustoComponent,
        EditarTitulocentroresultadoComponent,
        AdicionarTitulocentroresultadoComponent,
        AdicionarTitulocentrocustoComponent,
        EditarTitulodescontoComponent,
        ListaTituloparcelaComponent,
        EditarTituloparcelaComponent,
        AdicionarTituloparcelaComponent,
        ListaTituloparceladescontoComponent,
        ListaTituloparcelaapropriacaoComponent,
        AdicionarTituloparceladescontoComponent,
        EditarTituloparceladescontoComponent/*,
        DialogComponent*/
    ],
    providers: [
        MaskService,
        TituloService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
        DatePipe
        
    ],
    bootstrap: [TituloComponent,
        ListaTituloComponent,
        AdicionarTituloComponent,
        EditarTituloComponent,
        ExcluirTituloComponent,
        ReativarTituloComponent,
        AdicionarTitulodescontoComponent,
        ListaTitulodescontoComponent,
        ListaTitulocentrocustoComponent,
        ListaTitulocentroresultadoComponent,
        EditarTitulocentrocustoComponent,
        EditarTitulocentroresultadoComponent,
        AdicionarTitulocentroresultadoComponent,
        AdicionarTitulocentrocustoComponent,
        EditarTitulodescontoComponent,
        ListaTituloparcelaComponent,
        EditarTituloparcelaComponent,
        AdicionarTituloparcelaComponent,
        ListaTituloparceladescontoComponent,
        ListaTituloparcelaapropriacaoComponent,
        AdicionarTituloparceladescontoComponent,
        EditarTituloparceladescontoComponent/*,
        DialogComponent*/],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        DisableControlDirectiveModule ]
})

export class TituloModule { }

// platformBrowserDynamic().bootstrapModule(TituloModule);