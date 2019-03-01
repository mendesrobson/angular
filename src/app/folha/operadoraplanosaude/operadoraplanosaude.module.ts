import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';

import { OperadoraplanosaudeComponent } from './operadoraplanosaude.component';
import { AdicionarOperadoraPlanoSaudeComponent } from './adicionar-operadoraplanosaude/adicionar-operadoraplanosaude.component';
import { EditarOperadoraPlanoSaudeComponent } from './editar-operadoraplanosaude/editar-operadoraplanosaude.component';
import { ExcluirOperadoraPlanoSaudeComponent } from './excluir-operadoraplanosaude/excluir-operadoraplanosaude.component';
import { ListaOperadoraPlanoSaudeComponent } from './lista-operadoraplanosaude/lista-operadoraplanosaude.component';
import { ReativarOperadoraPlanoSaudeComponent } from './reativar-operadoraplanosaude/reativar-operadoraplanosaude.component';


import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';

import {OperadoraPlanoSaudeService} from './operadoraplanosaude.service';
import { OperadoraPlanoSaudeRouterConfig } from './operadoraplanosaude.routes';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';


@NgModule({
    imports: [
    CommonModule,
        FormsModule,
        RouterModule.forChild(OperadoraPlanoSaudeRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        OperadoraplanosaudeComponent,
        AdicionarOperadoraPlanoSaudeComponent,
        EditarOperadoraPlanoSaudeComponent,
        ExcluirOperadoraPlanoSaudeComponent,
        ListaOperadoraPlanoSaudeComponent,
        ReativarOperadoraPlanoSaudeComponent,
    ],
    providers: [
        OperadoraPlanoSaudeService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule]
})

export class OperadoraPlanoSaudeModule { }
