import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ContaCorrente, Banco, Agencia, ContaCorrenteCobranca } from '../models/contacorrente';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-reativar-contacorrente',
  templateUrl: './reativar-contacorrente.component.html',
  providers: [MaskService],
  styleUrls: []
})
export class ReativarContaCorrenteComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public contaCorrenteForm: FormGroup;
  public contaCorrente: ContaCorrente;
  public contaCorrenteCobranca: ContaCorrenteCobranca;

  swal: SweetAlertAdviceService;
  cpfMask = this._maskService.Cpf();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public sub: Subscription;
  public contaCorrenteId: string = "";
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public bancos: Banco[];
  public agencias: Agencia[];
  public errors: any[] = [];
  public data: any[];

  constructor(private contaCorrenteService: ContaCorrenteService,
    private _maskService: MaskService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {

    this.contaCorrente = new ContaCorrente();
    //this.contaCorrente.contaCorrenteCobranca = new ContaCorrenteCobranca();


    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    this.contaCorrenteForm = this._fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      bancoId: ['', [Validators.required]],
      agenciaId: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      nomeEmpresa: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      conta: ['', [Validators.required]],
      digito: ['', [Validators.required]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.contaCorrenteId = params['id'];
        this.obterContaCorrente(this.contaCorrenteId);
      });

    this.contaCorrenteService.obterTodosContaCorrente()
      .subscribe(contaCorrente => {
        this.data = contaCorrente
      },
      error => this.errors);

    this.contaCorrenteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.contaCorrenteService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

    this.contaCorrenteService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos
      },
      error => this.errors);

    this.contaCorrenteService.obterTodosAgencia()
      .subscribe(agencias => {
        this.agencias = agencias
      },
      error => this.errors);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contaCorrenteForm);
    });

    var self = this;
    this.swal.showSwalConfirm('Reativar', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarContaCorrente();
      }
      else {
        self.cancelar();
      }
    });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }


  cancelar() {
    this.router.navigate(['contacorrente/editar/' + this.contaCorrenteId]);
  }

  obterContaCorrente(id: string) {
    this.contaCorrenteService.obterContaCorrentePorId(id)
      .subscribe(
      contaCorrente => this.preencherFormContaCorrente(contaCorrente),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormContaCorrente(contaCorrente: ContaCorrente): void {
    this.contaCorrente = contaCorrente;

    this.contaCorrenteForm.controls['codigo'].disable();

    this.contaCorrenteForm.patchValue({
      empresaId: this.contaCorrente.empresaId,
      grupoEmpresaId: this.contaCorrente.grupoEmpresaId,
      bancoId: this.contaCorrente.bancoId,
      agenciaId: this.contaCorrente.agenciaId,
      codigo: this.contaCorrente.codigo,
      descricao: this.contaCorrente.descricao,
      nomeEmpresa: this.contaCorrente.nomeEmpresa,
      cnpj: this.contaCorrente.cnpj,
      conta: this.contaCorrente.conta,
      digito: this.contaCorrente.digito
    });

  }

  reativarContaCorrente() {
    this.contaCorrenteService.reativarContaCorrente(this.contaCorrente)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Conta Corrente Reativada com Sucesso');
        this.router.navigate(['conta/lista']);
      },
      () => {
        () => this.errors;
      });
  }




}

