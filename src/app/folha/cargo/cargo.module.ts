import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { CargoComponent } from './cargo.component';
import { ListaCargocboComponent } from './lista-cargocbo/lista-cargocbo.component';
import { ListaCargoComponent } from './lista-cargo/lista-cargo.component';
import { AdicionarCargoComponent } from './adicionar-cargo/adicionar-cargo.component';
import { EditarCargoComponent } from './editar-cargo/editar-cargo.component';
import { ExcluirCargoComponent } from './excluir-cargo/excluir-cargo.component';

// services
import { CargoService } from './cargo.service';

// config
import { cargoRouterConfig } from './cargo.routes';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { ReativarCargoComponent } from './reativar-cargo/reativar-cargo.component';
import { AdicionarCargocboComponent } from './adicionar-cargocbo/adicionar-cargocbo.component';
import { EditarCargocboComponent } from './editar-cargocbo/editar-cargocbo.component';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(cargoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        DisableControlCheckBoxDirectiveModule,
        CheckBoxSetDirectiveModule

    ],
    declarations: [
        CargoComponent,
        AdicionarCargoComponent,
        ListaCargocboComponent,
        ListaCargoComponent,
        EditarCargoComponent,
        ExcluirCargoComponent,
        ReativarCargoComponent,
        AdicionarCargocboComponent,
        EditarCargocboComponent
    ],
    providers: [
        CargoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class CargoModule { }
