import { Routes } from '@angular/router';

import { CargoComponent } from "./cargo.component";
import { ListaCargoComponent } from './lista-cargo/lista-cargo.component';
import { AdicionarCargoComponent } from './adicionar-cargo/adicionar-cargo.component';
import { EditarCargoComponent } from './editar-cargo/editar-cargo.component';
import { ExcluirCargoComponent } from './excluir-cargo/excluir-cargo.component';
import { ReativarCargoComponent } from './reativar-cargo/reativar-cargo.component';

export const cargoRouterConfig: Routes = [
    {
        path: '', component: CargoComponent,
        children: [
            { path: '', component: ListaCargoComponent,
                data: {
                    title: 'Cadastro Cargo',
                    urls: [{title: 'Folha',url: '/cargo'},{title: 'Cadastro Cargo'}]
                }
             },
            { path: 'adicionar', component: AdicionarCargoComponent,
                data: {
                    title: 'Cadastro Cargo',
                    urls: [{title: 'Folha',url: '/cargo'},{title: 'Cadastro Cargo'}]
                }
            },
            { path: 'editar/:id',  component: EditarCargoComponent,
                data: {
                    title: 'Cadastro Cargo',
                    urls: [{title: 'Folha',url: '/cargo'},{title: 'Cadastro Cargo'}]
                }
            },
            { path: 'lista', component: ListaCargoComponent, 
                data: {
                    title: 'Cadastro Cargo',
                    urls: [{title: 'Folha',url: '/cargo'},{title: 'Cadastro Cargo'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirCargoComponent,  
                data: {
                    title: 'Cadastro Cargo',
                    urls: [{title: 'Folha',url: '/cargo'},{title: 'Cadastro Cargo'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarCargoComponent,
                data: {
                    title: 'Cadastro Cargo',
                    urls: [{title: 'Folha',url: '/cargo'},{title: 'Cadastro Cargo'}]
                }
            }             
        ]
    }
];