import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CartaoService } from '../cartao.service';
import { MaskService } from '../../../services/mask.service';
import { Cartao, CartaoBandeira } from '../models/cartao';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-cartao',
  templateUrl: './editar-cartao.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class EditarCartaoComponent implements OnInit, AfterViewInit {
    [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];  

  public cartao: Cartao;
  public cartaoForm: FormGroup;
  public cartaoId: string = "";
  public sub: Subscription;
  
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
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute
  ) {

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

    this.sub = this.route.params.subscribe(
      params => {
        this.cartaoId = params['id'];
        this.obterCartao(this.cartaoId);
      });

    this.cartaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
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

  obterCartao(id: string) {
    this.cartaoService.obterCartao(id)
      .subscribe(
      cartao => this.preencherFormCartao(cartao),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormCartao(cartao: Cartao): void {
    this.cartao = cartao;

    this.reativarVisivel = this.cartao.excluido === 'S';
    this.removerVisivel = this.cartao.excluido === 'N';

    this.cartaoForm.patchValue({
      id: this.cartao.id,
      grupoEmpresaId: this.cartao.grupoEmpresaId,
      empresaId: this.cartao.empresaId,
      cartaoBandeiraId: this.cartao.cartaoBandeiraId,
      numero: this.cartao.numero,
      dataEmissao: this._utilService.ToDate(this.cartao.dataEmissao),
      dataValidade: this._utilService.ToDate(this.cartao.dataValidade),
      dataFechamentoFatura: this.cartao.dataFechamentoFatura,
      diaVencimentoFatura: this.cartao.diaVencimentoFatura,
      limiteCartao: this.cartao.limiteCartao,
      excluido: this.cartao.excluido     
    })

  }

  editarCartao() {
    if (this.cartaoForm.dirty && this.cartaoForm.valid) {

      let p = Object.assign({}, this.cartao, this.cartaoForm.getRawValue());

      this.cartaoService.AtualizarCartao(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Cartão, Atualizado com Sucesso!');
          this.router.navigate(['cartao/lista']);
        },
        error => {
          this.onError(error)
        })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['cartao/lista']);
  }

  remover(id) {
    this.router.navigate(['cartao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['cartao/reativar/' + id]);
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
