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


import { TipodeficienciaComponent } from './tipodeficiencia.component';
import { AdicionarTipodeficienciaComponent } from './adicionar-tipodeficiencia/adicionar-tipodeficiencia.component';
import { EditarTipodeficienciaComponent } from './editar-tipodeficiencia/editar-tipodeficiencia.component';
import { ExcluirTipodeficienciaComponent } from './excluir-tipodeficiencia/excluir-tipodeficiencia.component';
import { ListaTipodeficienciaComponent } from './lista-tipodeficiencia/lista-tipodeficiencia.component';
import { ReativarTipodeficienciaComponent } from './reativar-tipodeficiencia/reativar-tipodeficiencia.component';

import { TipoDeficienciaService } from './tipodeficiencia.service';
import { tipoDeficienciaRouterConfig } from './tipodeficiencia.routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoDeficienciaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        TipodeficienciaComponent,
        AdicionarTipodeficienciaComponent,
        EditarTipodeficienciaComponent,
        ExcluirTipodeficienciaComponent,
        ListaTipodeficienciaComponent,
        ReativarTipodeficienciaComponent],
    providers: [
        TipoDeficienciaService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class TipoDeficienciaModule { }
