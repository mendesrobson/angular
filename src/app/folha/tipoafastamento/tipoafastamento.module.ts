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

import { TipoafastamentoComponent } from './tipoafastamento.component';
import { AdicionarTipoafastamentoComponent } from './adicionar-tipoafastamento/adicionar-tipoafastamento.component';
import { EditarTipoafastamentoComponent } from './editar-tipoafastamento/editar-tipoafastamento.component';
import { ExcluirTipoafastamentoComponent } from './excluir-tipoafastamento/excluir-tipoafastamento.component';
import { ListaTipoafastamentoComponent } from './lista-tipoafastamento/lista-tipoafastamento.component';
import { ReativarTipoafastamentoComponent } from './reativar-tipoafastamento/reativar-tipoafastamento.component';

import { TipoAfastamentoService } from './tipoafastamento.service';
import { tipoAfastamentoRouterConfig } from './tipoafastamento.routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoAfastamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
    TipoafastamentoComponent,
    AdicionarTipoafastamentoComponent,
    EditarTipoafastamentoComponent,
    ExcluirTipoafastamentoComponent,
    ListaTipoafastamentoComponent,
    ReativarTipoafastamentoComponent],
    providers: [
        TipoAfastamentoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class TipoAfastamentoModule{}