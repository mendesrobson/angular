import { Routes } from '@angular/router';

import { AgenciaComponent } from './agencia.component';
import { ListaAgenciaComponent } from './lista-agencia/lista-agencia.component';
import { AdicionarAgenciaComponent } from './adicionar-agencia/adicionar-agencia.component';
import { EditarAgenciaComponent } from './editar-agencia/editar-agencia.component';
import { ExcluirAgenciaComponent } from './excluir-agencia/excluir-agencia.component';
import { ReativarAgenciaComponent } from './reativar-agencia/reativar-agencia.component';

export const agenciaRouterConfig: Routes = [
    {
        path: '', component: AgenciaComponent,
        children: [
            { path: '', component: ListaAgenciaComponent,
                data: {
                    title: 'Agência',
                    urls: [{ title: 'Informações Bancárias', url: '/agencia' }, { title: 'Agência' }]
                }  
            },
            { path: 'adicionar', component: AdicionarAgenciaComponent,
                data: {
                    title: 'Agência',
                    urls: [{ title: 'Informações Bancárias', url: '/agencia' }, { title: 'Adicionar - Agência' }]
                }
            },
            { path: 'editar/:id',  component: EditarAgenciaComponent,
                data: {
                    title: 'Agência',
                    urls: [{ title: 'Informações Bancárias', url: '/agencia' }, { title: 'Editar - Agência' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirAgenciaComponent,
                data: {
                    title: 'Agência',
                    urls: [{ title: 'Informações Bancárias', url: '/agencia' }, { title: 'Excluir - Agência' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarAgenciaComponent,
                data: {
                    title: 'Agência',
                    urls: [{ title: 'Informações Bancárias', url: '/agencia' }, { title: 'Reativar - Agência' }]
                }
            },
            { path: 'lista', component: ListaAgenciaComponent,
                data: {
                    title: 'Agência',
                    urls: [{ title: 'Informações Bancárias', url: '/agencia' }, { title: 'Lista - Agência' }]
                }
            }            
        ]
    }
];