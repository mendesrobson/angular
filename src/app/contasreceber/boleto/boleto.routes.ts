import { Routes } from '@angular/router';
import { BoletoComponent } from './boleto.component';
import { GerarBoletoComponent } from './gerar-boleto/gerar-boleto.component';

export const boletoRouterConfig: Routes = [
    {
        path: '', component: BoletoComponent,
        children: [
            { path: '', component: GerarBoletoComponent, 
                data: {
                    title: 'Boletos',
                    urls: [{title: 'Contas a Receber',url:'/boleto'},{title: 'Boletos'}]
                }
            },
            { path: 'gerar', component: GerarBoletoComponent,
                data: {
                    title: 'Boletos',
                    urls: [{title: 'Contas a Receber',url:'/boleto'},{title: 'Gerar Boletos'}]
                }
            }
        ]
    }
];