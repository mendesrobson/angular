import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ParentescoComponent } from './parentesco.component';
import { ListaParentescoComponent } from './lista-parentesco/lista-parentesco.component';
import { AdicionarParentescoComponent } from './adicionar-parentesco/adicionar-parentesco.component';
import { EditarParentescoComponent } from './editar-parentesco/editar-parentesco.component';
import { ExcluirParentescoComponent } from './excluir-parentesco/excluir-parentesco.component';

import { ParentescoService } from './parentesco.service';
import { parentescoRouterConfig } from './parentesco.routes';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';
import { ReativarParentescoComponent } from './reativar-parentesco/reativar-parentesco.component';

import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(parentescoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        ParentescoComponent,
        ListaParentescoComponent,
        AdicionarParentescoComponent,
        EditarParentescoComponent,
        ExcluirParentescoComponent,
        ReativarParentescoComponent
    ],
    providers: [
        ParentescoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class ParentescoModule { }
