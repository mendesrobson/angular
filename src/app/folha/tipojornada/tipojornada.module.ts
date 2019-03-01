import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TipojornadaComponent } from './tipojornada.component';
import { ListaTipojornadaComponent } from './lista-tipojornada/lista-tipojornada.component';
import { AdicionarTipojornadaComponent } from './adicionar-tipojornada/adicionar-tipojornada.component';
import { EditarTipojornadaComponent } from './editar-tipojornada/editar-tipojornada.component';
import { ExcluirTipojornadaComponent } from './excluir-tipojornada/excluir-tipojornada.component';

import { TipoJornadaService } from './tipojornada.service';
import { tipoJornadaRouterConfig } from './tipojornada.routes';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';
import { ReativarTipojornadaComponent } from './reativar-tipojornada/reativar-tipojornada.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoJornadaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        TipojornadaComponent,
        ListaTipojornadaComponent,
        AdicionarTipojornadaComponent,
        EditarTipojornadaComponent,
        ExcluirTipojornadaComponent,
        ReativarTipojornadaComponent
    ],
    providers: [
        TipoJornadaService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class TipoJornadaModule { }
