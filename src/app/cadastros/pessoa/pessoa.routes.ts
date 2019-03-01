import { Routes } from '@angular/router';

import { PessoaComponent } from './pessoa.component';
import { AdicionarPessoaComponent } from './adicionar-pessoa/adicionar-pessoa.component';
import { EditarPessoaComponent } from './editar-pessoa/editar-pessoa.component';
import { ReativarPessoaComponent } from './reativar-pessoa/reativar-pessoa.component';
import { ExcluirPessoaComponent } from './excluir-pessoa/excluir-pessoa.component';

export const pessoaRouterConfig: Routes = [
    {
        path: '', component: PessoaComponent,
        data: {
            title: 'Cadastros',
            urls: [{title: 'Cadastros'},{title: 'Cadastro de Pessoa'}]
        },
        children: [
            // { path: '', component: ListaHistoricopadraoComponent },
            { path: 'adicionar', component: AdicionarPessoaComponent,
                data: {
                    title: 'Cadastros',
                    urls: [{title: 'Cadastros'},{title: 'Cadastro de Pessoa'}]
                }
            },
            { path: 'editar/:id', component: EditarPessoaComponent,
                data: {
                    title: 'Cadastros',
                    urls: [{title: 'Cadastros'},{title: 'Cadastro de Pessoa'}]
                }
            },
            { path: 'reativar/:id', component: ReativarPessoaComponent,
                data: {
                    title: 'Cadastros',
                    urls: [{title: 'Cadastros'},{title: 'Cadastro de Pessoa'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirPessoaComponent,
                data: {
                    title: 'Cadastros',
                    urls: [{title: 'Cadastros'},{title: 'Cadastro de Pessoa'}]
                }
            }
        ]
    }
];