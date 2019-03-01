import { Routes } from '@angular/router';
import { TipoBeneficioComponent } from './tipobeneficio.component';
import { ListaTipoBeneficioComponent } from './lista-tipobeneficio/lista-tipobeneficio.component';
import { AdicionarTipoBeneficioComponent } from './adicionar-tipobeneficio/adicionar-tipobeneficio.component';
import { EditarTipoBeneficioComponent } from './editar-tipobeneficio/editar-tipobeneficio.component';
import { ExcluirTipoBeneficioComponent } from './excluir-tipobeneficio/excluir-tipobeneficio.component';
import { ReativarTipoBeneficioComponent } from './reativar-tipobeneficio/reativar-tipobeneficio.component';



export const tipoBeneficioRouterConfig: Routes = [
    {
        path: '', component: TipoBeneficioComponent,
        children: [
            {
                path: '', component: ListaTipoBeneficioComponent,
                data: {
                    title: 'Cadastro Tipo Benefício',
                    urls: [{ title: 'Folha', url: '/tipobeneficio' }, { title: 'Tipo de Benefício' }]
                }
            },
            {
                path: 'lista', component: ListaTipoBeneficioComponent,
                data: {
                    title: 'Cadastro Tipo de Benefício',
                    urls: [{ title: 'Folha', url: '/tipobeneficio' }, { title: 'Cadastro Tipo de Benefício' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarTipoBeneficioComponent,
                data: {
                    title: 'Cadastro Tipo de Benefício',
                    urls: [{ title: 'Folha', url: '/tipobeneficio' }, { title: 'Cadastro Tipo de Benefício' }]
                }
            },
            {
                path: 'editar/:id', component: EditarTipoBeneficioComponent,
                data: {
                    title: 'Cadastro Tipo de Benefício',
                    urls: [{ title: 'Folha', url: '/tipobeneficio' }, { title: 'Cadastro Tipo de Benefício' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirTipoBeneficioComponent,
                data: {
                    title: 'Cadastro Tipo de Benefício',
                    urls: [{ title: 'Folha', url: '/tipobeneficio' }, { title: 'Cadastro Tipo de Benefício' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarTipoBeneficioComponent,
                data: {
                    title: 'Cadastro Tipo de Benefício',
                    urls: [{ title: 'Folha', url: '/tipobeneficio' }, { title: 'Cadastro Tipo de Benefício' }]
                }
            }

        ]
    }
];
