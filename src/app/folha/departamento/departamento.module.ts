import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarDepartamentoComponent } from './adicionar-departamento/adicionar-departamento.component';
import { EditarDepartamentoComponent } from './editar-departamento/editar-departamento.component';
import { ExcluirDepartamentoComponent } from './excluir-departamento/excluir-departamento.component';
import { ListaDepartamentoComponent } from './lista-departamento/lista-departamento.component';
import { ReativarDepartamentoComponent } from './reativar-departamento/reativar-departamento.component';
import { DepartamentoService } from './departamento.service';
import { RouterModule } from '@angular/router';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DataTableModule } from 'angular2-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DepartamentoRouterConfig } from './departamento.routes';
import { HttpClientModule } from '@angular/common/http';
import { DepartamentoComponent } from './departamento.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(DepartamentoRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule
  ],
  declarations: [
    DepartamentoComponent,
    AdicionarDepartamentoComponent, 
    EditarDepartamentoComponent, 
    ExcluirDepartamentoComponent, 
    ListaDepartamentoComponent, 
    ReativarDepartamentoComponent],
    providers: [
      DepartamentoService
  ],
  exports: [
      RouterModule,
      DataFilterPipeModule,
      CheckBoxSetDirectiveModule,
      DisableControlDirectiveModule]
})
export class DepartamentoModule { }
