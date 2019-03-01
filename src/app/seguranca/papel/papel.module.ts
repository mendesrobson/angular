import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { PapelComponent } from './papel.component';
import { ListaPapelComponent } from './lista-papel/lista-papel.component';
import { AdicionarPapelComponent } from './adicionar-papel/adicionar-papel.component';
import { VisualizarPapelComponent } from './visualizar-papel/visualizar-papel.component';

// services
import { PapelService } from './papel.service';

// config
import { papelRouterConfig } from './papel.route';

// utils
import { DataTableModule } from '../../../../node_modules/angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { ExcluirPapelComponent } from './excluir-papel/excluir-papel.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(papelRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        PapelComponent,
        ListaPapelComponent,
        AdicionarPapelComponent,
        VisualizarPapelComponent,
        ExcluirPapelComponent
    ],
    providers: [
        PapelService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class PapelModule { }
