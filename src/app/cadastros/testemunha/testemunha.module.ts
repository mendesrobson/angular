import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { TestemunhaComponent } from './testemunha.component';
import { ListaTestemunhaComponent } from './lista-testemunha/lista-testemunha.component';
import { AdicionarTestemunhaComponent } from './adicionar-testemunha/adicionar-testemunha.component';
import { EditarTestemunhaComponent } from './editar-testemunha/editar-testemunha.component';
import { ExcluirTestemunhaComponent } from './excluir-testemunha/excluir-testemunha.component';
import { ReativarTestemunhaComponent } from './reativar-testemunha/reativar-testemunha.component';

// services
import { TestemunhaService } from './testemunha.service';

// config
import { testemunhaRouterConfig } from './testemunha.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';

// utils

import { DataTableModule } from "angular2-datatable";
import { MaskService } from '../../services/mask.service';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";

@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(testemunhaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        NgxPaginationModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        TestemunhaComponent,
        ListaTestemunhaComponent,
        AdicionarTestemunhaComponent,
        EditarTestemunhaComponent,
        ExcluirTestemunhaComponent,
        ReativarTestemunhaComponent
    ],
    providers: [
        MaskService,
        TestemunhaService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule ]
})

export class TestemunhaModule { }