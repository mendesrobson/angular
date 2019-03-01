import { Routes } from '@angular/router';

import { AgenteintegradorComponent } from './agenteintegrador.component';
import { ListaAgenteintegradorComponent } from './lista-agenteintegrador/lista-agenteintegrador.component';
import { AdicionarAgenteintegradorComponent } from './adicionar-agenteintegrador/adicionar-agenteintegrador.component';
import { EditarAgenteintegradorComponent } from './editar-agenteintegrador/editar-agenteintegrador.component';
import { ExcluirAgenteintegradorComponent } from './excluir-agenteintegrador/excluir-agenteintegrador.component';
import { ReativarAgenteintegradorComponent } from './reativar-agenteintegrador/reativar-agenteintegrador.component';


export const agenteintegradorRouterConfig: Routes = [
    {
        path: '', component: AgenteintegradorComponent,
        children: [
            { path: '', component: ListaAgenteintegradorComponent,
                data: {
                    title: 'Cadastro Agente Integrador',
                    urls: [{title: 'Folha',url: '/agenteintegrador'},{title: 'Agente Integrador'}]
                }
            },
            { path: 'adicionar', component: AdicionarAgenteintegradorComponent,
                data: {
                    title: 'Cadastro Agente Integrador',
                    urls: [{title: 'Folha',url: '/agenteintegrador'},{title: 'Agente Integrador'}]
                }
            },
            { path: 'editar/:id',  component: EditarAgenteintegradorComponent,
                data: {
                    title: 'Cadastro Agente Integrador',
                    urls: [{title: 'Folha',url: '/agenteintegrador'},{title: 'Agente Integrador'}]
                }
            },
            { path: 'lista', component: ListaAgenteintegradorComponent,
                data: {
                    title: 'Cadastro Agente Integrador',
                    urls: [{title: 'Folha',url: '/agenteintegrador'},{title: 'Agente Integrador'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirAgenteintegradorComponent, 
                data: {
                    title: 'Cadastro Agente Integrador',
                    urls: [{title: 'Folha',url: '/agenteintegrador'},{title: 'Agente Integrador'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarAgenteintegradorComponent,
                data: {
                    title: 'Cadastro Agente Integrador',
                    urls: [{title: 'Folha',url: '/agenteintegrador'},{title: 'Agente Integrador'}]
                }
            }             
        ]
    }
];
