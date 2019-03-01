import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { HistoricoPadrao, HistoricoPadraoCentro, CentroCusto, CentroResultado } from '../models/historicopadrao';
import { HistoricoPadraoService } from '../historicopadrao.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { HistoricopadraoComponent } from '../historicopadrao.component';
import { ListaHistoricocentrocustoComponent } from '../lista-historicocentrocusto/lista-historicocentrocusto.component';

@Component({
  selector: 'app-editar-historicocentrocusto',
  templateUrl: './editar-historicocentrocusto.component.html',
  styleUrls: ['./editar-historicocentrocusto.component.css']
})
export class EditarHistoricocentrocustoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public historicoPadraoCentro: HistoricoPadraoCentro;
  public centroCustos = [];
  public historicoCentroCustoForm: FormGroup;
  public historicoPadraoId = 0;

  constructor(private historicoPadraoService: HistoricoPadraoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private historicoPadraoComponent: HistoricopadraoComponent,
    private listHistoricocentrocusto: ListaHistoricocentrocustoComponent) {

    this.validationMessages = {
      centroCustoId: {
        required: 'Informe o Centro de Custo'
      },
      percentual: {
        required: 'Informe o Percentual'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.historicoPadraoCentro = new HistoricoPadraoCentro();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.historicoPadraoId = 0
    else
      this.historicoPadraoId = this.route.snapshot.params['id'];

    this.historicoCentroCustoForm = this.fb.group({
      centroCustoId: 0,
      percentual: 0
    });


    this.historicoPadraoService.obterTodosCentroCustoPorEmpresaId(this.historicoPadraoComponent.HistoricoPadrao.empresaId)
    .subscribe(centroCustos => {
      this.centroCustos = centroCustos
    }, () => {});

    this.preencherHistoricoCentroCustoForm(this.historicoPadraoComponent.HistoricoPadraoCentro);
  }

  preencherHistoricoCentroCustoForm(historicoPadraoCentro: HistoricoPadraoCentro): void {
    this.historicoPadraoCentro = historicoPadraoCentro;

    this.historicoCentroCustoForm.patchValue({
      centroCustoId: this.historicoPadraoCentro.centroCustoId,
      percentual: this.historicoPadraoCentro.percentual
    })

  }


  editarHistoricoCentroCusto() {
    
    if (this.historicoCentroCustoForm.dirty && this.historicoCentroCustoForm.valid) {
      let p = Object.assign({}, this.historicoPadraoCentro, this.historicoCentroCustoForm.value);

      p.centroCusto = null;

      let novo = [];

      for (let i = 0; this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.filter(c => c.centroCusto != null).length > i; i++) {

        if (p.id != this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].id) {        
          novo.push(this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i]);
        }

      }

      if (!this.historicoPadraoService.validarPercentualNoBanco(novo, p.percentual)) {
        this.listHistoricocentrocusto.historicoPadraoErro('Centro de Custo não gravado, os valores excedem 100%');

      } else {

        if (this.historicoPadraoId > 0) {

          this.historicoPadraoService.AtualizarHistoricoPadraoCentro(p)
            .subscribe(
            result => {

              for (let i = 0; this.centroCustos.length > i; i++) {
                if (this.centroCustos[i].id == result.centroCustoId) {
                  result.centroCusto = this.centroCustos[i];
                }
              }


              for (let i = 0; this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length > i; i++) {
                if (result.id == this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].id) {
                  this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i] = result;
                }
              }
              //console.log('Centro de Custo editado com sucesso!');
              this.listHistoricocentrocusto.historicoPadraoGravado('Centro de Custo editado com sucesso!');

              this.close();
            },
            error => {
              this.errors;
            });

        } else {

          for (let i = 0; this.centroCustos.length > i; i++) {
            if (this.centroCustos[i].id == p.centroCustoId) {
              p.centroCusto = this.centroCustos[i];
            }
          }


          for (let i = 0; this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length > i; i++) {
            if (p.id == this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i].id) {
              this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro[i] = p;
            }
          }

          this.listHistoricocentrocusto.historicoPadraoGravado('Centro de Custo editado com sucesso!');

          this.close();


        }

      }
    }
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
