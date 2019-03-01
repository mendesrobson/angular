import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "angular2-datatable";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';

// components
import { PessoaComponent } from './pessoa.component';
import { AdicionarPessoaComponent } from './adicionar-pessoa/adicionar-pessoa.component';
import { EditarPessoaComponent } from './editar-pessoa/editar-pessoa.component';
import { AdicionarPessoaenderecoComponent } from './adicionar-pessoaendereco/adicionar-pessoaendereco.component';
import { ListaPessoaenderecoComponent } from './lista-pessoaendereco/lista-pessoaendereco.component';

// services
import { PessoaService } from './pessoa.service';

// config
import { pessoaRouterConfig } from './pessoa.routes';

// my modules

import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { EditarPessoaenderecoComponent } from './editar-pessoaendereco/editar-pessoaendereco.component';
import { ListaPessoacontatoComponent } from './lista-pessoacontato/lista-pessoacontato.component';
import { AdicionarPessoacontatoComponent } from './adicionar-pessoacontato/adicionar-pessoacontato.component';
import { EditarPessoacontatoComponent } from './editar-pessoacontato/editar-pessoacontato.component';
import { AdicionarEmpresacontacorrenteComponent } from './adicionar-empresacontacorrente/adicionar-empresacontacorrente.component';
import { ListaPessoacnaeComponent } from './lista-pessoacnae/lista-pessoacnae.component';
import { AdicionarPessoacnaeComponent } from './adicionar-pessoacnae/adicionar-pessoacnae.component';
import { EditarEmpresacontacorrenteComponent } from './editar-empresacontacorrente/editar-empresacontacorrente.component';
import { ListaEmpresacontacorrenteComponent } from './lista-empresacontacorrente/lista-empresacontacorrente.component';
import { EditarPessoacnaeComponent } from './editar-pessoacnae/editar-pessoacnae.component';
import { ListaPessoaregimetributarioComponent } from './lista-pessoaregimetributario/lista-pessoaregimetributario.component';
import { AdicionarPessoaregimetributarioComponent } from './adicionar-pessoaregimetributario/adicionar-pessoaregimetributario.component';
import { EditarPessoaregimetributarioComponent } from './editar-pessoaregimetributario/editar-pessoaregimetributario.component';
import { ListaPessoaempresaComponent } from './lista-pessoaempresa/lista-pessoaempresa.component';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { ExcluirPessoaComponent } from './excluir-pessoa/excluir-pessoa.component';
import { ReativarPessoaComponent } from './reativar-pessoa/reativar-pessoa.component';
import { AdicionarFornecedorcontacorrenteComponent } from './adicionar-fornecedorcontacorrente/adicionar-fornecedorcontacorrente.component';
import { ListaFornecedorcontacorrenteComponent } from './lista-fornecedorcontacorrente/lista-fornecedorcontacorrente.component';
import { ListaClientesindicatoComponent } from './lista-clientesindicato/lista-clientesindicato.component';
import { AdicionarClientesindicatoComponent } from './adicionar-clientesindicato/adicionar-clientesindicato.component';
import { EditarClientesindicatoComponent } from './editar-clientesindicato/editar-clientesindicato.component';
import { EditarFornecedorcontacorrenteComponent } from './editar-fornecedorcontacorrente/editar-fornecedorcontacorrente.component';
import { ListaClientecontacorrenteComponent } from './lista-clientecontacorrente/lista-clientecontacorrente.component';
import { AdicionarClientecontacorrenteComponent } from './adicionar-clientecontacorrente/adicionar-clientecontacorrente.component';
import { EditarClientecontacorrenteComponent } from './editar-clientecontacorrente/editar-clientecontacorrente.component';



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
        //SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(pessoaRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        CurrencyMaskModule
    ],
    declarations: [
        PessoaComponent,
        AdicionarPessoaComponent,
        AdicionarPessoaenderecoComponent,
        ListaPessoaenderecoComponent,
        EditarPessoaComponent,
        EditarPessoaenderecoComponent,
        EditarPessoacontatoComponent,
        ListaPessoacontatoComponent,
        AdicionarPessoacontatoComponent,
        AdicionarEmpresacontacorrenteComponent,
        ListaPessoacnaeComponent,
        AdicionarPessoacnaeComponent,
        EditarEmpresacontacorrenteComponent,
        ListaEmpresacontacorrenteComponent,
        EditarPessoacnaeComponent,
        ListaPessoaregimetributarioComponent,
        AdicionarPessoaregimetributarioComponent,
        EditarPessoaregimetributarioComponent,
        ListaPessoaempresaComponent,
        ExcluirPessoaComponent,
        ReativarPessoaComponent,
        AdicionarFornecedorcontacorrenteComponent,
        ListaFornecedorcontacorrenteComponent,
        ListaClientesindicatoComponent,
        AdicionarClientesindicatoComponent,
        EditarClientesindicatoComponent,
        EditarFornecedorcontacorrenteComponent,
        ListaClientecontacorrenteComponent,
        AdicionarClientecontacorrenteComponent,
        EditarClientecontacorrenteComponent
    ],
    providers: [
        MaskService,
        PessoaService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DisableControlCheckBoxDirectiveModule,
        DataFilterPipeModule]
})

export class PessoaModule { }