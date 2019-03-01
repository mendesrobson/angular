import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaExposicaoagentenocivoComponent } from './lista-exposicaoagentenocivo/lista-exposicaoagentenocivo.component';
import { EditarExposicaoagentenocivoComponent } from './editar-exposicaoagentenocivo/editar-exposicaoagentenocivo.component';
import { AdicionarExposicaoagentenocivoComponent } from './adicionar-exposicaoagentenocivo/adicionar-exposicaoagentenocivo.component';
import { ExcluirExposicaoagentenocivoComponent } from './excluir-exposicaoagentenocivo/excluir-exposicaoagentenocivo.component';
import { ReativarExposicaoagentenocivoComponent } from './reativar-exposicaoagentenocivo/reativar-exposicaoagentenocivo.component';
import { ExposicaoagentenocivoComponent } from './exposicaoagentenocivo.component';
import { exposicaoagentenocivoRouterConfig } from './exposicaoagentenocivo.routes';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { HttpClientModule } from '../../../../node_modules/@angular/common/http';
import { DataTableModule } from '../../../../node_modules/angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { ExposicaoagentenocivoService } from './exposicaoagentenocivo.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(exposicaoagentenocivoRouterConfig),
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    DisableControlCheckBoxDirectiveModule,
    CheckBoxSetDirectiveModule
  ],
  declarations: [
    ExposicaoagentenocivoComponent,
    ListaExposicaoagentenocivoComponent,
    EditarExposicaoagentenocivoComponent,
    AdicionarExposicaoagentenocivoComponent,
    ExcluirExposicaoagentenocivoComponent,
    ReativarExposicaoagentenocivoComponent
  ],
  providers: [
    ExposicaoagentenocivoService
  ],
  exports: [
    RouterModule,
    DataFilterPipeModule
  ]
})
export class ExposicaoagentenocivoModule { }
