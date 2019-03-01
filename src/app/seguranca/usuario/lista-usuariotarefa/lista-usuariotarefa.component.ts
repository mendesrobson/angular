import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Papel } from '../models/usuario';
import { UsuarioService } from '../usuario.service';
import { Subscription } from 'rxjs';
import { UsuarioComponent } from '../usuario.component';
import { forEach } from '../../../../../node_modules/@angular/router/src/utils/collection';

@Component({
    selector: 'app-lista-usuariotarefa',
    templateUrl: './lista-usuariotarefa.component.html',
    styleUrls: []
})
export class ListaUsuarioTarefaComponent implements OnInit {
    public errors: any[] = [];
    public data: any[];

    public prefix: string;
    public selectedRows: number[];
    public selectionChangedBySelectbox: boolean;

    constructor(public usuarioService: UsuarioService,
        private router: Router,
        private route: ActivatedRoute,
        vcr: ViewContainerRef,
        private usuarioComponent: UsuarioComponent) {
    }

    ngOnInit(): void {
        var papeis = this.usuarioComponent.Usuario.papeis;
        this.selectedRows = new Array();
        papeis.forEach(element => {
            if (element.selecionado) {
                this.selectedRows.push(element.papelId);
            }
        })   
    }

    selectionChangedHandler(e) {
        if (!this.selectionChangedBySelectbox) {
            this.prefix = null;
        }

        this.selectionChangedBySelectbox = false;

        let selecionados = e.selectedRowKeys;
        var papeis = this.usuarioComponent.Usuario.papeis;

        papeis.forEach(element => {
            element.selecionado = false;
            for (let i = 0; i < selecionados.length; i++) {
                if (element.papelId == selecionados[i]) {
                    element.selecionado = true;
                }
            }
        });
    }

}

