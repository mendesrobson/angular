import { NgModule } from "@angular/core";

import { RouterModule } from "@angular/router";
//import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from "../../utils/datafilter.pipe.module";
import { SelectModule } from "ng2-select";

import { CheckBoxSetDirectiveModule } from "../../diretivas/checkboxset.module";
import { MaskService } from "../../services/mask.service";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { OnlyNumberDirectiveModule } from "../../diretivas/onlynumber.module";
import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";
import { TextMaskModule } from 'angular2-text-mask';

//components
import { MovimentoContaComponent } from "./movimentoconta.component";
import { ListaMovimentoContaComponent } from "./lista-movimentoconta/lista-movimentoconta.component";
import { AdicionarMovimentoContaComponent } from "./adicionar-movimentoconta/adicionar-movimentoconta.component";
import { ConsultaMovimentoContaComponent } from "./consulta-movimentoconta/consulta-movimentoconta.component";
import { ExcluirMovimentoContaComponent } from "./excluir-movimentoconta/excluir-movimentoconta.component";
import { ListaMovimentoContaCentroCustoComponent } from "./lista-movimentocontacentrocusto/lista-movimentocontacentrocusto.component";
import { ListaMovimentoContaCentroResultadoComponent } from "./lista-movimentocontacentroresultado/lista-movimentocontacentroresultado.component";
import { AdicionarMovimentoContaCentroCustoComponent } from "./adicionar-movimentocontacentrocusto/adicionar-movimentocontacentrocusto.component";
import { EditarMovimentoContaCentroCustoComponent } from "./editar-movimentocontacentrocusto/editar-movimentocontacentrocusto.component";
import { AdicionarMovimentoContaCentroResultadoComponent } from "./adicionar-movimentocontacentroresultado/adicionar-movimentocontacentroresultado.component";
import { EditarMovimentoContaCentroResultadoComponent } from "./editar-movimentocontacentroresultado/editar-movimentocontacentroresultado.component";
import { ListaMovimentoContaApropriacaoComponent } from "./lista-movimentocontaapropriacao/lista-movimentocontaapropriacao.component";

//service
import { MovimentoContaService } from "./movimentoconta.service";

//config
import { movimentoContaRouterConfig } from "./movimentoconta.routes";




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
    //    SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(movimentoContaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        CheckBoxSetDirectiveModule,
        CurrencyMaskModule,
        OnlyNumberDirectiveModule,
        DisableControlDirectiveModule,
        TextMaskModule
    ],
    declarations: [
        MovimentoContaComponent,
        ListaMovimentoContaComponent,
        AdicionarMovimentoContaComponent,
        ConsultaMovimentoContaComponent,
        ExcluirMovimentoContaComponent,
        ListaMovimentoContaCentroCustoComponent,
        ListaMovimentoContaCentroResultadoComponent,
        AdicionarMovimentoContaCentroCustoComponent,
        EditarMovimentoContaCentroCustoComponent,
        AdicionarMovimentoContaCentroResultadoComponent,
        EditarMovimentoContaCentroResultadoComponent,
        ListaMovimentoContaApropriacaoComponent
        
        
    ],
    providers: [
        MaskService,
        MovimentoContaService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule
    ]

})

export class MovimentoContaModule { }