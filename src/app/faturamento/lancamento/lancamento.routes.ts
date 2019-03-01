import { Routes } from '@angular/router';
import { LancamentoComponent } from './lancamento.component';
import { ListaLancamentoComponent } from './lista-lancamento/lista-lancamento.component';
import { AdicionarLancamentoComponent } from './adicionar-lancamento/adicionar-lancamento.component';
import { EditarLancamentoComponent } from './editar-lancamento/editar-lancamento.component';
import { ExcluirLancamentoComponent } from './excluir-lancamento/excluir-lancamento.component';
import { ReativarLancamentoComponent } from './reativar-lancamento/reativar-lancamento.component';


export const lancamentoRouterConfig: Routes = [
    {
        path: '', component: LancamentoComponent,
        children: [
            { path: '', component: ListaLancamentoComponent,
                data:{
                    title:'Cadastro de Lançamento',
                    urls:[{title: 'Faturamento',url:'/lancamento'},{title: 'Lançamento'}]
                }
            },
            { path: 'adicionar', component: AdicionarLancamentoComponent, 
                data:{
                    title:'Cadastro de Lançamento',
                    urls:[{title: 'Faturamento',url:'/lancamento'},{title: 'Lançamento'}]
                }
            },
            { path: 'editar/:id',  component: EditarLancamentoComponent, 
                data:{
                    title:'Cadastro de Lançamento',
                    urls:[{title: 'Faturamento',url:'/lancamento'},{title: 'Lançamento'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirLancamentoComponent,
                data:{
                    title:'Cadastro de Lançamento',
                    urls:[{title: 'Faturamento',url:'/lancamento'},{title: 'Lançamento'}]
                }
            },
            { path: 'reativar/:id',  component: ReativarLancamentoComponent,
                data:{
                    title:'Cadastro de Lançamento',
                    urls:[{title: 'Faturamento',url:'/lancamento'},{title: 'Lançamento'}]
                }
            },
            { path: 'lista', component: ListaLancamentoComponent,
                data:{
                    title:'Cadastro de Lançamento',
                    urls:[{title: 'Faturamento',url:'/lancamento'},{title: 'Lançamento'}]
                }
            }            
        ]
    }
];