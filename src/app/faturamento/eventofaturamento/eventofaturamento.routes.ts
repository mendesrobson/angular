import { Routes } from '@angular/router';

import { EventoFaturamentoComponent } from './eventofaturamento.component';
import { ListaEventoFaturamentoComponent } from './lista-eventofaturamento/lista-eventofaturamento.component';
import { AdicionarEventoFaturamentoComponent } from './adicionar-eventofaturamento/adicionar-eventofaturamento.component';
import { EditarEventoFaturamentoComponent } from './editar-eventofaturamento/editar-eventofaturamento.component';
import { ReativarEventoFaturamentoComponent } from './reativar-eventofaturamento/reativar-eventofaturamento.component';
import { ExcluirEventoFaturamentoComponent } from './excluir-eventofaturamento/excluir-eventofaturamento.component';

export const eventoFaturamentoRouterConfig: Routes = [
    {
        path: '', component: EventoFaturamentoComponent,
        children: [
            { path: '', component: ListaEventoFaturamentoComponent,
                data:{
                    title:'Eventos',
                    urls:[{title: 'Faturamento',url:'/eventofaturamento'},{title: 'Evento Faturamento'}]
                }
            },
            { path: 'adicionar', component: AdicionarEventoFaturamentoComponent,
                data:{
                    title:'Eventos',
                    urls:[{title: 'Faturamento',url:'/eventofaturamento'},{title: 'Evento Faturamento'}]
                }
            },
            { path: 'editar/:id',  component: EditarEventoFaturamentoComponent,
                data:{
                    title:'Eventos',
                    urls:[{title: 'Faturamento',url:'/eventofaturamento'},{title: 'Evento Faturamento'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirEventoFaturamentoComponent,
                data:{
                    title:'Eventos',
                    urls:[{title: 'Faturamento',url:'/eventofaturamento'},{title: 'Evento Faturamento'}]
                }
            },
            { path: 'reativar/:id',  component: ReativarEventoFaturamentoComponent, 
                data:{
                    title:'Eventos',
                    urls:[{title: 'Faturamento',url:'/eventofaturamento'},{title: 'Evento Faturamento'}]
                }
            },
            { path: 'lista', component: ListaEventoFaturamentoComponent,
            data:{
                title:'Eventos',
                urls:[{title: 'Faturamento',url:'/eventofaturamento'},{title: 'Evento Faturamento'}]
            } 
        }            
        ]
    }
];