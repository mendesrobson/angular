import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';

import { UsuarioComponent } from './usuario.component';
import { ListaUsuarioComponent } from './lista-usuario/lista-usuario.component';
import { AdicionarUsuarioComponent } from './adicionar-usuario/adicionar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { ExcluirUsuarioComponent } from './excluir-usuario/excluir-usuario.component';
import { ReativarUsuarioComponent } from './reativar-usuario/reativar-usuario.component';
import { usuarioRouterConfig } from './usuario.routes';
import { UsuarioService } from './usuario.service';
import { ListaUsuarioTarefaComponent } from './lista-usuariotarefa/lista-usuariotarefa.component';
import { CheckBoxSetDirectiveModule } from "../../diretivas/checkboxset.module";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(usuarioRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,        
        DxDataGridModule,
        DxButtonModule,
        DxSelectBoxModule
    ],
    declarations: [
        UsuarioComponent,
        ListaUsuarioComponent,
        AdicionarUsuarioComponent,
        EditarUsuarioComponent,
        ExcluirUsuarioComponent,
        ReativarUsuarioComponent,
        ListaUsuarioTarefaComponent,
        RedefinirSenhaComponent
    ],
    providers: [
        UsuarioService
    ],
    bootstrap: [
        UsuarioComponent,
        ListaUsuarioComponent,
        AdicionarUsuarioComponent,
        EditarUsuarioComponent,
        ExcluirUsuarioComponent,
        ReativarUsuarioComponent,
        ListaUsuarioTarefaComponent,
        RedefinirSenhaComponent
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule]
})

export class UsuarioModule { }