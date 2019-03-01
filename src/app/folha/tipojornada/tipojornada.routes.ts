import { Routes } from '@angular/router';

import { TipojornadaComponent } from './tipojornada.component';
import { ListaTipojornadaComponent } from './lista-tipojornada/lista-tipojornada.component';
import { AdicionarTipojornadaComponent } from './adicionar-tipojornada/adicionar-tipojornada.component';
import { ReativarTipojornadaComponent } from './reativar-tipojornada/reativar-tipojornada.component';
import { EditarTipojornadaComponent } from './editar-tipojornada/editar-tipojornada.component';
import { ExcluirTipojornadaComponent } from './excluir-tipojornada/excluir-tipojornada.component';


export const tipoJornadaRouterConfig : Routes =  [
    {
        path: '', component: TipojornadaComponent,
        children: [
            { path: '', component: ListaTipojornadaComponent,
                data: {
                    title: 'Cadastro Tipo Jornada',
                    urls: [{title: 'Folha',url: '/tipojornada'},{title: 'Tipo Jornada'}]
                }
            },
            { path: 'adicionar', component: AdicionarTipojornadaComponent,
                data: {
                    title: 'Cadastro Tipo Jornada',
                    urls: [{title: 'Folha',url: '/tipojornada'},{title: 'Tipo Jornada'}]
                }
            },
            { path: 'editar/:id',  component: EditarTipojornadaComponent,
                data: {
                    title: 'Cadastro Tipo Jornada',
                    urls: [{title: 'Folha',url: '/tipojornada'},{title: 'Tipo Jornada'}]
                }
            },
            { path: 'lista', component: ListaTipojornadaComponent,
                data: {
                    title: 'Cadastro Tipo Jornada',
                    urls: [{title: 'Folha',url: '/tipojornada'},{title: 'Tipo Jornada'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirTipojornadaComponent, 
                data: {
                    title: 'Cadastro Tipo Jornada',
                    urls: [{title: 'Folha',url: '/tipojornada'},{title: 'Tipo Jornada'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarTipojornadaComponent,
                data: {
                    title: 'Cadastro Tipo Jornada',
                    urls: [{title: 'Folha',url: '/tipojornada'},{title: 'Tipo Jornada'}]
                }
            }             
        ]
    }
]; 

