import { Routes } from "@angular/router";
import { LeiauteArquivoBancarioComponent } from "./leiautearquivobancario.component";
import { ListaLeiauteArquivoBancarioComponent } from "./lista-leiautearquivobancario/lista-leiautearquivobancario.component";
import { AdicionarLeiauteArquivoBancarioComponent } from "./adicionar-leiautearquivobancario/adicionar-leiautearquivobancario.component";
import { EditarLeiauteArquivoBancarioComponent } from "./editar-leiautearquivobancario/editar-leiautearquivobancario.component";
import { ExcluirLeiauteArquivoBancarioComponent } from "./excluir-leiautearquivobancario/excluir-leiautearquivobancario.component";


export const LeiauteArquivoBancarioConfig: Routes = [
    {
        path: '', component: LeiauteArquivoBancarioComponent,
        data: {
            title: 'Layout p/ Arquivo Bancário',
            urls: [{title: 'Contas a Pagar',url: '/leiautearquivobancario'},{title: 'Layout p/ Arquivo Bancário'}]
        },
        children: [
            { path: '', component: ListaLeiauteArquivoBancarioComponent, 
                data: {
                    title: 'Layout p/ Arquivo Bancário',
                    urls: [{title: 'Contas a Pagar',url: '/leiautearquivobancario'},{title: 'Layout p/ Arquivo Bancário'}]
                }
            },
            { path: 'lista', component: ListaLeiauteArquivoBancarioComponent, 
                data: {
                    title: 'Layout p/ Arquivo Bancário',
                    urls: [{title: 'Contas a Pagar',url: '/leiautearquivobancario'},{title: 'Layout p/ Arquivo Bancário'}]
                }
            },
            { path: 'adicionar', component: AdicionarLeiauteArquivoBancarioComponent, 
                data: {
                    title: 'Layout p/ Arquivo Bancário',
                    urls: [{title: 'Contas a Pagar',url: '/leiautearquivobancario'},{title: 'Layout p/ Arquivo Bancário'}]
                }
            },
            { path: 'editar/:id', component: EditarLeiauteArquivoBancarioComponent, 
                data: {
                    title: 'Layout p/ Arquivo Bancário',
                    urls: [{title: 'Contas a Pagar',url: '/leiautearquivobancario'},{title: 'Layout p/ Arquivo Bancário'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirLeiauteArquivoBancarioComponent, 
                data: {
                    title: 'Layout p/ Arquivo Bancário',
                    urls: [{title: 'Contas a Pagar',url: '/leiautearquivobancario'},{title: 'Layout p/ Arquivo Bancário'}]
                }
            }
        ]
    }
]