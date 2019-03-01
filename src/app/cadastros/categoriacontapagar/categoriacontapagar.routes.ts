import { Routes } from '@angular/router';

import { CategoriaContaPagarComponent } from './categoriacontapagar.component';
import { ListaCategoriaContaPagarComponent } from './lista-categoriacontapagar/lista-categoriacontapagar.component';
import { AdicionarCategoriaContaPagarComponent } from './adicionar-categoriacontapagar/adicionar-categoriacontapagar.component';
import { EditarCategoriaContaPagarComponent } from './editar-categoriacontapagar/editar-categoriacontapagar.component';
import { ReativarCategoriaContaPagarComponent } from './reativar-categoriacontapagar/reativar-categoriacontapagar.component';
import { ExcluirCategoriaContaPagarComponent } from './excluir-categoriacontapagar/excluir-categoriacontapagar.component';

export const categoriaContaPagarRouterConfig: Routes = [
    {
        path: '', component: CategoriaContaPagarComponent,
        children: [
            { path: '', component: ListaCategoriaContaPagarComponent,
                data: {
                    title: 'Categoria - Contas a Pagar',
                    urls: [{ title: 'Faturamento', url: '/categoriacontapagar' }, { title: 'Categoria - Contas a Pagar' }]
                }
            },
            { path: 'adicionar', component: AdicionarCategoriaContaPagarComponent,
                data: {
                    title: 'Categoria - Contas a Pagar',
                    urls: [{ title: 'Faturamento', url: '/categoriacontapagar' }, { title: 'Categoria - Contas a Pagar : Adicionar' }]
                } 
            },
            { path: 'editar/:id',  component: EditarCategoriaContaPagarComponent,
                data: {
                    title: 'Categoria - Contas a Pagar',
                    urls: [{ title: 'Faturamento', url: '/categoriacontapagar' }, { title: 'Categoria - Contas a Pagar : Editar' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirCategoriaContaPagarComponent,
                data: {
                    title: 'Categoria - Contas a Pagar',
                    urls: [{ title: 'Faturamento', url: '/categoriacontapagar' }, { title: 'Categoria - Contas a Pagar : Excluir' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarCategoriaContaPagarComponent,
                data: {
                    title: 'Categoria - Contas a Pagar',
                    urls: [{ title: 'Faturamento', url: '/categoriacontapagar' }, { title: 'Categoria - Contas a Pagar : Reativar' }]
                }
            },
            { path: 'lista', component: ListaCategoriaContaPagarComponent,
                data: {
                    title: 'Categoria - Contas a Pagar',
                    urls: [{ title: 'Faturamento', url: '/categoriacontapagar' }, { title: 'Categoria - Contas a Pagar : Lista' }]
                }
            }            
        ]
    }
];