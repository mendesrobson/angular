import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { HistoricoPadraoService } from '../historicopadrao.service';
import { HistoricoPadrao } from '../models/historicopadrao';
import { HistoricopadraoComponent } from '../historicopadrao.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-reativar-historicopadrao',
  templateUrl: './reativar-historicopadrao.component.html',
  styleUrls: []
})
export class ReativarHistoricopadraoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public historicoPadrao: HistoricoPadrao;
  public historicoPadraoForm: FormGroup;

  carregaCentroCusto: boolean = false;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  public historicoPadraoId: string = "";

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public historicosPadroes: HistoricoPadrao[];
  public sub: Subscription;

  public errors: any[] = [];

  constructor(
    private historicoPadraoService: HistoricoPadraoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private historicoPadraoComponent: HistoricopadraoComponent) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      empresaId: {
        required: 'Informe a Empresa'
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
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.historicoPadrao = new HistoricoPadrao();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.historicoPadraoForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      historicoPadraoPaiId: 0,
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });


    this.historicoPadraoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.historicoPadraoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

    this.historicoPadraoService.ObterTodosHistoricoPadraoPai()
      .subscribe(historicosPadroes => {
        this.historicosPadroes = historicosPadroes
      },
      error => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.historicoPadraoId = params['id'];
        this.obterHistoricoPadrao(this.historicoPadraoId);
      });



  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    
    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
    if (isConfirmed) {
        self.reativarHistoricoPadrao();
        }
    else {
        self.cancelar();
      }});  
  }

  obterHistoricoPadrao(id: string) {
    this.historicoPadraoService.obterHistoricoPadrao(id)
      .subscribe(
      historicoPadrao => this.preencherFormHistoricoPadrao(historicoPadrao),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormHistoricoPadrao(historicoPadrao: HistoricoPadrao): void {
    this.historicoPadrao = historicoPadrao;
    this.historicoPadraoComponent.HistoricoPadrao = historicoPadrao;

    this.historicoPadraoForm.patchValue({
      grupoEmpresaId: this.historicoPadrao.grupoEmpresaId,
      empresaId: this.historicoPadrao.empresaId,
      historicoPadraoPaiId: this.historicoPadrao.historicoPadraoPaiId,
      codigo: this.historicoPadrao.codigo,
      sigla: this.historicoPadrao.sigla,
      descricao: this.historicoPadrao.descricao
    });

    this.carregaCentroCusto = true;
  }

  reativarHistoricoPadrao() {
    this.historicoPadraoService.ReativarHistoricoPadrao(this.historicoPadrao)
    .subscribe(
    result => { 
      this.swal.showSwalSuccess('Histórico Padrão Reativado com Sucesso');
      this.router.navigate(['historicopadrao/lista']);
    },
    error => { 
      error => this.errors;
    });
  } 

  cancelar() {
    this.router.navigate(['historicopadrao/lista']);
  }

  remover(id) {
    this.router.navigate(['historicopadrao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['historicopadrao/reativar/' + id]);
  }

}
