import { Routes } from '@angular/router';

import { TestemunhaComponent } from "./testemunha.component";
import { ListaTestemunhaComponent } from './lista-testemunha/lista-testemunha.component';
import { AdicionarTestemunhaComponent } from './adicionar-testemunha/adicionar-testemunha.component';
import { EditarTestemunhaComponent } from './editar-testemunha/editar-testemunha.component';
import { ExcluirTestemunhaComponent } from './excluir-testemunha/excluir-testemunha.component';
import { ReativarTestemunhaComponent } from './reativar-testemunha/reativar-testemunha.component';

export const testemunhaRouterConfig: Routes = [
    {
        path: '', component: TestemunhaComponent,
        data: {
            title: 'Testemunha',
            urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
        },
        children: [
            { path: '', component: ListaTestemunhaComponent,
                data: {
                    title: 'Testemunha',
                    urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
                } 
            },
            { path: 'adicionar', component: AdicionarTestemunhaComponent, 
                data: {
                    title: 'Testemunha',
                    urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
                }
            },
            { path: 'editar/:id',  component: EditarTestemunhaComponent, 
                data: {
                    title: 'Testemunha',
                    urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirTestemunhaComponent,
                data: {
                    title: 'Testemunha',
                    urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
                }
            },
            { path: 'reativar/:id', component: ReativarTestemunhaComponent,
                data: {
                    title: 'Testemunha',
                    urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
                }
            },                
            { path: 'lista', component: ListaTestemunhaComponent, 
                data: {
                    title: 'Testemunha',
                    urls: [{title: 'Faturamento',url:'/testemunha'},{title: 'Testemunha'}]
                }
            }
        ]
    }
];