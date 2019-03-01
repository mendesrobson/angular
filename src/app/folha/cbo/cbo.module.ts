import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { CboComponent } from './cbo.component';
import { ListaCboComponent } from './lista-cbo/lista-cbo.component';
import { AdicionarCboComponent } from './adicionar-cbo/adicionar-cbo.component';
import { EditarCboComponent } from './editar-cbo/editar-cbo.component';
import { ExcluirCboComponent } from './excluir-cbo/excluir-cbo.component';

// services
import { CboService } from './cbo.service';

// config
import { cboRouterConfig } from './cbo.routes';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { ReativarCboComponent } from './reativar-cbo/reativar-cbo.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(cboRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        CboComponent,
        ListaCboComponent,
        AdicionarCboComponent,
        EditarCboComponent,
        ExcluirCboComponent,
        ReativarCboComponent
    ],
    providers: [
        CboService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class CboModule { }
