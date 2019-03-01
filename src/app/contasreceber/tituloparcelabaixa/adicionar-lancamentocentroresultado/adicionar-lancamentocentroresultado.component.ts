import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';


import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { MovimentoContaCentro, CentroResultado } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { ListaLancamentoCentroResultadoComponent } from '../lista-lancamentocentroresultado/lista-lancamentocentroresultado.component';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';


@Component({
  selector: 'app-adicionar-lancamentocentroresultado',
  templateUrl: './adicionar-lancamentocentroresultado.component.html',
  styleUrls: ['./adicionar-lancamentocentroresultado.component.css']
})
export class AdicionarLancamentoCentroResultadoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public movimentoContaCentro: MovimentoContaCentro;
  public movimentoContaCentros = [];
  public listaMovimentoContaCentroResultado = [];
  public lancamentoCentroResultadoForm: FormGroup;


  public centroResultados: CentroResultado[];

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];


  constructor(private tituloParcelaBaixaService: TituloParcelaBaixaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private listCentroResultado: ListaLancamentoCentroResultadoComponent,
    private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent) {

    this.validationMessages = {
      centroResultadoId: {
        required: 'Centro Resultado requerido.'
      },
      percentual: {
        required: 'Percentual requerido.',
        min: 'Valor mínimo deve ser maior que 0',
        max: 'Valor máximo deve ser menor ou igual 100'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.movimentoContaCentro = new MovimentoContaCentro();
    this.swal = new SweetAlertAdviceService();


  }

  ngOnInit() {

    this.lancamentoCentroResultadoForm = this.fb.group({
      centroResultadoId: ['', [Validators.required]],
      centroCustoId: 0,
      //codigo: '',
      //descricao: '',
      percentual: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.tituloParcelaBaixaService.obterTodosCentroResultado()
      .subscribe(centroResultados => {
        this.centroResultados = centroResultados


      },
        error => this.errors);


    if (this.movimentoContaCentros == null) {
      this.movimentoContaCentros = [];
    }

  }


  adicionarCentroResultado() {
    console.log('valor');
    if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro == undefined)
      this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro = []


    if (this.lancamentoCentroResultadoForm.dirty && this.lancamentoCentroResultadoForm.valid) {
      let p = Object.assign({}, this.movimentoContaCentro, this.lancamentoCentroResultadoForm.getRawValue());


      for (var i = 0; i < this.centroResultados.length; i++) {
        if (p.centroResultadoId == this.centroResultados[i].id) {
          p.centroResultado = this.centroResultados[i];
        }
      }
      p.centroCusto = null;
      p.centroCustoId = null;


      let num = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length;

      p.id = num + 1;


      this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.push(p)
      if (!this.tituloParcelaBaixaService.validarPercentual(this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroResultado != null))) {

        this.listCentroResultado.centroResultadoErro('Centro de Resultado não gravado, os valores excedem 100%');
        for (var i = 0; i < this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
          if (p.id == this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i].id) {
            this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
          }
        }

        this.listCentroResultado.atualizaStorage();
        this.close()

      } else {
        this.listCentroResultado.atualizaStorage();
        this.listCentroResultado.centroResultadoGravado('Centro Resultado, Adicionado com Sucesso!');
        this.close();
      }
    }


  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }


  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.lancamentoCentroResultadoForm);
    });

  }
}






