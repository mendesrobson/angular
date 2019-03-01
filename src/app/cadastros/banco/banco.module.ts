import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// components
import { BancoComponent } from './banco.component';
import { ListaBancoComponent } from './lista-banco/lista-banco.component';
import { AdicionarBancoComponent } from './adicionar-banco/adicionar-banco.component';
import { EditarBancoComponent } from './editar-banco/editar-banco.component';
import { ExcluirBancoComponent } from './excluir-banco/excluir-banco.component';
import { ReativarBancoComponent } from './reativar-banco/reativar-banco.component';

// services
import { BancoService } from './banco.service';

// config
import { bancoRouterConfig } from './banco.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        //SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(bancoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule
    ],
    declarations: [
        BancoComponent,
        ListaBancoComponent,
        AdicionarBancoComponent,
        EditarBancoComponent,
        ExcluirBancoComponent,
        ReativarBancoComponent
    ],
    providers: [
      BancoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class BancoModule { }