import { Routes } from '@angular/router';

import { CentroresultadoComponent } from './centroresultado.component';
import { ListaCentroresultadoComponent } from './lista-centroresultado/lista-centroresultado.component';
import { AdicionarCentroresultadoComponent } from './adicionar-centroresultado/adicionar-centroresultado.component';
import { EditarCentroresultadoComponent } from './editar-centroresultado/editar-centroresultado.component';
import { ExcluirCentroresultadoComponent } from './excluir-centroresultado/excluir-centroresultado.component';
import { ReativarCentroresultadoComponent } from './reativar-centroresultado/reativar-centroresultado.component';

export const centroResultadoRouterConfig: Routes = [
    {
        path: '', component: CentroresultadoComponent,
        data: {
            title: 'Centro de Resultado',
            urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
        },
        children: [
            { path: '', component: ListaCentroresultadoComponent,
                data: {
                    title: 'Centro de Resultado',
                    urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
                }
             },
            { path: 'adicionar', component: AdicionarCentroresultadoComponent,
                data: {
                    title: 'Centro de Resultado',
                    urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
                }
            },
            { path: 'editar/:id',  component: EditarCentroresultadoComponent, 
                data: {
                    title: 'Centro de Resultado',
                    urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirCentroresultadoComponent,
                data: {
                    title: 'Centro de Resultado',
                    urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarCentroresultadoComponent, 
                data: {
                    title: 'Centro de Resultado',
                    urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
                }
            },
            { path: 'lista', component: ListaCentroresultadoComponent,
                data: {
                    title: 'Centro de Resultado',
                    urls: [{ title: 'Centro de Resultado', url: '/centroresultado' }, { title: 'Centro de Resultado' }]
                }
            }            
        ]
    }
];