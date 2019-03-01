import { Routes } from '@angular/router';

import { ConfiguracaopagamentoComponent } from './configuracaopagamento.component';
import { ListaConfiguracaopagamentoComponent } from './lista-configuracaopagamento/lista-configuracaopagamento.component';
import { AdicionarConfiguracaopagamentoComponent } from './adicionar-configuracaopagamento/adicionar-configuracaopagamento.component';
import { EditarConfiguracaopagamentoComponent } from './editar-configuracaopagamento/editar-configuracaopagamento.component';
import { ExcluirConfiguracaopagamentoComponent } from './excluir-configuracaopagamento/excluir-configuracaopagamento.component';
import { ReativarConfiguracaopagamentoComponent } from './reativar-configuracaopagamento/reativar-configuracaopagamento.component';

export const ConfiguracaopagamentoRouterConfig: Routes = [
    {
        path: '', component: ConfiguracaopagamentoComponent,
        data: {
            title: 'Configuração de Pagamento',
            urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
        },
        children: [
            { path: '', component: ListaConfiguracaopagamentoComponent,
                data: {
                    title: 'Configuração de Pagamento',
                    urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
                }
            },
            { path: 'adicionar', component: AdicionarConfiguracaopagamentoComponent,
                data: {
                    title: 'Configuração de Pagamento',
                    urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
                }
            },
            { path: 'editar/:id',  component: EditarConfiguracaopagamentoComponent,
                data: {
                    title: 'Configuração de Pagamento',
                    urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
                }
             },
            { path: 'excluir/:id',  component: ExcluirConfiguracaopagamentoComponent,
                data: {
                    title: 'Configuração de Pagamento',
                    urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
                }           
            },
            { path: 'reativar/:id',  component: ReativarConfiguracaopagamentoComponent,
                data: {
                    title: 'Configuração de Pagamento',
                    urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
                }
            },
            { path: 'lista', component: ListaConfiguracaopagamentoComponent,
                data: {
                    title: 'Configuração de Pagamento',
                    urls: [{ title: 'Configuração de Pagamento', url: '/configuracaopagamento' }, { title: 'Configuração de Pagamento' }]
                }
            }            
        ]
    }
];