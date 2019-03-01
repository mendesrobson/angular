import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//components
import { EmpresaComponent } from './empresa.component';
import { ListaEmpresaComponent } from './lista-empresa/lista-empresa.component';
import { AdicionarEmpresaComponent } from './adicionar-empresa/adicionar-empresa.component';
import { EditarEmpresaComponent } from './editar-empresa/editar-empresa.component';
import { ExcluirEmpresaComponent } from './excluir-empresa/excluir-empresa.component';
import { ReativarEmpresaComponent } from './reativar-empresa/reativar-empresa.component';

// config
import { empresaRouterConfig } from './empresa.routes';

//services
import { EmpresaService } from './empresa.service';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    //SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(empresaRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    TextMaskModule,
    DisableControlDirectiveModule
  ],
  declarations: [
    EmpresaComponent,
    ListaEmpresaComponent,
    AdicionarEmpresaComponent,
    EditarEmpresaComponent,
    ExcluirEmpresaComponent,
    ReativarEmpresaComponent
  ],
  providers: [
    EmpresaService
  ],
  exports: [RouterModule,
    DisableControlDirectiveModule,
    DataFilterPipeModule]
})
export class EmpresaModule { }
