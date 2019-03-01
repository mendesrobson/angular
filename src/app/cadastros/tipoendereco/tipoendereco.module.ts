import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { TipoenderecoComponent } from './tipoendereco.component';
import { ListaTipoenderecoComponent } from './lista-tipoendereco/lista-tipoendereco.component';
import { AdicionarTipoenderecoComponent } from './adicionar-tipoendereco/adicionar-tipoendereco.component';
import { EditarTipoenderecoComponent } from './editar-tipoendereco/editar-tipoendereco.component';
import { ExcluirTipoenderecoComponent } from './excluir-tipoendereco/excluir-tipoendereco.component';
import { ReativarTipoenderecoComponent } from './reativar-tipoendereco/reativar-tipoendereco.component';

// services
import { TipoEnderecoService } from './tipoendereco.service';

// config
import { tipoenderecoRouterConfig } from './tipoendereco.routes';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoenderecoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        TipoenderecoComponent,
        ListaTipoenderecoComponent,
        AdicionarTipoenderecoComponent,
        EditarTipoenderecoComponent,
        ExcluirTipoenderecoComponent,
        ReativarTipoenderecoComponent
    ],
    providers: [
        TipoEnderecoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class TipoEnderecoModule { }
