import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { MovimentoContaCentro, CentroCusto } from '../models/tituloparcelabaixa';
import { TituloParcelaBaixaService } from '../tituloparcelabaixa.service';
import { TituloParcelaBaixaComponent } from '../tituloparcelabaixa.component';
import { ListaLancamentoCentroCustoComponent } from '../lista-lancamentocentrocusto/lista-lancamentocentrocusto.component';



@Component({
  selector: 'app-adicionar-lancamentocentrocusto',
  templateUrl: './adicionar-lancamentocentrocusto.component.html',
  styleUrls: ['./adicionar-lancamentocentrocusto.component.css']
})
export class AdicionarLancamentoCentroCustoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public movimentoContaCentro: MovimentoContaCentro;
  public movimentoContaCentros = [];
  public listaMovimentoContaCentroCusto = [];
  public lancamentoCentroCustoForm: FormGroup;
  public movimentoContaId = 0;

  public centroCustos: CentroCusto[];

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
    private tituloParcelaBaixaComponent: TituloParcelaBaixaComponent,
    private listCentroCusto: ListaLancamentoCentroCustoComponent) {

    this.validationMessages = {
      centroCustoId: {
        required: 'Centro Custo requerido.'
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

    this.lancamentoCentroCustoForm = this.fb.group({
      centroCustoId: ['', [Validators.required]],
      centroResultadoId: 0,
      //codigo: '',
      //descricao: '',
      percentual: [0, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    this.tituloParcelaBaixaService.obterTodosCentroCusto()
      .subscribe(centroCustos => {
        this.centroCustos = centroCustos
      },
        error => this.errors);

    //  this.tituloCentros = JSON.parse(localStorage.getItem("tituloCentroCusto"));
    if (this.movimentoContaCentros == null) {
      this.movimentoContaCentros = [];
    }

  }


  adicionarCentroCusto() {
    console.log('valor');
    if (this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro == undefined)
      this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro = []


    if (this.lancamentoCentroCustoForm.dirty && this.lancamentoCentroCustoForm.valid) {
      let p = Object.assign({}, this.movimentoContaCentro, this.lancamentoCentroCustoForm.getRawValue());


      for (var i = 0; i < this.centroCustos.length; i++) {
        if (p.centroCustoId == this.centroCustos[i].id) {
          p.centroCusto = this.centroCustos[i];
        }
      }
      p.centroResultado = null;
      p.centroResultadoId = null;


      let num = this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length;

      p.id = num + 1;
      p.movimentoContaId = this.movimentoContaId;

      // this.listaTituloCentroCusto.push(p);

      this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.push(p)
      if (!this.tituloParcelaBaixaService.validarPercentual(this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.filter(c => c.centroCusto != null))) {

        this.listCentroCusto.centroCustoErro('Centro de Custo não gravado, os valores excedem 100%');
        for (var i = 0; i < this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.length; i++) {
          if (p.id == this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro[i].id) {
            this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro.splice(i, 1);
          }
        }

        this.listCentroCusto.atualizaStorage();
        this.close()

      } else {
        this.listCentroCusto.atualizaStorage();
        this.listCentroCusto.centroCustoGravado('Centro Custo, Adicionado com Sucesso!');
        this.close();
      }



      console.log(this.tituloParcelaBaixaComponent.MovimentoConta.movimentoContaCentro)

    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    //this.router.navigate(['banco/lista']);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.lancamentoCentroCustoForm);
    });

  }
}






