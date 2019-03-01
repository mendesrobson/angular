import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { UfComponent } from './uf.component';
import { ListaUfComponent } from './lista-uf/lista-uf.component';
import { AdicionarUfComponent } from './adicionar-uf/adicionar-uf.component';
import { EditarUfComponent } from './editar-uf/editar-uf.component';
import { ExcluirUfComponent } from './excluir-uf/excluir-uf.component';
import { ReativarUfComponent } from './reativar-uf/reativar-uf.component';

// services
import { UfService } from './uf.service';

// config
import { ufRouterConfig } from './uf.routes';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DxSelectBoxModule } from 'devextreme-angular';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(ufRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        DxSelectBoxModule
    ],
    declarations: [
        UfComponent,
        ListaUfComponent,
        AdicionarUfComponent,
        EditarUfComponent,
        ExcluirUfComponent,
        ReativarUfComponent
    ],
    providers: [
        UfService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class UfModule { }
