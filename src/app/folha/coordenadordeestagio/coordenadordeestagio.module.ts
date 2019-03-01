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

import { CoordenadorDeEstagioComponent } from './coordenadordeestagio.component';
import { AdicionarCoordenadorDeEstagioComponent } from './adicionar-coordenadordeestagio/adicionar-coordenadordeestagio.component';
import { EditarCoordenadorDeEstagioComponent } from './editar-coordenadordeestagio/editar-coordenadordeestagio.component';
import { ExcluirCoordenadorDeEstagioComponent } from './excluir-coordenadordeestagio/excluir-coordenadordeestagio.component';
import { ListaCoordenadorDeEstagioComponent } from './lista-coordenadordeestagio/lista-coordenadordeestagio.component';
import { ReativarCoordenadorDeEstagioComponent } from './reativar-coordenadordeestagio/reativar-coordenadordeestagio.component';

import { CoordenadorDeEstagioService } from './coordenadordeestagio.service';
import { coordenadorDeEstagioRouterConfig } from './coordenadordeestagio.routes';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(coordenadorDeEstagioRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        TextMaskModule
    ],
    declarations: [
        CoordenadorDeEstagioComponent,
        AdicionarCoordenadorDeEstagioComponent,
        EditarCoordenadorDeEstagioComponent,
        ExcluirCoordenadorDeEstagioComponent,
        ListaCoordenadorDeEstagioComponent,
        ReativarCoordenadorDeEstagioComponent
    ],
    providers: [
        CoordenadorDeEstagioService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class CoordenadorDeEstagioModule { }