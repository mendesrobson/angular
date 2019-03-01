import { Routes } from '@angular/router';

import { CboComponent } from "./cbo.component";
import { ListaCboComponent } from './lista-cbo/lista-cbo.component';
import { AdicionarCboComponent } from './adicionar-cbo/adicionar-cbo.component';
import { EditarCboComponent } from './editar-cbo/editar-cbo.component';
import { ExcluirCboComponent } from './excluir-cbo/excluir-cbo.component';
import { ReativarCboComponent } from './reativar-cbo/reativar-cbo.component';

export const cboRouterConfig: Routes = [
    {
        path: '', component: CboComponent,
        children: [
            { path: '', component: ListaCboComponent,
                data: {
                    title: 'Cadastro CBO',
                    urls: [{title: 'Folha',url: '/cbo'},{title: 'CBO'}]
                }
            },
            { path: 'adicionar', component: AdicionarCboComponent,
                data: {
                    title: 'Cadastro CBO',
                    urls: [{title: 'Folha',url: '/cbo'},{title: 'CBO'}]
                }
            },
            { path: 'editar/:id',  component: EditarCboComponent,
                data: {
                    title: 'Cadastro CBO',
                    urls: [{title: 'Folha',url: '/cbo'},{title: 'CBO'}]
                }
            },
            { path: 'lista', component: ListaCboComponent,
                data: {
                    title: 'Cadastro CBO',
                    urls: [{title: 'Folha',url: '/cbo'},{title: 'CBO'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirCboComponent, 
                data: {
                    title: 'Cadastro CBO',
                    urls: [{title: 'Folha',url: '/cbo'},{title: 'CBO'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarCboComponent,
                data: {
                    title: 'Cadastro CBO',
                    urls: [{title: 'Folha',url: '/cbo'},{title: 'CBO'}]
                }
            }             
        ]
    }
];