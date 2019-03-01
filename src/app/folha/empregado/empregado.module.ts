import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DataTableModule } from 'angular2-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmpregadoRouterConfig } from './empregado.routes';
import { EmpregadoService } from './empregado.service';
import { HttpClientModule } from '@angular/common/http';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";

import { EmpregadoComponent } from './empregado.component';
import { ListaEmpregadoComponent } from './lista-empregado/lista-empregado.component';
import { AdicionarEmpregadoComponent } from './adicionar-empregado/adicionar-empregado.component';
import { ListaPessoaenderecoComponent } from './lista-pessoaendereco/lista-pessoaendereco.component';

import { DxDataGridModule, DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxFormModule } from 'devextreme-angular';
import { AdicionarPessoaenderecoComponent } from './adicionar-pessoaendereco/adicionar-pessoaendereco.component';
import { EditarEmpregadoComponent } from './editar-empregado/editar-empregado.component';
import { EditarPessoaenderecoComponent } from './editar-pessoaendereco/editar-pessoaendereco.component';
import { AdicionarPessoacontatoComponent } from './adicionar-pessoacontato/adicionar-pessoacontato.component';
import { ListaPessoacontatoComponent } from './lista-pessoacontato/lista-pessoacontato.component';
import { EditarPessoacontatoComponent } from './editar-pessoacontato/editar-pessoacontato.component';
import { AdicionarEmpregadocontacorrenteComponent } from './adicionar-empregadocontacorrente/adicionar-empregadocontacorrente.component';
import { ListaEstagioComponent } from './lista-estagio/lista-estagio.component';
import { AdicionarEstagioComponent } from './adicionar-estagio/adicionar-estagio.component';
import { EditarEstagioComponent } from './editar-estagio/editar-estagio.component';
import { AdicionarEmpregadoadmissaoComponent } from './adicionar-empregadoadmissao/adicionar-empregadoadmissao.component';
import { EditarEmpregadoadmissaoComponent } from './editar-empregadoadmissao/editar-empregadoadmissao.component';
import { AdicionarEmpregadobeneficiosComponent } from './adicionar-empregadobeneficios/adicionar-empregadobeneficios.component';
import { EditarEmpregadobeneficiosComponent } from './editar-empregadobeneficios/editar-empregadobeneficios.component';
import { ListaItinerarioComponent } from './lista-itinerario/lista-itinerario.component';
import { EditarItinerarioComponent } from './editar-itinerario/editar-itinerario.component';
import { AdicionarItinerarioComponent } from './adicionar-itinerario/adicionar-itinerario.component';
import { AdicionarEmpregadodependenteComponent } from './adicionar-empregadodependente/adicionar-empregadodependente.component';
import { ListaEmpregadodependenteComponent } from './lista-empregadodependente/lista-empregadodependente.component';
import { EditarEmpregadodependenteComponent } from './editar-empregadodependente/editar-empregadodependente.component';
import { ListaEmpregadoorgaoclasseComponent } from './lista-empregadoorgaoclasse/lista-empregadoorgaoclasse.component';
import { EditarEmpregadoorgaoclasseComponent } from './editar-empregadoorgaoclasse/editar-empregadoorgaoclasse.component';
import { AdicionarEmpregadoorgaoclasseComponent } from './adicionar-empregadoorgaoclasse/adicionar-empregadoorgaoclasse.component';
import { AdicionarEmpregadolotacaoComponent } from './adicionar-empregadolotacao/adicionar-empregadolotacao.component';
import { EditarEmpregadolotacaoComponent } from './editar-empregadolotacao/editar-empregadolotacao.component';
import { ListaEmpregadolotacaoComponent } from './lista-empregadolotacao/lista-empregadolotacao.component';
import { EditarEmpregadodescontoComponent } from './editar-empregadodesconto/editar-empregadodesconto.component';
import { AdicionarEmpregadodescontoComponent } from './adicionar-empregadodesconto/adicionar-empregadodesconto.component';


export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  //allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: " ",
  suffix: "",
  thousands: "."
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(EmpregadoRouterConfig),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    TextMaskModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule,
    CurrencyMaskModule,
    DisableControlCheckBoxDirectiveModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxFormModule
  ],
  declarations: [
    EmpregadoComponent,
    ListaEmpregadoComponent,
    AdicionarEmpregadoComponent,
    ListaPessoaenderecoComponent,
    AdicionarPessoaenderecoComponent,
    EditarPessoaenderecoComponent,
    EditarEmpregadoComponent,
    AdicionarPessoacontatoComponent,
    ListaPessoacontatoComponent,
    EditarPessoacontatoComponent,
    AdicionarEmpregadocontacorrenteComponent,
    ListaEstagioComponent, AdicionarEstagioComponent,
    EditarEstagioComponent, AdicionarEmpregadoadmissaoComponent,
    EditarEmpregadoadmissaoComponent, AdicionarEmpregadobeneficiosComponent,
    EditarEmpregadobeneficiosComponent,
    ListaItinerarioComponent,
    EditarItinerarioComponent,
    AdicionarItinerarioComponent,
    AdicionarEmpregadodependenteComponent,
    ListaEmpregadodependenteComponent,
    EditarEmpregadodependenteComponent,
    ListaEmpregadoorgaoclasseComponent,
    EditarEmpregadoorgaoclasseComponent,
    AdicionarEmpregadoorgaoclasseComponent,
    AdicionarEmpregadolotacaoComponent,
    EditarEmpregadolotacaoComponent,
    ListaEmpregadolotacaoComponent,
    EditarEmpregadodescontoComponent,
    AdicionarEmpregadodescontoComponent
  ],
  providers: [
    MaskService,
    EmpregadoService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  exports: [
    RouterModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    DisableControlCheckBoxDirectiveModule,
    DisableControlDirectiveModule]
})
export class EmpregadoModule { }
