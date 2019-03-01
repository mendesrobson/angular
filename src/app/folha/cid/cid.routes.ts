import { Routes } from '@angular/router';
import { CidComponent } from './cid.component';
import { AdicionarCidComponent } from './adicionar-cid/adicionar-cid.component';
import { ExcluirCidComponent } from './excluir-cid/excluir-cid.component';
import { EditarCidComponent } from './editar-cid/editar-cid.component';
import { ReativarCidComponent } from './reativar-cid/reativar-cid.component';
import { ListaCidComponent } from './lista-cid/lista-cid.component';


export const cidRouterConfig: Routes = [
    {
        path: '', component: CidComponent,
        children: [
            { path: '', component: ListaCidComponent,
                data: {
                    title: 'Cid',
                    urls: [{title: 'Folha', url: '/cid'}, {title: 'Cid'}]
                }
            },
            { path: 'adicionar', component: AdicionarCidComponent,
                data: {
                    title: 'Cid',
                    urls: [{title: 'Folha', url: '/cid'}, {title: 'Cid'}]
                }
            },
            { path: 'editar/:id',  component: EditarCidComponent,
                data: {
                    title: 'Cid',
                    urls: [{title: 'Folha', url: '/cid'}, {title: 'Cid'}]
                }
            },
            { path: 'lista', component: ListaCidComponent,
                data: {
                    title: 'Cid',
                    urls: [{title: 'Folha', url: '/cid'}, {title: 'Cid'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirCidComponent,
                data: {
                    title: 'Cid',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Cid'}]
                }
            },
            { path: 'reativar/:id', component: ReativarCidComponent,
                data: {
                    title: 'Cid',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Cid'}]
                }
            }
        ]
    }
];
