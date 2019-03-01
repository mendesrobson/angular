import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { GrauInstrucaoComponent } from './grauinstrucao.component';
import { ListaGrauInstrucaoComponent } from './lista-grauinstrucao/lista-grauinstrucao.component';
import { AdicionarGrauInstrucaoComponent } from './adicionar-grauinstrucao/adicionar-grauinstrucao.component';
import { EditarGrauInstrucaoComponent } from './editar-grauinstrucao/editar-grauinstrucao.component';
import { ExcluirGrauInstrucaoComponent } from './excluir-grauinstrucao/excluir-grauinstrucao.component';
import { ReativarGrauInstrucaoComponent } from './reativar-grauinstrucao/reativar-grauinstrucao.component';


import { GrauInstrucaoService } from './grauinstrucao.service';
import { grauInstrucaoRouterConfig } from './grauinstrucao.routes';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(grauInstrucaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        GrauInstrucaoComponent,
        ListaGrauInstrucaoComponent,
        AdicionarGrauInstrucaoComponent,
        EditarGrauInstrucaoComponent,
        ExcluirGrauInstrucaoComponent,
        ReativarGrauInstrucaoComponent
    ],
    providers: [
        GrauInstrucaoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class GrauInstrucaoModule { }
