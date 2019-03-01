import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from "angular2-datatable";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';

// components
import { CategoriaContaPagarComponent } from './categoriacontapagar.component';
import { ListaCategoriaContaPagarComponent } from './lista-categoriacontapagar/lista-categoriacontapagar.component';
import { AdicionarCategoriaContaPagarComponent } from './adicionar-categoriacontapagar/adicionar-categoriacontapagar.component';
import { EditarCategoriaContaPagarComponent } from './editar-categoriacontapagar/editar-categoriacontapagar.component';
import { ExcluirCategoriaContaPagarComponent } from './excluir-categoriacontapagar/excluir-categoriacontapagar.component';
import { ReativarCategoriaContaPagarComponent } from './reativar-categoriacontapagar/reativar-categoriacontapagar.component';


// services
import { CategoriaContaPagarService } from './categoriacontapagar.service';

// config
import { categoriaContaPagarRouterConfig } from './categoriacontapagar.routes';

import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { HttpClientModule } from '@angular/common/http';
import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(categoriaContaPagarRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        CategoriaContaPagarComponent,
        ListaCategoriaContaPagarComponent,
        AdicionarCategoriaContaPagarComponent,
        EditarCategoriaContaPagarComponent,
        ExcluirCategoriaContaPagarComponent,
        ReativarCategoriaContaPagarComponent
    ],
    providers: [
        MaskService,
        CategoriaContaPagarService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule ]
})

export class CategoriaContaPagarModule { }