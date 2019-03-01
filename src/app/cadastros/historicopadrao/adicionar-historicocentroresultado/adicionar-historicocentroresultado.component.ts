
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
import { ListaHistoricocentroresultadoComponent } from '../lista-historicocentroresultado/lista-historicocentroresultado.component';

@Component({
  selector: 'app-adicionar-historicocentroresultado',
  templateUrl: './adicionar-historicocentroresultado.component.html',
  styleUrls: ['./adicionar-historicocentroresultado.component.css']
})
export class AdicionarHistoricocentroresultadoComponent implements OnInit {

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
  public centroResultados = [];
  public historicoCentroResultadoForm: FormGroup;
  public historicoPadraoId = 0;

  constructor(private historicoPadraoService: HistoricoPadraoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private historicoPadraoComponent: HistoricopadraoComponent,
    private listHistoricocentroresultado: ListaHistoricocentroresultadoComponent) {

    this.validationMessages = {
      centroResultadoId: {
        required: 'Informe o Centro de Resultado'
      },
      percentual: {
        required: 'Informe o percentual'
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

    this.historicoCentroResultadoForm = this.fb.group({
      centroResultadoId: 0,
      percentual: 0
    });

    this.historicoPadraoService.obterTodosCentroResultadoPorEmpresaId(this.historicoPadraoComponent.HistoricoPadrao.empresaId)
      .subscribe(centroResultados => {
        this.centroResultados = centroResultados
      },() => {});

  }

  adicionarHistoricoCentroResultado() {

    if (this.historicoCentroResultadoForm.dirty && this.historicoCentroResultadoForm.valid) {
      let p = Object.assign({}, this.historicoPadraoCentro, this.historicoCentroResultadoForm.value);

      if (!this.historicoPadraoService.validarPercentualNoBanco(this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.filter(c => c.centroResultado != null), p.percentual)) {
        this.listHistoricocentroresultado.historicoPadraoErro('Centro de Resultado não gravado, os valores excedem 100%');
      } else {

        if (this.historicoPadraoId > 0) {

          p.historicoPadraoId = this.historicoPadraoId;

          console.log(p);

          this.historicoPadraoService.AdicionarHistoricoPadraoCentro(p)
            .subscribe(
            result => {

              for (let i = 0; this.centroResultados.length > i; i++) {
                if (this.centroResultados[i].id == result.centroResultadoId) {
                  result.centroResultado = this.centroResultados[i];
                }
              }

              this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.push(result);

              this.listHistoricocentroresultado.historicoPadraoGravado('Centro de Resultado adicionado com sucesso!');

              this.close();
            },
            error => {
              this.errors;
            });

        } else {

          p.id = 0;

          if (this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length > 0) {
            p.id = this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.length + 1;

          }

          for (let i = 0; this.centroResultados.length > i; i++) {
            if (this.centroResultados[i].id == p.centroResultadoId) {
              p.centroResultado = this.centroResultados[i];
            }
          }

          this.historicoPadraoComponent.HistoricoPadrao.historicoPadraoCentro.push(p);

          this.listHistoricocentroresultado.historicoPadraoGravado('Centro de Resultado adicionado com sucesso!');

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
