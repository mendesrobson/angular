import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdicionarCorRacaComponent } from './adicionar-corraca/adicionar-corraca.component';
import { EditarCorRacaComponent } from './editar-corraca/editar-corraca.component';
import { ExcluirCorRacaComponent } from './excluir-corraca/excluir-corraca.component';
import { ListaCorRacaComponent } from './lista-corraca/lista-corraca.component';
import { ReativarCorRacaComponent } from './reativar-corraca/reativar-corraca.component';
import { CorRacaRouterConfig } from './corraca.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { TreeTableModule } from 'ng-treetable';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { CorRacaService } from './corraca.service';
import { CorRacaComponent } from './corraca.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(CorRacaRouterConfig),
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
    CorRacaService
  ],
  declarations: [
    CorRacaComponent,
    AdicionarCorRacaComponent, 
    EditarCorRacaComponent, 
    ExcluirCorRacaComponent, 
    ListaCorRacaComponent, 
    ReativarCorRacaComponent
  ],
  exports: [RouterModule,
    DataFilterPipeModule]
})
export class CorRacaModule { }
