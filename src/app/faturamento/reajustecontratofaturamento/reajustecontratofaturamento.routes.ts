import { Routes } from '@angular/router';

import { ReajusteContratoFaturamentoComponent } from './reajustecontratofaturamento.component';
import { ListaContratoFaturamentoComponent } from './lista-contratofaturamento/lista-contratofaturamento.component';

export const reajusteContratoFaturamentoRouterConfig: Routes = [
    {
        path: '', component: ReajusteContratoFaturamentoComponent,
        children: [
            { path: '', component: ListaContratoFaturamentoComponent }
        ]
    }
];