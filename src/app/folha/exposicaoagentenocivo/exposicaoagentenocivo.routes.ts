import { Routes } from "../../../../node_modules/@angular/router";
import { ExposicaoagentenocivoComponent } from "./exposicaoagentenocivo.component";
import { ListaExposicaoagentenocivoComponent } from './lista-exposicaoagentenocivo/lista-exposicaoagentenocivo.component';
import { AdicionarExposicaoagentenocivoComponent } from './adicionar-exposicaoagentenocivo/adicionar-exposicaoagentenocivo.component';
import { EditarExposicaoagentenocivoComponent } from './editar-exposicaoagentenocivo/editar-exposicaoagentenocivo.component';
import { ExcluirExposicaoagentenocivoComponent } from './excluir-exposicaoagentenocivo/excluir-exposicaoagentenocivo.component';
import { ReativarExposicaoagentenocivoComponent } from './reativar-exposicaoagentenocivo/reativar-exposicaoagentenocivo.component';

export const exposicaoagentenocivoRouterConfig: Routes = [
    {
        path: '', component: ExposicaoagentenocivoComponent,
        children: [
            { path: '', component: ListaExposicaoagentenocivoComponent,
                data: {
                    title: 'Exposição Agente Nocivo',
                    urls: [{title: 'Folha',url: '/exposicaoagentenocivo'},{title: 'Exposição Agente Nocivo'}]
                }
             },
            { path: 'adicionar', component: AdicionarExposicaoagentenocivoComponent,
                data: {
                    title: 'Exposição Agente Nocivo',
                    urls: [{title: 'Folha',url: '/exposicaoagentenocivo'},{title: 'Exposição Agente Nocivo'}]
                }
            },
            { path: 'editar/:id',  component: EditarExposicaoagentenocivoComponent,
                data: {
                    title: 'Exposição Agente Nocivo',
                    urls: [{title: 'Folha',url: '/exposicaoagentenocivo'},{title: 'Exposição Agente Nocivo'}]
                }
            },
            { path: 'lista', component: ListaExposicaoagentenocivoComponent, 
                data: {
                    title: 'Exposição Agente Nocivo',
                    urls: [{title: 'Folha',url: '/exposicaoagentenocivo'},{title: 'Exposição Agente Nocivo'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirExposicaoagentenocivoComponent,  
                data: {
                    title: 'Exposição Agente Nocivo',
                    urls: [{title: 'Folha',url: '/exposicaoagentenocivo'},{title: 'Exposição Agente Nocivo'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarExposicaoagentenocivoComponent,
                data: {
                    title: 'Exposição Agente Nocivo',
                    urls: [{title: 'Folha',url: '/exposicaoagentenocivo'},{title: 'Exposição Agente Nocivo'}]
                }
            }             
        ]
    }
];