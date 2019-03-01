import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadocivilComponent } from './estadocivil.component';
import { AdicionarEstadocivilComponent } from './adicionar-estadocivil/adicionar-estadocivil.component';
import { EditarEstadocivilComponent } from './editar-estadocivil/editar-estadocivil.component';
import { ExcluirEstadocivilComponent } from './excluir-estadocivil/excluir-estadocivil.component';
import { ListaEstadocivilComponent } from './lista-estadocivil/lista-estadocivil.component';
import { ReativarEstadocivilComponent } from './reativar-estadocivil/reativar-estadocivil.component';
import { EstadocivilRouterConfig } from './estadocivil.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { TreeTableModule } from "ng-treetable";
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { EstadocivilService } from './estadocivil.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(EstadocivilRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    TreeTableModule,
    TextMaskModule
  ],
  providers: [
    MaskService,
    EstadocivilService
  ],
  declarations: [
    EstadocivilComponent,
    AdicionarEstadocivilComponent,
    EditarEstadocivilComponent,
    ExcluirEstadocivilComponent,
    ListaEstadocivilComponent,
    ReativarEstadocivilComponent
  ],
  exports: [RouterModule,
    DataFilterPipeModule]
})
export class EstadocivilModule { }
