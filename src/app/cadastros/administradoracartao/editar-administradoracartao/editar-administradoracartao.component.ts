import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from '../models/administradoracartao';
import { Banco } from '../../banco/models/banco';
import { Agencia } from '../../agencia/models/agencia';
import { TipoConta, ContaCorrente } from '../../contacorrente/models/contacorrente';
import { AdministradoracartaoComponent } from '../administradoracartao.component';

@Component({
  selector: 'app-editar-administradoracartao',
  templateUrl: './editar-administradoracartao.component.html',
  styleUrls: []
})
export class EditarAdministradoracartaoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public administradoraCartao: Administradoracartao;
  public administradoraCartaoEndereco: AdministradoraCartaoEndereco;
  public administradoraCartaoContato: AdministradoraCartaoContato;
  public administradoraCartaoForm: FormGroup;

  public bancos: Banco[];
  public agencias: Agencia[];
  public tipoContas: TipoConta[];
  public contaCorrentes: ContaCorrente[];
  public sub: Subscription;
  public administradoraCartaoId: string = "";

  public visualizaEndereco: boolean = false;


  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public errors: any[] = [];

  constructor(private administradoraCartaoService: AdministradoracartaoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private administradoraCartaoComponent: AdministradoracartaoComponent) { 

      this.validationMessages = {
        grupoEmpresaId: {
          required: 'Informe o Grupo'
        },
        empresaId: {
          required: 'Informe a Empresa'
        },
        codigo: {
          required: 'Informe o código',
          minlength: 'O Código precisa ter no mínimo 2 caracteres',
          maxlength: 'O Código precisa ter no máximo 20 caracteres'
        }
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.administradoraCartao = new Administradoracartao();
      this.administradoraCartaoEndereco = new AdministradoraCartaoEndereco();
      this.administradoraCartaoContato = new AdministradoraCartaoContato();
      this.swal = new SweetAlertAdviceService();
    }

  ngOnInit() {
    this.administradoraCartaoForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      razaoSocial: ['', [Validators.required]],
      nomeFantasia: '',
      bancoId: '',
      agenciaId: '',
      contaCorrenteId: '',
      pagarReceber: '',
      diaLimite: 0,
      diaVencimento: 0,
      cartaoCredito: 'N',
      cartaoDebito: 'N',
      quantidadeDiasCredito: 0,
      quantidadeDiasDebito: 1,
      percTaxaCredito: 0,
      percTaxaDebito: 0,

    });

    this.administradoraCartaoForm.controls['bancoId'].disable();
    this.administradoraCartaoForm.controls['agenciaId'].disable();
    this.administradoraCartaoForm.controls['quantidadeDiasDebito'].disable();

    this.sub = this.route.params.subscribe(
      params => {
        this.administradoraCartaoId = params['id'];
        this.obterAdministradoraCartao(this.administradoraCartaoId);
      });

    this.administradoraCartaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.administradoraCartaoService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos
      },
      error => this.errors);

    this.administradoraCartaoService.obterTodosAgencia()
      .subscribe(agencias => {
        this.agencias = agencias
      },
      error => this.errors);
  }

  obterAdministradoraCartao(id: string) {
    this.administradoraCartaoService.obterAdministradoraCartao(id)
    .subscribe(            
    administradoraCartao => this.preencherFormAdministradoraCartao(administradoraCartao),
    response => {
      if (response.status == 404) {
        this.router.navigate(['404']);
      }
    });
  }

  preencherFormAdministradoraCartao(administradoraCartao: Administradoracartao): void {
    this.administradoraCartao = administradoraCartao;
    this.administradoraCartaoComponent.Administradoracartao = administradoraCartao;
    this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoEndereco = administradoraCartao.administradoraCartaoEndereco;
    this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato = administradoraCartao.administradoraCartaoContato;
    // this.reativarVisivel = this.agencia.excluido === 'S';
    // this.removerVisivel = this.agencia.excluido === 'N';

    this.administradoraCartaoForm.controls['codigo'].disable();

    this.administradoraCartaoForm.patchValue({
      codigo : this.administradoraCartao.codigo,
      grupoEmpresaId: administradoraCartao.grupoEmpresaId,
      empresaId: administradoraCartao.empresaId,
      razaoSocial: administradoraCartao.razaoSocial,
      nomeFantasia: administradoraCartao.nomeFantasia,
      bancoId: administradoraCartao.bancoId,
      agenciaId: administradoraCartao.agenciaId,
      contaCorrenteId: administradoraCartao.contaCorrenteId,
      pagarReceber: administradoraCartao.pagarReceber,
      diaLimite: administradoraCartao.diaLimite,
      diaVencimento: administradoraCartao.diaVencimento,
      cartaoCredito: administradoraCartao.cartaoCredito,
      cartaoDebito: administradoraCartao.cartaoDebito,
      quantidadeDiasCredito: administradoraCartao.quantidadeDiasCredito,
      quantidadeDiasDebito: administradoraCartao.quantidadeDiasDebito,
      percTaxaCredito: administradoraCartao.percTaxaCredito,
      percTaxaDebito: administradoraCartao.percTaxaDebito,
    });

    this.visualizaEndereco = true;
  }

  editarAdministradoraCartao() {
    if (this.administradoraCartaoForm.dirty && this.administradoraCartaoForm.valid) {

      let p = Object.assign({}, this.administradoraCartao, this.administradoraCartaoForm.getRawValue());

      this.administradoraCartaoService.AtualizarAdministradoraCartao(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Administradora de Cartão atualizado com Sucesso!');
          this.router.navigate(['administradoracartao/lista']);
        },
        error => {
          this.onError(error)
        })
    }
  }

  popularDadosBancarios(id) {
    this.administradoraCartaoService.obterContaCorrentePorId(id)
      .subscribe(
      result => {
        
        this.administradoraCartaoForm.controls['agenciaId'].setValue(result.agenciaId); 
        this.administradoraCartaoForm.controls['bancoId'].setValue(result.bancoId); 

      });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['administradoracartao/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.administradoraCartaoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaSelectEmpresa(idEmpresa) {
    this.contaCorrentes = [];
    this.administradoraCartaoService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
      () => { });

  }

}
