import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarEquipprotecaoindividualComponent } from './adicionar-equipprotecaoindividual/adicionar-equipprotecaoindividual.component';
import { EditarEquipprotecaoindividualComponent } from './editar-equipprotecaoindividual/editar-equipprotecaoindividual.component';
import { ExcluirEquipprotecaoindividualComponent } from './excluir-equipprotecaoindividual/excluir-equipprotecaoindividual.component';
import { ListaEquipprotecaoindividualComponent } from './lista-equipprotecaoindividual/lista-equipprotecaoindividual.component';
import { ReativarEquipprotecaoindividualComponent } from './reativar-equipprotecaoindividual/reativar-equipprotecaoindividual.component';
import { EquipprotecaoindividualService } from './equipprotecaoindividual.service';
import { RouterModule } from '@angular/router';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DataTableModule } from 'angular2-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EquipprotecaoindividualRouterConfig } from './equipprotecaoindividual.routes';
import { HttpClientModule } from '@angular/common/http';
import { EquipprotecaoindividualComponent } from './equipprotecaoindividual.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(EquipprotecaoindividualRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule
  ],
  declarations: [
    EquipprotecaoindividualComponent,
    AdicionarEquipprotecaoindividualComponent, 
    EditarEquipprotecaoindividualComponent, 
    ExcluirEquipprotecaoindividualComponent, 
    ListaEquipprotecaoindividualComponent, 
    ReativarEquipprotecaoindividualComponent],
    providers: [
      EquipprotecaoindividualService
  ],
  exports: [
      RouterModule,
      DataFilterPipeModule,
      CheckBoxSetDirectiveModule,
      DisableControlDirectiveModule]
})
export class EquipprotecaoindividualModule { }
