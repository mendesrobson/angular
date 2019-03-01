import { Routes } from '@angular/router';

import { UfComponent } from './uf.component';
import { ListaUfComponent } from './lista-uf/lista-uf.component';
import { AdicionarUfComponent } from './adicionar-uf/adicionar-uf.component';
import { EditarUfComponent } from './editar-uf/editar-uf.component';
import { ExcluirUfComponent } from './excluir-uf/excluir-uf.component';
import { ReativarUfComponent } from './reativar-uf/reativar-uf.component';

export const ufRouterConfig: Routes = [
    {
        path: '', component: UfComponent,
        children: [
            { path: '', component: ListaUfComponent,
                data: {
                    title: 'Unidades da Federação',
                    urls: [{title: 'Cadastro',url: '/uf'},{title: 'Unidades da Federação'}]
                }
            },
            { path: 'adicionar', component: AdicionarUfComponent,
                data: {
                    title: 'Unidades da Federação',
                    urls: [{title: 'Cadastro',url: '/uf'},{title: 'Unidades da Federação'}]
                }
            },
            { path: 'editar/:id',  component: EditarUfComponent,
                data: {
                    title: 'Unidades da Federação',
                    urls: [{title: 'Cadastro',url: '/uf'},{title: 'Unidades da Federação'}]
                }
            },
            { path: 'lista', component: ListaUfComponent,
                data: {
                    title: 'Unidades da Federação',
                    urls: [{title: 'Cadastro',url: '/uf'},{title: 'Unidades da Federação'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirUfComponent, 
                data: {
                    title: 'Unidades da Federação',
                    urls: [{title: 'Cadastro',url: '/uf'},{title: 'Unidades da Federação'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarUfComponent,
                data: {
                    title: 'Unidades da Federação',
                    urls: [{title: 'Cadastro',url: '/uf'},{title: 'Unidades da Federação'}]
                }
            }             
        ]
    }
];