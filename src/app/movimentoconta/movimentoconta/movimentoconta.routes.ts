import { Routes } from '@angular/router';
import { MovimentoContaComponent } from './movimentoconta.component';
import { ListaMovimentoContaComponent } from './lista-movimentoconta/lista-movimentoconta.component';
import { AdicionarMovimentoContaComponent } from './adicionar-movimentoconta/adicionar-movimentoconta.component';
import { ConsultaMovimentoContaComponent } from './consulta-movimentoconta/consulta-movimentoconta.component';
import { ExcluirMovimentoContaComponent } from './excluir-movimentoconta/excluir-movimentoconta.component';

export const movimentoContaRouterConfig: Routes = [
    {
        path: '', component: MovimentoContaComponent,
        children: [
            { path: '', component: ListaMovimentoContaComponent,
                data:{
                    title:'Lançar Movimento',
                    urls:[{title: 'Movimentação',url:'/movimentoconta/lista'},{title: 'Movimentação'}]
                }
            },
            { path: 'lista', component: ListaMovimentoContaComponent,
                data:{
                    title:'Lançar Movimento',
                    urls:[{title: 'Movimentação',url:'/movimentoconta/lista'},{title: 'Movimentação'}]
                }
            },
            { path: 'adicionar', component: AdicionarMovimentoContaComponent,
                data:{
                    title:'Lançar Movimento',
                    urls:[{title: 'Movimentação',url:'/movimentoconta/lista'},{title: 'Movimentação'}]
                }
            },
            { path: 'consultar/:id', component: ConsultaMovimentoContaComponent,
                data:{
                    title:'Lançar Movimento',
                    urls:[{title: 'Movimentação',url:'/movimentoconta/lista'},{title: 'Movimentação'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirMovimentoContaComponent,
                data:{
                    title:'Lançar Movimento',
                    urls:[{title: 'Movimentação',url:'/movimentoconta/lista'},{title: 'Movimentação'}]
                }
            }
        ]
    }
]