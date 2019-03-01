import { NgModule } from "@angular/core";
//import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

//service
import { TituloParcelaBaixaService } from "./tituloparcelabaixa.service";

//router
import { tituloParcelaBaixaRouterConfig } from "./tituloparcelabaixa.routes";

import { DataFilterPipeModule } from "../../utils/datafilter.pipe.module";
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "ng2-data-table";
import { MyDatePickerModule } from "mydatepicker";
import { BusyModule } from "angular2-busy";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { OnlyNumberDirectiveModule } from "../../diretivas/onlynumber.module";

//components
import { TituloParcelaBaixaComponent } from "./tituloparcelabaixa.component";
import { ListaTituloParcelaBaixaReceberComponent } from "./lista-tituloparcelabaixareceber/lista-tituloparcelabaixareceber.component";
import { SangriaCaixaComponent } from "./sangriacaixa/sangriacaixa.component";
import { LancamentoAvulsoReforcoComponent } from "./lancamentoavulsoreforco/lancamentoavulsoreforco.component";
import { ListaLancamentoCentroCustoComponent } from "./lista-lancamentocentrocusto/lista-lancamentocentrocusto.component";
import { ListaLancamentoCentroResultadoComponent } from "./lista-lancamentocentroresultado/lista-lancamentocentroresultado.component";
import { AdicionarLancamentoCentroCustoComponent } from "./adicionar-lancamentocentrocusto/adicionar-lancamentocentrocusto.component";
import { AdicionarLancamentoCentroResultadoComponent } from "./adicionar-lancamentocentroresultado/adicionar-lancamentocentroresultado.component";
import { EditarLancamentoCentroCustoComponent } from "./editar-lancamentocentrocusto/editar-lancamentocentrocusto.component";
import { EditarLancamentoCentroResultadoComponent } from "./editar-lancamentocentroresultado/editar-lancamentocentroresultado.component";
import { MaskService } from "../../services/mask.service";
import { AdicionarBaixaComponent } from './adicionar-baixa/adicionar-baixa.component';
import { FiltroBaixaparcelaComponent } from './filtro-baixaparcela/filtro-baixaparcela.component';
import { CheckBoxSetDirectiveModule } from "../../diretivas/checkboxset.module";
import { AdicionarBaixapgtoComponent } from './adicionar-baixapgto/adicionar-baixapgto.component';
import { ListaBaixapgtoComponent } from './lista-baixapgto/lista-baixapgto.component';
import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";
import { EditarBaixaComponent } from './editar-baixa/editar-baixa.component';
import { EditarBaixapgtoComponent } from './editar-baixapgto/editar-baixapgto.component';
import { ConsultarBaixapgtoComponent } from './consultar-baixapgto/consultar-baixapgto.component';
import { DxSelectBoxModule, DxDateBoxModule } from "devextreme-angular";
import { TextMaskModule } from 'angular2-text-mask';

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
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(tituloParcelaBaixaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        MyDatePickerModule,
        BusyModule,
        CurrencyMaskModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DxSelectBoxModule,DxDateBoxModule,
        TextMaskModule
    ],
    declarations: [
        TituloParcelaBaixaComponent,
        ListaTituloParcelaBaixaReceberComponent,
        SangriaCaixaComponent,
        LancamentoAvulsoReforcoComponent,
        ListaLancamentoCentroCustoComponent,
        ListaLancamentoCentroResultadoComponent,
        AdicionarLancamentoCentroCustoComponent,
        AdicionarLancamentoCentroResultadoComponent,
        EditarLancamentoCentroCustoComponent,
        EditarLancamentoCentroResultadoComponent,
        AdicionarBaixaComponent,
        FiltroBaixaparcelaComponent,
        AdicionarBaixapgtoComponent,
        ListaBaixapgtoComponent,
        EditarBaixaComponent,
        EditarBaixapgtoComponent,
        ConsultarBaixapgtoComponent
     ],
     providers: [
        MaskService,
         TituloParcelaBaixaService,
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

export class TituloParcelaBaixaModule { }