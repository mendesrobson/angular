import { Routes } from '@angular/router';

import { CategoriaContaReceberComponent } from "./categoriacontareceber.component";
import { ListaCategoriaContaReceberComponent } from "./lista-categoriacontareceber/lista-categoriacontareceber.component";
import { AdicionarCategoriaContaReceberComponent } from "./adicionar-categoriacontareceber/adicionar-categoriacontareceber.component";
import { EditarCategoriaContaReceberComponent } from "./editar-categoriacontareceber/editar-categoriacontareceber.component";
import { ExcluirCategoriaContaReceberComponent } from "./excluir-categoriacontareceber/excluir-categoriacontareceber.component";
import { ReativarCategoriaContaReceberComponent } from "./reativar-categoriacontareceber/reativar-categoriacontareceber.component";


export const categoriaContaReceberRouterConfig: Routes = [
    {
        path: '', component: CategoriaContaReceberComponent,
        children: [
            { path: '', component: ListaCategoriaContaReceberComponent,
                data: {
                    title: 'Categoria - Contas a Receber',
                    urls: [{ title: 'Faturamento', url: '/categoriacontareceber' }, { title: 'Categoria - Contas a Receber' }]
                }
            },
            { path: 'adicionar', component: AdicionarCategoriaContaReceberComponent,
                data: {
                    title: 'Categoria - Contas a Receber',
                    urls: [{ title: 'Faturamento', url: '/categoriacontareceber' }, { title: 'Categoria - Contas a Receber : Adicionar' }]
                }
            },
            { path: 'editar/:id',  component: EditarCategoriaContaReceberComponent,
                data: {
                    title: 'Categoria - Contas a Receber',
                    urls: [{ title: 'Faturamento', url: '/categoriacontareceber' }, { title: 'Categoria - Contas a Receber : Editar' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirCategoriaContaReceberComponent, 
                data: {
                    title: 'Categoria - Contas a Receber',
                    urls: [{ title: 'Faturamento', url: '/categoriacontareceber' }, { title: 'Categoria - Contas a Receber : Excluir' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarCategoriaContaReceberComponent,
                data: {
                    title: 'Categoria - Contas a Receber',
                    urls: [{ title: 'Faturamento', url: '/categoriacontareceber' }, { title: 'Categoria - Contas a Receber : Reativar' }]
                }
            },
            { path: 'lista', component: ListaCategoriaContaReceberComponent,
                data: {
                    title: 'Categoria - Contas a Receber',
                    urls: [{ title: 'Faturamento', url: '/categoriacontareceber' }, { title: 'Categoria - Contas a Receber : Lista' }]
                }
            }            
        ]
    }
];