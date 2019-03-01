import { Routes } from '@angular/router';

import { TipoenderecoComponent } from './tipoendereco.component';
import { ListaTipoenderecoComponent } from './lista-tipoendereco/lista-tipoendereco.component';
import { AdicionarTipoenderecoComponent } from './adicionar-tipoendereco/adicionar-tipoendereco.component';
import { EditarTipoenderecoComponent } from './editar-tipoendereco/editar-tipoendereco.component';
import { ExcluirTipoenderecoComponent } from './excluir-tipoendereco/excluir-tipoendereco.component';
import { ReativarTipoenderecoComponent } from './reativar-tipoendereco/reativar-tipoendereco.component';

export const tipoenderecoRouterConfig: Routes = [
    {
        path: '', component: TipoenderecoComponent,
        children: [
            { path: '', component: ListaTipoenderecoComponent,
                data: {
                    title: 'Tipos de Endereços',
                    urls: [{title: 'Cadastro',url: '/tipoendereco'},{title: 'Tipos de Endereços'}]
                }
            },
            { path: 'adicionar', component: AdicionarTipoenderecoComponent,
                data: {
                    title: 'Tipos de Endereços',
                    urls: [{title: 'Cadastro',url: '/tipoendereco'},{title: 'Tipos de Endereços'}]
                }
            },
            { path: 'editar/:id',  component: EditarTipoenderecoComponent,
                data: {
                    title: 'Tipos de Endereços',
                    urls: [{title: 'Cadastro',url: '/tipoendereco'},{title: 'Tipos de Endereços'}]
                }
            },
            { path: 'lista', component: ListaTipoenderecoComponent,
                data: {
                    title: 'Tipos de Endereços',
                    urls: [{title: 'Cadastro',url: '/tipoendereco'},{title: 'Tipos de Endereços'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirTipoenderecoComponent, 
                data: {
                    title: 'Tipos de Endereços',
                    urls: [{title: 'Cadastro',url: '/tipoendereco'},{title: 'Tipos de Endereços'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarTipoenderecoComponent,
                data: {
                    title: 'Tipos de Endereços',
                    urls: [{title: 'Cadastro',url: '/tipoendereco'},{title: 'Tipos de Endereços'}]
                }
            }             
        ]
    }
];