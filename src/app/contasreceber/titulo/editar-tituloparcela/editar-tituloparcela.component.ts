import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Titulo, Parcela, ContaCorrente } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { ListaTituloparcelaComponent } from '../lista-tituloparcela/lista-tituloparcela.component';
import { TituloComponent } from '../titulo.component';
import { Subscription } from 'rxjs';

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

  codigoBarraRequerido: boolean = false;
  nossoNumeroRequerido: boolean = false;


  public contaCorrentes: ContaCorrente[];

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  constructor(private tituloService: TituloService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private _utilService: UtilService,
    private route: ActivatedRoute,
    private listParcelas: ListaTituloparcelaComponent,
    private tituloComponent: TituloComponent) {

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
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    this.parcelaForm = this.fb.group({
      contaCorrenteId: 0,
      dataVencimento: '',
      documento: '',
      numero: 0,
      valorBruto: 0,
      valorDesconto: 0,
      valorLiquido: 0,
      flagPagamentoRemessa: 'N',
      codigoBarra: '',
      nossoNumero: '',
      quantidadeMoeda: '',
      codigoMoeda: ''
    });

    //this.parcela = JSON.parse(localStorage.getItem("tituloParcelaEdit"));
    this.parcela = this.tituloComponent.Parcela;

    if (this.parcela == null) {
      this.parcela = new Parcela;
    }

    // this.tituloService.obterTodosContaCorrente()
    //   .subscribe(contaCorrentes => {
    //     this.contaCorrentes = contaCorrentes
    //   },
    //     error => this.errors);

    this.tituloService.obterTodosContaCorrentePorEmpresa(this.tituloComponent.titulo.empresaId)
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
    this.codigoBarraRequerido = false;
    this.nossoNumeroRequerido = false;
    if (this.natureza == 'pagar') {

      if (this.parcelaForm.controls['flagPagamentoRemessa'].value == 'S') {
      
        if (this.parcelaForm.get('codigoBarra').value == null || this.parcelaForm.get('codigoBarra').value.length < 1) {
          this.codigoBarraRequerido = true;
        }
        else
          this.codigoBarraRequerido = false;

        if (this.parcelaForm.get('nossoNumero').value == null || this.parcelaForm.get('nossoNumero').value.length < 1) {
          this.nossoNumeroRequerido = true;
        }
        else
          this.nossoNumeroRequerido = false;
      }

      if (this.nossoNumeroRequerido == true || this.codigoBarraRequerido == true)
        return

    }

    if (this.parcelaForm.dirty && this.parcelaForm.valid) {
      let p = Object.assign({}, this.parcela, this.parcelaForm.value);
      
      this.tituloComponent.dirty = true;
      this.parcelas = this.tituloComponent.Titulo.parcela;

      for (var i = 0; i < this.parcelas.length; i++) {
        if (this.parcela.id == this.parcelas[i].id) {
          this.parcelas[i] = p;
        }
      }

      this.tituloComponent.Titulo.parcela = this.parcelas;
      this.listParcelas.atualizaStorage();

      if (p.tituloId > 0) {

        p.tituloId = this.tituloId;
        this.tituloService.AtualizarParcela(p)
          .subscribe(
            result => {
              this.listParcelas.atualizaStorage();
              this.listParcelas.parcelaGravado('Parcela atualizada com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });


      } else {

        this.listParcelas.parcelaGravado('Parcela atualizada com sucesso!');
        this.close();

      }

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

  cancelar() {
    //this.router.navigate(['banco/lista']);
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
