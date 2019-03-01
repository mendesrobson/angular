import { Routes } from '@angular/router';
import { CorRacaComponent } from './corraca.component';
import { ReativarCorRacaComponent } from './reativar-corraca/reativar-corraca.component';
import { ExcluirCorRacaComponent } from './excluir-corraca/excluir-corraca.component';
import { EditarCorRacaComponent } from './editar-corraca/editar-corraca.component';
import { AdicionarCorRacaComponent } from './adicionar-corraca/adicionar-corraca.component';
import { ListaCorRacaComponent } from './lista-corraca/lista-corraca.component';


  export const CorRacaRouterConfig: Routes = [
    {
        path: '', component: CorRacaComponent,
        data: {
            title: 'Cor / Raça',
            urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
        },
        children: [
            { path: '', component: ListaCorRacaComponent,
                data: {
                    title: 'Cor / Raça',
                    urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
                }
             },
            { path: 'adicionar', component: AdicionarCorRacaComponent,
                data: {
                    title: 'Cor / Raça',
                    urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
                }
            },
            { path: 'editar/:id',  component: EditarCorRacaComponent, 
                data: {
                    title: 'Cor / Raça',
                    urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
                }
            },
            { path: 'lista',  component: ListaCorRacaComponent,
                data: {
                    title: 'Cor / Raça',
                    urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirCorRacaComponent,
                data: {
                    title: 'Cor / Raça',
                    urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarCorRacaComponent, 
                data: {
                    title: 'Cor / Raça',
                    urls: [{ title: 'Cadastro', url: '/corraca' }, { title: 'Cor / Raça' }]
                }
            }         
        ]
    }
];