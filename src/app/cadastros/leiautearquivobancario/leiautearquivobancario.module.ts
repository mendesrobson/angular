import { NgModule } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LeiauteArquivoBancarioConfig } from "./leiautearquivobancario.routes";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from "../../utils/datafilter.pipe.module";
import { LeiauteArquivoBancarioComponent } from "./leiautearquivobancario.component";
import { ListaLeiauteArquivoBancarioComponent } from "./lista-leiautearquivobancario/lista-leiautearquivobancario.component";
import { LeiauteArquivoBancarioService } from "./leiautearquivobancario.service";
import { AdicionarLeiauteArquivoBancarioComponent } from "./adicionar-leiautearquivobancario/adicionar-leiautearquivobancario.component";
import { EditarLeiauteArquivoBancarioComponent } from "./editar-leiautearquivobancario/editar-leiautearquivobancario.component";
import { ListaRegistroLeiauteArquivoBancarioComponent } from "./lista-registroleiautearquivobancario/lista-registroleiautearquivobancario.component";
import { AdicionarRegistroLeiauteArquivoBancarioComponent } from "./adicionar-registroleiautearquivobancario/adicionar-registroleiautearquivobancario.component";
import { EditarRegistroLeiauteArquivoBancarioComponent } from "./editar-registroleiautearquivobancario/editar-registroleiautearquivobancario.component";
import { ListaItemRegistroLeiauteArquivoBancario } from "./lista-itemregistroleiautearquivobancario/lista-itemregistroleiautearquivobancario.component";
import { AdicionarItemRegistroLeiauteArquivoBancarioComponent } from "./adicionar-itemregistroleiautearquivobancario/adicionar-itemregistroleiautearquivobancario.component";
import { EditarItemRegistroLeiauteArquivoBancarioComponent } from "./editar-itemregistroleiautearquivobancario/editar-itemregistroleiautearquivobancario.component";
import { ExcluirLeiauteArquivoBancarioComponent } from "./excluir-leiautearquivobancario/excluir-leiautearquivobancario.component";
import { Ng2DragDropModule } from "ng2-drag-drop";
import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";
import { CheckBoxSetDirectiveModule } from "../../diretivas/checkboxset.module";
import { DxSelectBoxModule, DxRangeSliderModule, DxNumberBoxModule } from 'devextreme-angular';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(LeiauteArquivoBancarioConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        Ng2DragDropModule.forRoot(),
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule,
        DxSelectBoxModule,
        DxRangeSliderModule,
        DxNumberBoxModule,
        TextMaskModule

    ],
    declarations: [
        LeiauteArquivoBancarioComponent,
        ListaLeiauteArquivoBancarioComponent,
        AdicionarLeiauteArquivoBancarioComponent,
        EditarLeiauteArquivoBancarioComponent,
        ListaRegistroLeiauteArquivoBancarioComponent,
        AdicionarRegistroLeiauteArquivoBancarioComponent,
        EditarRegistroLeiauteArquivoBancarioComponent,
        ListaItemRegistroLeiauteArquivoBancario,
        AdicionarItemRegistroLeiauteArquivoBancarioComponent,
        EditarItemRegistroLeiauteArquivoBancarioComponent,
        ExcluirLeiauteArquivoBancarioComponent

    ],
    providers: [      
      LeiauteArquivoBancarioService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule]
})

export class LeiauteArquivoBancarioModule { }
