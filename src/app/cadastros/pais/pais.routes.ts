import { Routes } from '@angular/router';
import { PaisComponent } from './pais.component';
import { ReativarPaisComponent } from './reativar-pais/reativar-pais.component';
import { ExcluirPaisComponent } from './excluir-pais/excluir-pais.component';
import { EditarPaisComponent } from './editar-pais/editar-pais.component';
import { AdicionarPaisComponent } from './adicionar-pais/adicionar-pais.component';
import { ListaPaisComponent } from './lista-pais/lista-pais.component';


  export const PaisRouterConfig: Routes = [
    {
        path: '', component: PaisComponent,
        data: {
            title: 'País',
            urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
        },
        children: [
            { path: '', component: ListaPaisComponent,
                data: {
                    title: 'País',
                    urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
                }
             },
            { path: 'adicionar', component: AdicionarPaisComponent,
                data: {
                    title: 'País',
                    urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
                }
            },
            { path: 'editar/:id',  component: EditarPaisComponent, 
                data: {
                    title: 'País',
                    urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
                }
            },
            { path: 'lista',  component: ListaPaisComponent,
                data: {
                    title: 'País',
                    urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirPaisComponent,
                data: {
                    title: 'País',
                    urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarPaisComponent, 
                data: {
                    title: 'País',
                    urls: [{ title: 'Cadastro', url: '/pais' }, { title: 'País' }]
                }
            }         
        ]
    }
];