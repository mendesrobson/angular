import { Routes } from '@angular/router';
import { NfseComponent } from './nfse.component';
import { GerarNfseComponent } from './gerar-nfse/gerar-nfse.component';
import { ConsultarNfseComponent } from './consultar-nfse/consultar-nfse.component';

export const nfseRouterConfig: Routes = [
    {
        path: '', component: NfseComponent,
        data: {
            title: 'NFS-e',
            urls: [{title: 'Titulos a Receber',url:'/nfse'},{title: 'NFS-e'}]
        },
        children: [
            { path: '', component: GerarNfseComponent,
                data: {
                    title: 'NFS-e',
                    urls: [{title: 'Titulos a Receber',url:'/nfse'},{title: 'NFS-e'}]
                }
             },
            { path: 'gerar', component: GerarNfseComponent,
                data: {
                    title: 'NFS-e',
                    urls: [{title: 'Titulos a Receber',url:'/nfse'},{title: 'NFS-e'}]
                }
            },
            { path: 'consultar', component: ConsultarNfseComponent,
                data: {
                    title: 'NFS-e',
                    urls: [{title: 'Titulos a Receber',url:'/nfse'},{title: 'NFS-e'}]
                }
            }
        ]
    }
];