import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarValortransporteComponent } from './adicionar-valortransporte/adicionar-valortransporte.component';
import { EditarValortransporteComponent } from './editar-valortransporte/editar-valortransporte.component';
import { ExcluirValortransporteComponent } from './excluir-valortransporte/excluir-valortransporte.component';
import { ListaValortransporteComponent } from './lista-valortransporte/lista-valortransporte.component';
import { ReativarValortransporteComponent } from './reativar-valortransporte/reativar-valortransporte.component';
import { ValortransporteService } from './valortransporte.service';
import { RouterModule } from '@angular/router';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DataTableModule } from 'angular2-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ValortransporteRouterConfig } from './valortransporte.routes';
import { HttpClientModule } from '@angular/common/http';
import { ValortransporteComponent } from './valortransporte.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ValortransporteRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule
  ],
  declarations: [
    ValortransporteComponent,
    AdicionarValortransporteComponent, 
    EditarValortransporteComponent, 
    ExcluirValortransporteComponent, 
    ListaValortransporteComponent, 
    ReativarValortransporteComponent],
    providers: [
      ValortransporteService
  ],
  exports: [
      RouterModule,
      DataFilterPipeModule,
      CheckBoxSetDirectiveModule,
      DisableControlDirectiveModule]
})
export class ValortransporteModule { }
