import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarPaisComponent } from './adicionar-pais/adicionar-pais.component';
import { EditarPaisComponent } from './editar-pais/editar-pais.component';
import { ExcluirPaisComponent } from './excluir-pais/excluir-pais.component';
import { ListaPaisComponent } from './lista-pais/lista-pais.component';
import { ReativarPaisComponent } from './reativar-pais/reativar-pais.component';
import { PaisRouterConfig } from './pais.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { TreeTableModule } from 'ng-treetable';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { PaisService } from './pais.service';
import { PaisComponent } from './pais.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(PaisRouterConfig),
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
    PaisService
  ],
  declarations: [
    PaisComponent,
    AdicionarPaisComponent, 
    EditarPaisComponent, 
    ExcluirPaisComponent, 
    ListaPaisComponent, 
    ReativarPaisComponent
  ],
  exports: [RouterModule,
    DataFilterPipeModule]
})
export class PaisModule { }
