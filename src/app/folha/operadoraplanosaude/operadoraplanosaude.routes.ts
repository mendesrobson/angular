import { Routes } from '@angular/router';

import { OperadoraplanosaudeComponent } from './operadoraplanosaude.component';
import { AdicionarOperadoraPlanoSaudeComponent } from './adicionar-operadoraplanosaude/adicionar-operadoraplanosaude.component';
import { EditarOperadoraPlanoSaudeComponent } from './editar-operadoraplanosaude/editar-operadoraplanosaude.component';
import { ExcluirOperadoraPlanoSaudeComponent } from './excluir-operadoraplanosaude/excluir-operadoraplanosaude.component';
import { ListaOperadoraPlanoSaudeComponent } from './lista-operadoraplanosaude/lista-operadoraplanosaude.component';
import { ReativarOperadoraPlanoSaudeComponent } from './reativar-operadoraplanosaude/reativar-operadoraplanosaude.component';

export const OperadoraPlanoSaudeRouterConfig: Routes = [
    {
        path: '', component: OperadoraplanosaudeComponent,
        children: [
            { path: '', component: ListaOperadoraPlanoSaudeComponent,
            data: {
                title: 'Cadastro Operadora de Plano de Saúde',
                urls: [{title: 'Folha', url: '/operadoraplanosaude'}, {title: 'Cadastro Operadora de Plano de Saúde'}]
            }
           },
            { path: 'adicionar', component: AdicionarOperadoraPlanoSaudeComponent,
                data: {
                    title: 'Cadastro Operadora de Plano de Saúde',
                    urls: [{title: 'Folha', url: '/operadoraplanosaude'}, {title: 'Cadastro Operadora de Plano de Saúde'}]
                }
            },
            { path: 'editar/:id',  component: EditarOperadoraPlanoSaudeComponent,
                data: {
                    title: 'Editar Operadora de Plano de Saúde',
                    urls: [{title: 'Folha', url: '/operadoraplanosaude'}, {title: 'Editar Operadora de Plano de Saúde'}]
                }
            },
            { path: 'lista', component: ListaOperadoraPlanoSaudeComponent,
                data: {
                    title: 'Listar Operadora de Plano de Saúde',
                    urls: [{title: 'Folha', url: '/operadoraplanosaude'}, {title: 'Listar Operadora de Plano de Saúde'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirOperadoraPlanoSaudeComponent,
                data: {
                    title: 'Excluir Operadora de Plano de Saúde',
                    urls: [{title: 'Folha', url: '/operadoraplanosaude'}, {title: 'Excluir Operadora de Plano de Saúde'}]
                }
            },
            { path: 'reativar/:id', component: ReativarOperadoraPlanoSaudeComponent,
                data: {
                    title: 'Reativar Operadora de Plano de Saúde',
                    urls: [{title: 'Folha', url: '/operadoraplanosaude'}, {title: 'Reativar Operadora de Plano de Saúde'}]
                }
            }
        ]
    }
];