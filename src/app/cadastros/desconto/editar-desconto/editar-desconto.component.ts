import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { MaskService } from '../../../services/mask.service';

import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { Desconto, GrupoDesconto, TipoDesconto } from '../models/desconto';
import { DescontoService } from '../desconto.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Mascara } from '../../mascara/models/mascara';


@Component({
  selector: 'app-editar-desconto',
  templateUrl: './editar-desconto.component.html',
  providers: [MaskService],
  styleUrls: []
})

export class EditarDescontoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public codMask = [];

  public desconto: Desconto;
  public descontoForm: FormGroup;
  public descontoId: string = "";
  public disableForm: boolean;
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public grupoDescontos: GrupoDesconto[];
  public tipoDescontos: TipoDesconto[];

  public errors: any[] = [];

  constructor(
    private descontoService: DescontoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      grupoEmpresaId:
        {
          required: 'Grupo requerido.'
        },
      empresaId: {
        required: 'Empresa requerida.'
      },
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      // grupoDescontoId:
      //   {
      //     required: 'Grupo Desconto requerido.'
      //   },
      tipoDescontoId:
        {
          required: 'Tipo Desconto requerido.'
        },
      percentualValor:
        {
          required: 'Percentual/Valor requerido.'
        }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.desconto = new Desconto();
    this.swal = new SweetAlertAdviceService();
    this.disableForm = false;
  }

  ngOnInit(): void {

    this.descontoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      grupoDescontoId: null,
      tipoDescontoId: ['', [Validators.required]],
      ordemCalculo: [],
      quantidadeDiasAposVencimento: [],
      percentualValor: ['', [Validators.required]],
      valorAplicar: [],
      progressivoFatorTempo: [],
      progressivoDias: 0,
      progressivoDiaUtil: 'N',
      progressivoMesAnterior: 'N',
      exigeLiberacao: 'N',
      perdeAposVencimento: 'N',
      cumulativo: 'N',
      consideraCalculoDescCumulativo: 'N',
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.descontoId = params['id'];
        this.obterDesconto(this.descontoId);
      });

    this.descontoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    // this.descontoService.obterTodosGrupoDesconto()
    //   .subscribe(grupoDescontos => {
    //     this.grupoDescontos = grupoDescontos
    //   },
    //   error => this.errors);

    this.descontoService.obterTodosTipoDesconto()
      .subscribe(tipoDescontos => {
        this.tipoDescontos = tipoDescontos
      },
      error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.descontoForm);
    });

  }

  obterDesconto(id: string) {
    this.descontoService.obterDesconto(id)
      .subscribe(
      desconto => this.preencherFormDesconto(desconto),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  async preencherFormDesconto(desconto: Desconto): Promise<void> {
    this.desconto = desconto;

    this.reativarVisivel = this.desconto.excluido === 'S';
    this.removerVisivel = this.desconto.excluido === 'N';
    !this.removerVisivel ? this.descontoForm.disable() : this.descontoForm.enable();
    !this.removerVisivel ? this.disableForm = true : this.disableForm = false;
    this.descontoForm.controls['codigo'].disable();
    
    this.descontoForm.patchValue({
      codigo: this.desconto.codigo,
      sigla: this.desconto.sigla,
      descricao: this.desconto.descricao,
      empresaId: this.desconto.empresaId,
      grupoEmpresaId: this.desconto.grupoEmpresaId,
      grupoDescontoId: this.desconto.grupoDescontoId,
      tipoDescontoId: this.desconto.tipoDescontoId,
      ordemCalculo: this.desconto.ordemCalculo,
      quantidadeDiasAposVencimento: this.desconto.quantidadeDiasAposVencimento,
      percentualValor: this.desconto.percentualValor,
      valorAplicar: this.desconto.valorAplicar,
      progressivoFatorTempo: this.desconto.progressivoFatorTempo,
      progressivoDias: this.desconto.progressivoDias,
      progressivoDiaUtil: this.desconto.progressivoDiaUtil,
      progressivoMesAnterior: this.desconto.progressivoMesAnterior,
      exigeLiberacao: this.desconto.exigeLiberacao,
      perdeAposVencimento: this.desconto.perdeAposVencimento,
      cumulativo: this.desconto.cumulativo,
      consideraCalculoDescCumulativo: this.desconto.consideraCalculoDescCumulativo,
      excluido: this.desconto.excluido 
    });

    // if(desconto.empresaId != null){

    //   let mascara = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Desconto', this.desconto.grupoEmpresaId, this.desconto.empresaId);

    //   if(mascara != null)
    //   this.codMask = this._maskService.CodigoMaskGrupo(mascara);
    //   else
    //   this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    // } 
    // else{

    //   let mascara = await this._maskService.VerificaCodSequencialGrupo(1, 'Desconto', this.desconto.grupoEmpresaId);

    //   if(mascara != null)
    //   this.codMask = this._maskService.CodigoMaskGrupo(mascara);
    //   else
    //   this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      
    // }

    
  }

  editarDesconto() {
    if (this.descontoForm.dirty && this.descontoForm.valid) {

      let p = Object.assign({}, this.desconto, this.descontoForm.getRawValue());

      this.descontoService.AtualizarDesconto(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Desconto, Atualizado com Sucesso!');
          this.router.navigate(['desconto/lista']);
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
    this.router.navigate(['desconto/lista']);
  }

  remover(id) {
    this.router.navigate(['desconto/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['desconto/reativar/' + id]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.descontoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }
}
