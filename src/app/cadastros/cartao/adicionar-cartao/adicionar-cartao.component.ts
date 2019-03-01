import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CartaoService } from '../cartao.service';
import { MaskService } from '../../../services/mask.service';
import { Cartao, CartaoBandeira } from '../models/cartao';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';


@Component({
  selector: 'app-adicionar-cartao',
  templateUrl: './adicionar-cartao.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class AdicionarCartaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public cartao: Cartao;
  public cartaoForm: FormGroup;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public cartaoBandeiras: CartaoBandeira[];
 
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];
  numCartaoMask = this._maskService.NumCartao();

  constructor(
    private cartaoService: CartaoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      cartaoBandeiraId:
      {
        required: 'Bandeira Cartão requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.cartao = new Cartao();
    this.swal = new SweetAlertAdviceService();
  }

  public selectDiaVencimento = [
    { id: '01', value: '01' },
    { id: '02', value: '02' },
    { id: '03', value: '03' },
    { id: '04', value: '04' },
    { id: '05', value: '05' },
    { id: '06', value: '06' },
    { id: '07', value: '07' },
    { id: '08', value: '08' },
    { id: '09', value: '09' },
    { id: '10', value: '10' },
    { id: '11', value: '11' },
    { id: '12', value: '12' },
    { id: '13', value: '13' },
    { id: '14', value: '14' },
    { id: '15', value: '15' },
    { id: '16', value: '16' },
    { id: '17', value: '17' },
    { id: '18', value: '18' },
    { id: '19', value: '19' },
    { id: '20', value: '20' },
    { id: '21', value: '21' },
    { id: '22', value: '22' },
    { id: '23', value: '23' },
    { id: '24', value: '24' },
    { id: '25', value: '25' },
    { id: '26', value: '26' },
    { id: '27', value: '27' },
    { id: '28', value: '28' },
    { id: '29', value: '29' },
    { id: '30', value: '30' },
    { id: '31', value: '31' }
  ];

  ngOnInit(): void {
    this.cartaoForm = this.fb.group({  
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      cartaoBandeiraId: ['', [Validators.required]],
      numero: [],
      dataEmissao: [],
      dataValidade: [],
      dataFechamentoFatura: [],
      diaVencimentoFatura: [], 
      limiteCartao: 0.0,
      excluido: 'N'
    });

    this.cartaoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
    error => this.errors);

    this.cartaoService.obterTodosEmpresa()
    .subscribe(empresas => {
      this.empresas = empresas
    },
    error => this.errors);

    this.cartaoService.ObterTodosCartaoBandeira()
    .subscribe(cartaoBandeiras => {
      this.cartaoBandeiras = cartaoBandeiras
    },
    error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.cartaoForm);
    });
  }

  adicionarCartao() {
    console.log(this.cartaoForm.dirty);
    if (this.cartaoForm.dirty && this.cartaoForm.valid) {

      let p = Object.assign({}, this.cartao, this.cartaoForm.getRawValue());

      console.log(p);

      this.cartaoService.AdicionarCartao(p).subscribe(
      result => {
        this.swal.showSwalSuccess('Cartão Adicionado com Sucesso!');
        this.router.navigate(['cartao/lista']);
      },
      error => {
        this.onError(error)
      })             
    }
  }

  onError(error) {
    this.errors = JSON.parse(error).errors;
  }

  cancelar() {
    this.router.navigate(['cartao/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.cartaoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

}