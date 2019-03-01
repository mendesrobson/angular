import { Routes } from '@angular/router';
import { ParametroFaturamentoComponent } from './parametrofaturamento.component';
import { ListaParametroFaturamentoComponent } from './lista-parametrofaturamento/lista-parametrofaturamento.component';
import { ReativarParametroFaturamentoComponent } from './reativar-parametrofaturamento/reativar-parametrofaturamento.component';
import { AdicionarParametroFaturamentoComponent } from './adicionar-parametrofaturamento/adicionar-parametrofaturamento.component';
import { ExcluirParametroFaturamentoComponent } from './excluir-parametrofaturamento/excluir-parametrofaturamento.component';
import { EditarParametroFaturamentoComponent } from './editar-parametrofaturamento/editar-parametrofaturamento.component';


export const parametroFaturamentoRouterConfig: Routes = [
    {
        path: '', component: ParametroFaturamentoComponent,
        children: [
            { path: '', component: ListaParametroFaturamentoComponent,
                data:{
                    title:'Parâmetro Faturamento',
                    urls:[{title: 'Faturamento',url:'/parametrofaturamento'},{title: 'Faturamento'}]
                }
            },
            { path: 'adicionar', component: AdicionarParametroFaturamentoComponent, 
                data:{
                    title:'Parâmetro Faturamento',
                    urls:[{title: 'Faturamento',url:'/parametrofaturamento'},{title: 'Faturamento'}]
                }
            },
            { path: 'editar/:id',  component: EditarParametroFaturamentoComponent, 
                data:{
                    title:'Parâmetro Faturamento',
                    urls:[{title: 'Faturamento',url:'/parametrofaturamento'},{title: 'Faturamento'}]
                }
            },
            { path: 'excluir/:id',  component: ExcluirParametroFaturamentoComponent, 
                data:{
                    title:'Parâmetro Faturamento',
                    urls:[{title: 'Faturamento',url:'/parametrofaturamento'},{title: 'Faturamento'}]
                }
            },
            { path: 'reativar/:id',  component: ReativarParametroFaturamentoComponent, 
                data:{
                    title:'Parâmetro Faturamento',
                    urls:[{title: 'Faturamento',url:'/parametrofaturamento'},{title: 'Faturamento'}]
                }
            },
            { path: 'lista', component: ListaParametroFaturamentoComponent, 
                data:{
                    title:'Parâmetro Faturamento',
                    urls:[{title: 'Faturamento',url:'/parametrofaturamento'},{title: 'Faturamento'}]
                }
            }            
        ]
    }
];