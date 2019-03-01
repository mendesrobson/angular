import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { TipoLogradouroComponent } from './tipologradouro.component';
import { ListaTipoLogradouroComponent } from './lista-tipologradouro/lista-tipologradouro.component';
import { AdicionarTipoLogradouroComponent } from './adicionar-tipologradouro/adicionar-tipologradouro.component';
import { EditarTipoLogradouroComponent } from './editar-tipologradouro/editar-tipologradouro.component';
import { ExcluirTipologradouroComponent } from './excluir-tipologradouro/excluir-tipologradouro.component';

// services
import { TipoLogradouroService } from './tipologradouro.service';

// config
import { tipoLogradouroRouterConfig } from './tipologradouro.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { ReativarTipologradouroComponent } from './reativar-tipologradouro/reativar-tipologradouro.component';



@NgModule({
    imports: [
        //SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoLogradouroRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        TipoLogradouroComponent,
        ListaTipoLogradouroComponent,
        AdicionarTipoLogradouroComponent,
        EditarTipoLogradouroComponent,
        ExcluirTipologradouroComponent,
        ReativarTipologradouroComponent
    ],
    providers: [
        TipoLogradouroService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class TipoLogradouroModule { }