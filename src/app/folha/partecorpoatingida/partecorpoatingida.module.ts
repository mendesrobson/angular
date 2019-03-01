import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { HttpClientModule } from '../../../../node_modules/@angular/common/http';
import { DataTableModule } from '../../../../node_modules/angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { partecorpoatingidaRouterConfig } from './partecorpoatingida.routes';
import { PartecorpoatingidaComponent } from './partecorpoatingida.component';
import { ListaPartecorpoatingidaComponent } from './lista-partecorpoatingida/lista-partecorpoatingida.component';
import { EditarPartecorpoatingidaComponent } from './editar-partecorpoatingida/editar-partecorpoatingida.component';
import { ExcluirPartecorpoatingidaComponent } from './excluir-partecorpoatingida/excluir-partecorpoatingida.component';
import { ReativarPartecorpoatingidaComponent } from './reativar-partecorpoatingida/reativar-partecorpoatingida.component';
import { AdicionarPartecorpoatingidaComponent } from './adicionar-partecorpoatingida/adicionar-partecorpoatingida.component';
import { PartecorpoatingidaService } from './partecorpoatingida.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(partecorpoatingidaRouterConfig),
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    DisableControlCheckBoxDirectiveModule,
    CheckBoxSetDirectiveModule
  ],
  declarations: [
    PartecorpoatingidaComponent,
    ListaPartecorpoatingidaComponent, 
    EditarPartecorpoatingidaComponent, 
    ExcluirPartecorpoatingidaComponent, 
    ReativarPartecorpoatingidaComponent, 
    AdicionarPartecorpoatingidaComponent
  ],
  providers: [
    PartecorpoatingidaService
  ],
  exports: [
    RouterModule,
    DataFilterPipeModule
  ]
})
export class PartecorpoatingidaModule { }
