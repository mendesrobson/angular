import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { Subscription } from 'rxjs';
import { Parcela, ContaCorrente } from '../../titulo/models/titulo';
import { RenegociacaoService } from '../renegociacao.service';
import { RenegociacaoComponent } from '../renegociacao.component';


@Component({
  selector: 'app-editar-tituloparcela',
  templateUrl: './editar-tituloparcela.component.html',
  styleUrls: ['./editar-tituloparcela.component.css']
})
export class EditarTituloparcelaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public parcela: Parcela;
  public parcelas = [];
  public parcelaForm: FormGroup;
  public tituloId = 0;

  public sub: Subscription;
  public natureza: string;

  public contaCorrentes: ContaCorrente[];

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  constructor(private renegociacaoService: RenegociacaoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private _utilService: UtilService,
    private route: ActivatedRoute,
    private renegociacaoComponent: RenegociacaoComponent) {

    this.validationMessages = {
      dataVencimento: {
        required: 'Informe a data de vencimento'
      }

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.parcela = new Parcela();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
     this.parcelaForm = this.fb.group({
      contaCorrenteId: 0,
      dataVencimento: '',
      documento: '',
      numero: 0,
      valorBruto: 0,
      valorDesconto: 0,
      valorLiquido: 0
    });

    this.parcela = this.renegociacaoComponent.parcela;


    this.renegociacaoService.obterTodosContaCorrente()
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.natureza = params['natureza'];
        console.log(this.natureza)
      });

    this.preencherTituloParcelaForm(this.parcela);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.parcelaForm);

    });
  }

  editarParcela(): void {
   
    if (this.parcelaForm.dirty && this.parcelaForm.valid) {
      let p = Object.assign({}, this.parcela, this.parcelaForm.value);

      //this.renegociacaoComponent.ParcelaRenegociada = p;
      
      for (var i = 0; i < this.renegociacaoComponent.ParcelasRenegociadas.length; i++) {
        if (this.renegociacaoComponent.ParcelasRenegociadas[i].id == p.id) {
          this.renegociacaoComponent.ParcelasRenegociadas[i] = p;

          this.renegociacaoComponent.parcelasRenegociadas[i].valorLiquido =  
          this.renegociacaoComponent.parcelasRenegociadas[i].valorBruto -
          this.renegociacaoComponent.parcelasRenegociadas[i].valorDesconto;
       }
      }


      let valorRenegociado = (this.renegociacaoComponent.renegociacao.valorRenegociacao + 
                              this.renegociacaoComponent.renegociacao.valorAcrescimo -
                              this.renegociacaoComponent.renegociacao.valorAbono) - p.valorBruto;

      
      
      console.log(valorRenegociado);


      
      for (var i = 0; i < this.renegociacaoComponent.ParcelasRenegociadas.length; i++) {
        if (this.renegociacaoComponent.ParcelasRenegociadas[i].id != p.id) {
          this.renegociacaoComponent.ParcelasRenegociadas[i].valorBruto = 
          valorRenegociado /
          (this.renegociacaoComponent.ParcelasRenegociadas.length-1);

          this.renegociacaoComponent.parcelasRenegociadas[i].valorLiquido =  
          this.renegociacaoComponent.parcelasRenegociadas[i].valorBruto -
          this.renegociacaoComponent.parcelasRenegociadas[i].valorDesconto;
       }
      }

         
      this.close();

    }

  }

  preencherTituloParcelaForm(parcela: Parcela): void {

    this.parcela = parcela;

    this.parcelaForm.patchValue({
      contaCorrenteId: this.parcela.contaCorrenteId,
      dataVencimento: this._utilService.ToDate(this.parcela.dataVencimento),
      documento: this.parcela.documento,
      numero: this.parcela.numero,
      valorBruto: this.parcela.valorBruto,
      valorDesconto: this.parcela.valorDesconto,
      valorLiquido: this.parcela.valorLiquido,
      flagPagamentoRemessa: this.parcela.flagPagamentoRemessa,
      codigoBarra: this.parcela.codigoBarra,
      nossoNumero: this.parcela.nossoNumero,
      quantidadeMoeda: this.parcela.quantidadeMoeda,
      codigoMoeda: this.parcela.codigoMoeda
    })

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }


  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
