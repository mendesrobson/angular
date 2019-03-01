import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { MyDatePickerModule } from 'mydatepicker';

// components
import { ContribuicaosindicalpatronalComponent } from './contribuicaosindicalpatronal.component';
import { ListaContribuicaosindicalpatronalComponent } from './lista-contribuicaosindicalpatronal/lista-contribuicaosindicalpatronal.component';
import { AdicionarContribuicaosindicalpatronalComponent } from './adicionar-contribuicaosindicalpatronal/adicionar-contribuicaosindicalpatronal.component';
import { EditarContribuicaosindicalpatronalComponent } from './editar-contribuicaosindicalpatronal/editar-contribuicaosindicalpatronal.component';
import { ExcluirContribuicaosindicalpatronalComponent } from './excluir-contribuicaosindicalpatronal/excluir-contribuicaosindicalpatronal.component';
import { ReativarContribuicaosindicalpatronalComponent } from './reativar-contribuicaosindicalpatronal/reativar-contribuicaosindicalpatronal.component';

// services
import { ContribuicaoSindicalPatronalService } from './contribuicaosindicalpatronal.service';

// config
import { contribuicaosindicalpatronalRouterConfig } from './contribuicaosindicalpatronal.routes';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { AdicionarContrsindpatnumeroalunosComponent } from './adicionar-contrsindpatnumeroalunos/adicionar-contrsindpatnumeroalunos.component';
import { EditarContrsindpatnumeroalunosComponent } from './editar-contrsindpatnumeroalunos/editar-contrsindpatnumeroalunos.component';
import { ListaContrsindpatnumeroalunosComponent } from './lista-contrsindpatnumeroalunos/lista-contrsindpatnumeroalunos.component';
import { ReativarContrsindpatnumeroalunosComponent } from './reativar-contrsindpatnumeroalunos/reativar-contrsindpatnumeroalunos.component';
import { AdicionarContrsindpatreceitabrutaComponent } from './adicionar-contrsindpatreceitabruta/adicionar-contrsindpatreceitabruta.component';
import { EditarContrsindpatreceitabrutaComponent } from './editar-contrsindpatreceitabruta/editar-contrsindpatreceitabruta.component';
import { ListaContrsindpatreceitabrutaComponent } from './lista-contrsindpatreceitabruta/lista-contrsindpatreceitabruta.component';
import { ReativarContrsindpatreceitabrutaComponent } from './reativar-contrsindpatreceitabruta/reativar-contrsindpatreceitabruta.component';
import { ExcluirContrsindpatreceitabrutaComponent } from './excluir-contrsindpatreceitabruta/excluir-contrsindpatreceitabruta.component';

import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ListaContrsindpatcapitalsocialComponent } from './lista-contrsindpatcapitalsocial/lista-contrsindpatcapitalsocial.component';
import { AdicionarContrsindpatcapitalsocialComponent } from './adicionar-contrsindpatcapitalsocial/adicionar-contrsindpatcapitalsocial.component';
import { EditarContrsindpatcapitalsocialComponent } from './editar-contrsindpatcapitalsocial/editar-contrsindpatcapitalsocial.component';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';

import { DxDateBoxModule, DxNumberBoxModule } from '../../../../node_modules/devextreme-angular';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    decimal: ",",
    precision: 2,
    prefix: " ",
    suffix: "",
    thousands: "."
};

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(contribuicaosindicalpatronalRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        TextMaskModule,
        CurrencyMaskModule,
        MyDatePickerModule,
        OnlyNumberDirectiveModule,
        DxDateBoxModule,
        DxNumberBoxModule
    ],
    declarations: [
        ContribuicaosindicalpatronalComponent,
        ListaContribuicaosindicalpatronalComponent,
        AdicionarContribuicaosindicalpatronalComponent,
        EditarContribuicaosindicalpatronalComponent,
        ExcluirContribuicaosindicalpatronalComponent,
        ReativarContribuicaosindicalpatronalComponent,
        AdicionarContrsindpatnumeroalunosComponent,
        EditarContrsindpatnumeroalunosComponent,
        ListaContrsindpatnumeroalunosComponent,
        ReativarContrsindpatnumeroalunosComponent,
        AdicionarContrsindpatreceitabrutaComponent,
        EditarContrsindpatreceitabrutaComponent,
        ListaContrsindpatreceitabrutaComponent,
        ReativarContrsindpatreceitabrutaComponent,
        ExcluirContrsindpatreceitabrutaComponent,
        ListaContrsindpatcapitalsocialComponent,
        AdicionarContrsindpatcapitalsocialComponent,
        EditarContrsindpatcapitalsocialComponent
    ],
    providers: [
        ContribuicaoSindicalPatronalService,
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        OnlyNumberDirectiveModule]
})

export class ContribuicaoSindicalPatronalModule { }