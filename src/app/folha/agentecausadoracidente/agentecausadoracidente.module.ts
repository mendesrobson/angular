import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

import { AdicionarAgentecausadoracidenteComponent } from './adicionar-agentecausadoracidente/adicionar-agentecausadoracidente.component';
import { ListaAgentecausadoracidenteComponent } from './lista-agentecausadoracidente/lista-agentecausadoracidente.component';
import { EditarAgentecausadoracidenteComponent } from './editar-agentecausadoracidente/editar-agentecausadoracidente.component';
import { ExcluirAgentecausadoracidenteComponent } from './excluir-agentecausadoracidente/excluir-agentecausadoracidente.component';
import { ReativarAgentecausadoracidenteComponent } from './reativar-agentecausadoracidente/reativar-agentecausadoracidente.component';
import { AgentecausadoracidenteComponent } from './agentecausadoracidente.component';
import { AgenteCausadorAcidenteService } from './agentecausadoracidente.service';
import { agentecausadoracidenteRouterConfig } from './agentecausadoracidente.routes';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
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
        RouterModule.forChild(agentecausadoracidenteRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        AgentecausadoracidenteComponent,
        AdicionarAgentecausadoracidenteComponent,
        ListaAgentecausadoracidenteComponent,
        EditarAgentecausadoracidenteComponent,
        ExcluirAgentecausadoracidenteComponent,
        ReativarAgentecausadoracidenteComponent
    ],
    providers: [
        AgenteCausadorAcidenteService,
       { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class AgenteCausadorAcidenteModule { }
