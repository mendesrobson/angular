import { Routes } from '@angular/router';

import { ParentescoComponent } from './parentesco.component';
import { ListaParentescoComponent } from './lista-parentesco/lista-parentesco.component';
import { AdicionarParentescoComponent } from './adicionar-parentesco/adicionar-parentesco.component';
import { ReativarParentescoComponent } from './reativar-parentesco/reativar-parentesco.component';
import { EditarParentescoComponent } from './editar-parentesco/editar-parentesco.component';
import { ExcluirParentescoComponent } from './excluir-parentesco/excluir-parentesco.component';


export const parentescoRouterConfig: Routes = [
    // {
    //     path: '', component: ParentescoComponent,
    //     children: [
    //         { path: '', component: ListaParentescoComponent },
    //         { path: 'adicionar', component: AdicionarParentescoComponent },
    //         { path: 'editar/:id', component: EditarParentescoComponent, },
    //         { path: 'lista', component: ListaParentescoComponent, },
    //         { path: 'excluir/:id', component: ExcluirParentescoComponent, },
    //         { path: 'reativar/:id', component: ReativarParentescoComponent }
    //     ]
    // }

    {
        path: '', component: ParentescoComponent,
        children: [
            { path: '', component: ListaParentescoComponent,
                data: {
                    title: 'Cadastro Parentesco',
                    urls: [{title: 'Folha',url: '/parentesco'},{title: 'Parentesco'}]
                }
            },
            { path: 'adicionar', component: AdicionarParentescoComponent,
                data: {
                    title: 'Cadastro Parentesco',
                    urls: [{title: 'Folha',url: '/parentesco'},{title: 'Parentesco'}]
                }
            },
            { path: 'editar/:id',  component: EditarParentescoComponent,
                data: {
                    title: 'Cadastro Parentesco',
                    urls: [{title: 'Folha',url: '/parentesco'},{title: 'Parentesco'}]
                }
            },
            { path: 'lista', component: ListaParentescoComponent,
                data: {
                    title: 'Cadastro Parentesco',
                    urls: [{title: 'Folha',url: '/parentesco'},{title: 'Parentesco'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirParentescoComponent, 
                data: {
                    title: 'Cadastro Parentesco',
                    urls: [{title: 'Folha',url: '/parentesco'},{title: 'Parentesco'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarParentescoComponent,
                data: {
                    title: 'Cadastro Parentesco',
                    urls: [{title: 'Folha',url: '/parentesco'},{title: 'Parentesco'}]
                }
            }             
        ]
    }
];
