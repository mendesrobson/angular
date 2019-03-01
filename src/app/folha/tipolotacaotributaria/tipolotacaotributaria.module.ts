import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarTipolotacaotributariaComponent } from './adicionar-tipolotacaotributaria/adicionar-tipolotacaotributaria.component';
import { EditarTipolotacaotributariaComponent } from './editar-tipolotacaotributaria/editar-tipolotacaotributaria.component';
import { ListaTipolotacaotributariaComponent } from './lista-tipolotacaotributaria/lista-tipolotacaotributaria.component';
import { ReativarTipolotacaotributariaComponent } from './reativar-tipolotacaotributaria/reativar-tipolotacaotributaria.component';
import { TipolotacaotributariaService } from './tipolotacaotributaria.service';
import { RouterModule } from '@angular/router';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DataTableModule } from 'angular2-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TipolotacaotributariaRouterConfig } from './tipolotacaotributaria.routes';
import { HttpClientModule } from '@angular/common/http';
import { TipolotacaotributariaComponent } from './tipolotacaotributaria.component';
import { ExcluirTipolotacaotributariaComponent } from './excluir-tipolotacaotributaria/excluir-tipolotacaotributaria.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(TipolotacaotributariaRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule
  ],
  declarations: [
    TipolotacaotributariaComponent,
    AdicionarTipolotacaotributariaComponent, 
    EditarTipolotacaotributariaComponent, 
    ListaTipolotacaotributariaComponent, 
    ReativarTipolotacaotributariaComponent, 
    ExcluirTipolotacaotributariaComponent
  ],
    providers: [
      TipolotacaotributariaService
  ],
  exports: [
      RouterModule,
      DataFilterPipeModule,
      CheckBoxSetDirectiveModule,
      DisableControlDirectiveModule]
})
export class TipolotacaotributariaModule { }
