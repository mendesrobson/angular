import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { AgenciaComponent } from './agencia.component';
import { ListaAgenciaComponent } from './lista-agencia/lista-agencia.component';
import { AdicionarAgenciaComponent } from './adicionar-agencia/adicionar-agencia.component';
import { EditarAgenciaComponent } from './editar-agencia/editar-agencia.component';
import { ExcluirAgenciaComponent } from './excluir-agencia/excluir-agencia.component';
import { ReativarAgenciaComponent } from './reativar-agencia/reativar-agencia.component';

// services
import { AgenciaService } from './agencia.service';

// config
import { agenciaRouterConfig } from './agencia.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(agenciaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        AgenciaComponent,
        ListaAgenciaComponent,
        AdicionarAgenciaComponent,
        EditarAgenciaComponent,
        ExcluirAgenciaComponent,
        ReativarAgenciaComponent
    ],
    providers: [
      AgenciaService
    ],
    exports: [RouterModule,
        DisableControlDirectiveModule,
        DataFilterPipeModule]
})

export class AgenciaModule { }