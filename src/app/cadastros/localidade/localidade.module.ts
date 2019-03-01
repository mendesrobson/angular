import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarLocalidadeComponent } from './adicionar-localidade/adicionar-localidade.component';
import { EditarLocalidadeComponent } from './editar-localidade/editar-localidade.component';
import { ExcluirLocalidadeComponent } from './excluir-localidade/excluir-localidade.component';
import { ListaLocalidadeComponent } from './lista-localidade/lista-localidade.component';
import { ReativarLocalidadeComponent } from './reativar-localidade/reativar-localidade.component';
import { LocalidadeRouterConfig } from './localidade.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { TreeTableModule } from 'ng-treetable';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { LocalidadeService } from './localidade.service';
import { LocalidadeComponent } from './localidade.component';
import { DxSelectBoxModule } from 'devextreme-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(LocalidadeRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    TreeTableModule,
    TextMaskModule,
    DxSelectBoxModule
  ],
  providers: [
    MaskService,
    LocalidadeService
  ],
  declarations: [
    LocalidadeComponent,
    AdicionarLocalidadeComponent, 
    EditarLocalidadeComponent, 
    ExcluirLocalidadeComponent, 
    ListaLocalidadeComponent, 
    ReativarLocalidadeComponent
  ],
  exports: [RouterModule,
    DataFilterPipeModule]
})
export class LocalidadeModule { }
