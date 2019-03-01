import { Routes } from '@angular/router';

import { TipoContratoComponent } from './tipocontrato.component';
import { ListaTipoContratoComponent } from './lista-tipocontrato/lista-tipocontrato.component';
import { AdicionarTipoContratoComponent } from './adicionar-tipocontrato/adicionar-tipocontrato.component';
import { EditarTipoContratoComponent } from './editar-tipocontrato/editar-tipocontrato.component';
import { ExcluirTipoContratoComponent } from './excluir-tipocontrato/excluir-tipocontrato.component';
import { ReativarTipoContratoComponent } from './reativar-tipocontrato/reativar-tipocontrato.component';

export const tipoContratoRouterConfig: Routes = [
    {
        path: '', component: TipoContratoComponent,
        data: {
            title: 'Tipo de Contrato',
            urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
        },
        children: [
            { path: '', component: ListaTipoContratoComponent, 
                data: {
                    title: 'Tipo de Contrato',
                    urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
                }
            },
            { path: 'adicionar', component: AdicionarTipoContratoComponent, 
                data: {
                    title: 'Tipo de Contrato',
                    urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
                }
            },
            { path: 'editar/:id',  component: EditarTipoContratoComponent, 
                data: {
                    title: 'Tipo de Contrato',
                    urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirTipoContratoComponent, 
                data: {
                    title: 'Tipo de Contrato',
                    urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
                }
            },
            { path: 'reativar/:id',  component: ReativarTipoContratoComponent, 
                data: {
                    title: 'Tipo de Contrato',
                    urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
                }
            },
            { path: 'lista', component: ListaTipoContratoComponent, 
                data: {
                    title: 'Tipo de Contrato',
                    urls: [{title: 'Faturamento',url:'/tipocontrato'},{title: 'Tipo de Contrato'}]
                }
            }            
        ]
    }
];