import { Routes } from '@angular/router';
import { AdicionarAgentecausadoracidenteComponent } from './adicionar-agentecausadoracidente/adicionar-agentecausadoracidente.component';
import { ListaAgentecausadoracidenteComponent } from './lista-agentecausadoracidente/lista-agentecausadoracidente.component';
import { EditarAgentecausadoracidenteComponent } from './editar-agentecausadoracidente/editar-agentecausadoracidente.component';
import { ExcluirAgentecausadoracidenteComponent } from './excluir-agentecausadoracidente/excluir-agentecausadoracidente.component';
import { ReativarAgentecausadoracidenteComponent } from './reativar-agentecausadoracidente/reativar-agentecausadoracidente.component';
import { AgentecausadoracidenteComponent } from './agentecausadoracidente.component';


export const agentecausadoracidenteRouterConfig: Routes = [
    {
        path: '', component: AgentecausadoracidenteComponent,
        children: [
            { path: '', component: ListaAgentecausadoracidenteComponent,
                data: {
                    title: 'Agente Causador do Acidente',
                    urls: [{title: 'Folha', url: '/agentecausadoracidente'}, {title: 'Agente Causador do Acidente'}]
                }
            },
            { path: 'adicionar', component: AdicionarAgentecausadoracidenteComponent,
                data: {
                    title: 'Agente Causador do Acidente',
                    urls: [{title: 'Folha', url: '/agentecausadoracidente'}, {title: 'Agente Causador do Acidente'}]
                }
            },
            { path: 'editar/:id',  component: EditarAgentecausadoracidenteComponent,
                data: {
                    title: 'Agente Causador do Acidente',
                    urls: [{title: 'Folha', url: '/agentecausadoracidente'}, {title: 'Agente Causador do Acidente'}]
                }
            },
            { path: 'lista', component: ListaAgentecausadoracidenteComponent,
                data: {
                    title: 'Agente Causador do Acidente',
                    urls: [{title: 'Folha', url: '/agentecausadoracidente'}, {title: 'Agente Causador do Acidente'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirAgentecausadoracidenteComponent,
                data: {
                    title: 'Agente Causador do Acidente',
                    urls: [{title: 'Folha', url: '/agentecausadoracidente'}, {title: 'Agente Causador do Acidente'}]
                }
            },
            { path: 'reativar/:id', component: ReativarAgentecausadoracidenteComponent,
                data: {
                    title: 'Agente Causador do Acidente',
                    urls: [{title: 'Folha', url: '/agentecausadoracidente'}, {title: 'Agente Causador do Acidente'}]
                }
            }
        ]
    }
];
