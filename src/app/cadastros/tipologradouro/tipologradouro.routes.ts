import { Routes } from '@angular/router';

import { TipoLogradouroComponent } from "./tipologradouro.component";
import { ListaTipoLogradouroComponent } from './lista-tipologradouro/lista-tipologradouro.component';
import { AdicionarTipoLogradouroComponent } from './adicionar-tipologradouro/adicionar-tipologradouro.component';
import { EditarTipoLogradouroComponent } from './editar-tipologradouro/editar-tipologradouro.component';
import { ExcluirTipologradouroComponent } from './excluir-tipologradouro/excluir-tipologradouro.component';
import { ReativarTipologradouroComponent } from './reativar-tipologradouro/reativar-tipologradouro.component';

export const tipoLogradouroRouterConfig: Routes = [
    {
        path: '', component: TipoLogradouroComponent,
        data: {
            title: 'Tipos de Logradouro',
            urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
        },
        children: [
            { path: '', component: ListaTipoLogradouroComponent, 
                data: {
                    title: 'Tipos de Logradouro',
                    urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
                }
            },
            { path: 'adicionar', component: AdicionarTipoLogradouroComponent, 
                data: {
                    title: 'Tipos de Logradouro',
                    urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
                }
            },
            { path: 'editar/:id',  component: EditarTipoLogradouroComponent, 
                data: {
                    title: 'Tipos de Logradouro',
                    urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
                }
            },
            { path: 'lista', component: ListaTipoLogradouroComponent, 
                data: {
                    title: 'Tipos de Logradouro',
                    urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirTipologradouroComponent,  
                data: {
                    title: 'Tipos de Logradouro',
                    urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarTipologradouroComponent, 
                data: {
                    title: 'Tipos de Logradouro',
                    urls: [{title: 'Cadastros',url:'/tipologradouro'},{title: 'Tipos de Logradouro'}]
                }
            }             
        ]
    }
];