import { Routes } from '@angular/router';

import { ObservacaoComponent } from './observacao.component';
import { ListaObservacaoComponent } from './lista-observacao/lista-observacao.component';
import { AdicionarObservacaoComponent } from './adicionar-observacao/adicionar-observacao.component';
import { EditarObservacaoComponent } from './editar-observacao/editar-observacao.component';
import { ReativarObservacaoComponent } from './reativar-observacao/reativar-observacao.component';
import { ExcluirObservacaoComponent } from './excluir-observacao/excluir-observacao.component';

export const observacaoRouterConfig: Routes = [
    {
        path: '', component: ObservacaoComponent,
        data: {
            title: 'Observação',
            urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
        },
        children: [
            { path: '', component: ListaObservacaoComponent, 
                data: {
                    title: 'Observação',
                    urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
                }
            },
            { path: 'adicionar', component: AdicionarObservacaoComponent, 
                data: {
                    title: 'Observação',
                    urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
                }
            },
            { path: 'editar/:id',  component: EditarObservacaoComponent, 
                data: {
                    title: 'Observação',
                    urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirObservacaoComponent, 
                data: {
                    title: 'Observação',
                    urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
                }
            },
            { path: 'reativar/:id',  component: ReativarObservacaoComponent, 
                data: {
                    title: 'Observação',
                    urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
                }
            },
            { path: 'lista', component: ListaObservacaoComponent, 
                data: {
                    title: 'Observação',
                    urls: [{title: 'Faturamento',url: '/observacao'},{title: 'Observação'}]
                }
            }           
        ]
    }
];