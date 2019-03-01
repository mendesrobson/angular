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

import { TipohorariotrabalhoComponent } from './tipohorariotrabalho.component';
import { AdicionarTipohorariotrabalhoComponent } from './adicionar-tipohorariotrabalho/adicionar-tipohorariotrabalho.component';
import { EditarTipohorariotrabalhoComponent } from './editar-tipohorariotrabalho/editar-tipohorariotrabalho.component';
import { ExcluirTipohorariotrabalhoComponent } from './excluir-tipohorariotrabalho/excluir-tipohorariotrabalho.component';
import { ListaTipohorariotrabalhoComponent } from './lista-tipohorariotrabalho/lista-tipohorariotrabalho.component';
import { ReativarTipohorariotrabalhoComponent } from './reativar-tipohorariotrabalho/reativar-tipohorariotrabalho.component';

import { TipoHorarioTrabalhoService } from './tipohorariotrabalho.service';
import { tipoHorarioTrabalhoRouterConfig } from './tipohorariotrabalho.routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoHorarioTrabalhoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        TipohorariotrabalhoComponent,
        AdicionarTipohorariotrabalhoComponent,
        EditarTipohorariotrabalhoComponent,
        ExcluirTipohorariotrabalhoComponent,
        ListaTipohorariotrabalhoComponent,
        ReativarTipohorariotrabalhoComponent
    ],
    providers: [
        TipoHorarioTrabalhoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class TipoHorarioTrabalhoModule { }