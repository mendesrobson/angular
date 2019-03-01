import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarConvencaoComponent } from './adicionar-convencao/adicionar-convencao.component';
import { EditarConvencaoComponent } from './editar-convencao/editar-convencao.component';
import { ExcluirConvencaoComponent } from './excluir-convencao/excluir-convencao.component';
import { ListaConvencaoComponent } from './lista-convencao/lista-convencao.component';
import { ReativarConvencaoComponent } from './reativar-convencao/reativar-convencao.component';
import { ConvencaoService } from './convencao.service';
import { RouterModule } from '@angular/router';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DataTableModule } from 'angular2-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConvencaoRouterConfig } from './convencao.routes';
import { HttpClientModule } from '@angular/common/http';
import { ConvencaoComponent } from './convencao.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(ConvencaoRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule
  ],
  declarations: [
    ConvencaoComponent,
    AdicionarConvencaoComponent, 
    EditarConvencaoComponent, 
    ExcluirConvencaoComponent, 
    ListaConvencaoComponent, 
    ReativarConvencaoComponent],
    providers: [
      ConvencaoService
  ],
  exports: [
      RouterModule,
      DataFilterPipeModule,
      CheckBoxSetDirectiveModule,
      DisableControlDirectiveModule]
})
export class ConvencaoModule { }
