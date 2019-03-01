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
import { ContaCorrenteComponent } from './contacorrente.component';
import { ListaContaCorrenteComponent } from './lista-contacorrente/lista-contacorrente.component';
import { AdicionarContaCorrenteComponent } from './adicionar-contacorrente/adicionar-contacorrente.component';
import { EditarContaCorrenteComponent } from './editar-contacorrente/editar-contacorrente.component';
import { ExcluirContaCorrenteComponent } from './excluir-contacorrente/excluir-contacorrente.component';
import { ReativarContaCorrenteComponent } from './reativar-contacorrente/reativar-contacorrente.component';
import { AdicionarDadosCobrancaComponent } from './adicionar-dadoscobranca/adicionar-dadoscobranca.component';
import { ListaDadosCobrancaComponent } from './lista-dadoscobranca/lista-dadoscobranca.component';
import { EditarDadosCobrancaComponent } from './editar-dadoscobranca/editar-dadoscobranca.component';
import { ListaContaSaldoComponent } from './lista-contasaldo/lista-contasaldo.component';

// services
import { ContaCorrenteService } from './contacorrente.service';

// config
import { contaCorrenteRouterConfig } from './contacorrente.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { HttpClientModule } from '@angular/common/http';
import { ListaContaCaixaComponent } from './lista-contacaixa/lista-contacaixa.component';

 
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
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(contaCorrenteRouterConfig),
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
        DisableControlDirectiveModule
    ],
    declarations: [
        ContaCorrenteComponent,
        ListaContaCorrenteComponent,
        AdicionarContaCorrenteComponent,
        EditarContaCorrenteComponent,
        ExcluirContaCorrenteComponent,
        ReativarContaCorrenteComponent,
        AdicionarDadosCobrancaComponent,
        ListaDadosCobrancaComponent,
        EditarDadosCobrancaComponent,
        ListaContaCaixaComponent,
        ListaContaSaldoComponent
    ],
    providers: [
        MaskService,
        ContaCorrenteService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule ]
})

export class ContaCorrenteModule { }