import { Routes } from '@angular/router';

import { CartaoComponent } from './cartao.component';
import { ListaCartaoComponent } from './lista-cartao/lista-cartao.component';
import { AdicionarCartaoComponent } from './adicionar-cartao/adicionar-cartao.component';
import { EditarCartaoComponent } from './editar-cartao/editar-cartao.component';
import { ExcluirCartaoComponent } from './excluir-cartao/excluir-cartao.component';
import { ReativarCartaoComponent } from './reativar-cartao/reativar-cartao.component';

export const CartaoRouterConfig: Routes = [
    {
        path: '', component: CartaoComponent,
        children: [
            { path: '', component: ListaCartaoComponent,
                data: {
                    title: 'Cartão',
                    urls: [{ title: 'Contas a Pagar', url: '/cartao' }, { title: 'Cartão' }]
                } 
            },
            { path: 'adicionar', component: AdicionarCartaoComponent,
                data: {
                    title: 'Cartão',
                    urls: [{ title: 'Contas a Pagar', url: '/cartao' }, { title: 'Cartão' }]
                }
            },
            { path: 'editar/:id',  component: EditarCartaoComponent, 
                data: {
                    title: 'Cartão',
                    urls: [{ title: 'Contas a Pagar', url: '/cartao' }, { title: 'Cartão' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirCartaoComponent,
                data: {
                    title: 'Cartão',
                    urls: [{ title: 'Contas a Pagar', url: '/cartao' }, { title: 'Cartão' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarCartaoComponent,
                data: {
                    title: 'Cartão',
                    urls: [{ title: 'Contas a Pagar', url: '/cartao' }, { title: 'Cartão' }]
                }
            },
            { path: 'lista', component: ListaCartaoComponent,
                data: {
                    title: 'Cartão',
                    urls: [{ title: 'Contas a Pagar', url: '/cartao' }, { title: 'Cartão' }]
                }
            }            
        ]
    }
];