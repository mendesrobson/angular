import { Routes } from '@angular/router';

import { ContaCorrenteComponent } from './contacorrente.component';
import { ListaContaCorrenteComponent } from './lista-contacorrente/lista-contacorrente.component';
import { AdicionarContaCorrenteComponent } from './adicionar-contacorrente/adicionar-contacorrente.component';
import { EditarContaCorrenteComponent } from './editar-contacorrente/editar-contacorrente.component';
import { ReativarContaCorrenteComponent } from './reativar-contacorrente/reativar-contacorrente.component';
import { ExcluirContaCorrenteComponent } from './excluir-contacorrente/excluir-contacorrente.component';
import { AdicionarDadosCobrancaComponent } from './adicionar-dadoscobranca/adicionar-dadoscobranca.component';
import { EditarDadosCobrancaComponent } from './editar-dadoscobranca/editar-dadoscobranca.component';
import { ListaContaCaixaComponent } from './lista-contacaixa/lista-contacaixa.component';

export const contaCorrenteRouterConfig: Routes = [
    {
        path: '', component: ContaCorrenteComponent,
        data: {
            title: 'Conta Corrente',
            urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
        },
        children: [
            { path: '', component: ListaContaCorrenteComponent,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'adicionar/conta/:tipoConta', component: AdicionarContaCorrenteComponent,
                data: {
                    title: 'Conta Caixa',
                    urls: [{ title: 'Informações Bancárias', url: '/conta/adicionar/:tipoConta' }, { title: 'Conta Caixa' }]
                }
            },
            { path: 'adicionar/:tipoConta', component: AdicionarContaCorrenteComponent,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta/adicionar/:tipoConta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'editar/caixa/:id',  component: EditarContaCorrenteComponent,
                data: {
                    title: 'Conta Caixa',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Caixa' }]
                }
            },
            { path: 'editar/corrente/:id',  component: EditarContaCorrenteComponent,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirContaCorrenteComponent,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarContaCorrenteComponent,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'adicionardadoscobranca',  component: AdicionarDadosCobrancaComponent,
                data: {
                    title: 'Conta',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta' }]
                }
            },
            { path: 'lista', component: ListaContaCorrenteComponent ,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'listadadoscobranca', component: ListaContaCorrenteComponent,
                data: {
                    title: 'Conta Corrente',
                    urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta Corrente' }]
                }
            },
            { path: 'editardadoscobranca', component: EditarDadosCobrancaComponent,
            data: {
                title: 'Conta',
                urls: [{ title: 'Informações Bancárias', url: '/conta' }, { title: 'Conta' }]
            }
            },
            { path: 'listacontacaixa', component: ListaContaCaixaComponent,
                data: {
                    title: 'Conta Caixa',
                    urls: [{ title: 'Informações Bancárias', url: '/conta/listacontacaixa' }, { title: 'Conta Caixa' }]
                }
            }            
        ]
    }
];