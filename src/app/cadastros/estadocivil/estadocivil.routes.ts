import { Routes } from '@angular/router';
import { EstadocivilComponent } from './estadocivil.component';
import { ListaEstadocivilComponent } from './lista-estadocivil/lista-estadocivil.component';
import { AdicionarEstadocivilComponent } from './adicionar-estadocivil/adicionar-estadocivil.component';
import { EditarEstadocivilComponent } from './editar-estadocivil/editar-estadocivil.component';
import { ExcluirEstadocivilComponent } from './excluir-estadocivil/excluir-estadocivil.component';
import { ReativarEstadocivilComponent } from './reativar-estadocivil/reativar-estadocivil.component';

  export const EstadocivilRouterConfig: Routes = [
    {
        path: '', component: EstadocivilComponent,
        data: {
            title: 'Estado Civil',
            urls: [{ title: 'Cadastro', url: '/estadocivil' }, { title: 'Estado Civil' }]
        },
        children: [
            { path: '', component: ListaEstadocivilComponent,
                data: {
                    title: 'Estado Civil',
                    urls: [{ title: 'Cadastro', url: '/estadocivil' }, { title: 'Estado Civil' }]
                }
             },
            { path: 'adicionar', component: AdicionarEstadocivilComponent,
                data: {
                    title: 'Estado Civil',
                    urls: [{ title: 'Cadastro', url: '/estadocivil' }, { title: 'Estado Civil' }]
                }
            },
            { path: 'editar/:id',  component: EditarEstadocivilComponent, 
                data: {
                    title: 'Estado Civil',
                    urls: [{ title: 'Cadastro', url: '/estadocivil' }, { title: 'Estado Civil' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirEstadocivilComponent,
                data: {
                    title: 'Estado Civil',
                    urls: [{ title: 'Cadastro', url: '/estadocivil' }, { title: 'Estado Civil' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarEstadocivilComponent, 
                data: {
                    title: 'Estado Civil',
                    urls: [{ title: 'Cadastro', url: '/estadocivil' }, { title: 'Estado Civil' }]
                }
            }         
        ]
    }
];