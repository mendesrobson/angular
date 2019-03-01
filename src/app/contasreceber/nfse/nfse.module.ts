import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { SharedModule } from '../../shared/shared.module';
import { nfseRouterConfig } from './nfse.routes';
import { DataTableModule } from "ng2-data-table";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { NfseComponent } from './nfse.component';
import { NfseService } from './nfse.service';
import { GerarNfseComponent } from './gerar-nfse/gerar-nfse.component';
import { MyDatePickerModule } from 'mydatepicker';
import { BusyModule } from 'angular2-busy';
import { SelectModule } from 'ng2-select';
//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ConsultarNfseComponent } from './consultar-nfse/consultar-nfse.component';




@NgModule({
    imports: [
     //   SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(nfseRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        MyDatePickerModule,
        BusyModule,
        SelectModule,
        //MultiselectDropdownModule,
        AngularMultiSelectModule
        
         
        

    ],
    declarations: [
        NfseComponent,
        GerarNfseComponent,
        ConsultarNfseComponent
    ],
    providers: [
        NfseService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule ]
})

export class NfseModule { }