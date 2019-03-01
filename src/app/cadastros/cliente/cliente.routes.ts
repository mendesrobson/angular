import { Routes } from '@angular/router';

import { ClienteComponent } from './cliente.component';
import { ListaClienteComponent } from './lista-cliente/lista-cliente.component';

export const clienteRouterConfig: Routes = [
    {
        path: '', component: ClienteComponent,
        data: {
            title: 'Cliente',
            urls: [{ title: 'Cliente', url: '/cliente' }, { title: 'Cliente' }]
        },
        children: [
            { path: '', component: ListaClienteComponent,
                data: {
                    title: 'Cliente',
                    urls: [{ title: 'Cliente', url: '/cliente' }, { title: 'Cliente' }]
                } 
            },            
            { path: 'lista', component: ListaClienteComponent,
                data: {
                    title: 'Cliente',
                    urls: [{ title: 'Cliente', url: '/cliente' }, { title: 'Cliente' }]
                }
            }
        ]
    }
];