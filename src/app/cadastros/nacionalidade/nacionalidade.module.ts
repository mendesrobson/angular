import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';

import { NacionalidadeService } from './nacionalidade.service';

import { nacionalidadeRouterConfig } from './nacionalidade.routes';

import { NacionalidadeComponent } from './nacionalidade.component';
import { ListaNacionalidadeComponent } from './lista-nacionalidade/lista-nacionalidade.component';
import { AdicionarNacionalidadeComponent } from './adicionar-nacionalidade/adicionar-nacionalidade.component';
import { EditarNacionalidadeComponent } from './editar-nacionalidade/editar-nacionalidade.component';
import { ExcluirNacionalidadeComponent } from './excluir-nacionalidade/excluir-nacionalidade.component';
import { ReativarNacionalidadeComponent } from './reativar-nacionalidade/reativar-nacionalidade.component';


@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      RouterModule.forChild(nacionalidadeRouterConfig),
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      DataTableModule,
      DataFilterPipeModule
  ],
  declarations: [
      NacionalidadeComponent,
      ListaNacionalidadeComponent,
      AdicionarNacionalidadeComponent,
      EditarNacionalidadeComponent,
      ExcluirNacionalidadeComponent,
      ReativarNacionalidadeComponent
  ],
  providers: [
      NacionalidadeService
  ],
  exports: [RouterModule,
      DataFilterPipeModule]
})

export class NacionalidadeModule { }

