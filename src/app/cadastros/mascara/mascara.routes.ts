import { Routes } from '@angular/router';

import { MascaraComponent } from './mascara.component';
import { ListaMascaraComponent } from './lista-mascara/lista-mascara.component';
import { AdicionarMascaraComponent } from './adicionar-mascara/adicionar-mascara.component';
import { EditarMascaraComponent } from './editar-mascara/editar-mascara.component';
import { ExcluirMascaraComponent } from './excluir-mascara/excluir-mascara.component';
import { ReativarMascaraComponent } from './reativar-mascara/reativar-mascara.component';

export const mascaraRouterConfig: Routes = [
    {
        path: '', component: MascaraComponent,
        data: {
            title: 'Mascara',
            urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
        },
        children: [
            { path: '', component: ListaMascaraComponent,
                data: {
                    title: 'Mascara',
                    urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
                }
            },
            { path: 'adicionar', component: AdicionarMascaraComponent,
                data: {
                    title: 'Mascara',
                    urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
                } 
            },
            { path: 'editar/:id',  component: EditarMascaraComponent, 
                data: {
                    title: 'Mascara',
                    urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirMascaraComponent, 
                data: {
                    title: 'Mascara',
                    urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
                }
            },
            { path: 'reativar/:id',  component: ReativarMascaraComponent,
                data: {
                    title: 'Mascara',
                    urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
                }
            },
            { path: 'lista', component: ListaMascaraComponent,
                data: {
                    title: 'Mascara',
                    urls: [{title: 'Cadastros',url: '/mascara'},{title: 'Mascara'}]
                }
            }            
        ]
    }
];