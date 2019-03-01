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
import { CategoriaContaReceberComponent } from "./categoriacontareceber.component";
import { ListaCategoriaContaReceberComponent } from "./lista-categoriacontareceber/lista-categoriacontareceber.component";
import { AdicionarCategoriaContaReceberComponent } from "./adicionar-categoriacontareceber/adicionar-categoriacontareceber.component";
import { EditarCategoriaContaReceberComponent } from "./editar-categoriacontareceber/editar-categoriacontareceber.component";
import { ExcluirCategoriaContaReceberComponent } from "./excluir-categoriacontareceber/excluir-categoriacontareceber.component";
import { ReativarCategoriaContaReceberComponent } from "./reativar-categoriacontareceber/reativar-categoriacontareceber.component";

// services
import { CategoriaContaReceberService } from "./categoriacontareceber.service";

// config
import { categoriaContaReceberRouterConfig } from "./categoriacontareceber.routes";

import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(categoriaContaReceberRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule
    ],
    declarations: [
        CategoriaContaReceberComponent,
        ListaCategoriaContaReceberComponent,
        AdicionarCategoriaContaReceberComponent,
        EditarCategoriaContaReceberComponent,
        ExcluirCategoriaContaReceberComponent,
        ReativarCategoriaContaReceberComponent,
    ],
    providers: [
        MaskService,
        CategoriaContaReceberService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule ]
})

export class CategoriaContaReceberModule { }