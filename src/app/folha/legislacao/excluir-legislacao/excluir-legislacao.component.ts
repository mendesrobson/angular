import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Legislacao } from '../models/legislacao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { LegislacaoService } from '../legislacao.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-excluir-legislacao',
  templateUrl: './excluir-legislacao.component.html',
  styleUrls: []
})
export class ExcluirLegislacaoComponent implements OnInit , AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean;
  public reativarVisivel:   boolean;

  public legislacao: Legislacao;
  public legislacaoForm: FormGroup;
  public legislacaoId: "";

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
   private legislacaoService: LegislacaoService,
   private fb: FormBuilder,
   private router: Router,
   private httpClient: HttpClient,
   private _maskService: MaskService,
   private _utilService: UtilService,
   private route: ActivatedRoute) {
    this.validationMessages = {
      codigo: {
        required: 'A Codigo é requerida.',
      },
      descricao: {
        required: 'A Descrição é requerida.',
      },
      dataHomologacao: {
        required: 'A Data Homologação é requerida.',
      },
      dataDou: {
        required: 'A Data DOU é requerida.',
      },
    };

       this.genericValidator = new GenericValidator(this.validationMessages);
       this.legislacao = new Legislacao();
       this.swal = new SweetAlertAdviceService();
 }

   ngOnInit() {
    this.legislacaoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required]],
      sigla: [''],
      descricao: ['', [Validators.required]],
      observacao: ['', [Validators.required]],
      dataHomologacao: ['', [Validators.required]],
      dataDou: ['', [Validators.required]],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.legislacaoId = params['id'];
        this.obterLegislacao(this.legislacaoId);
      });

    this.legislacaoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas;
    },
      error => this.errors);
  }

   ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
       .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

       const self = this;
       this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
         if (isConfirmed) {
           self.removerLegislacao();
         } else {
           self.cancelar();
         }
       });
   }

   obterLegislacao(id: string) {
     this.legislacaoService.obterLegislacao(id)
       .subscribe(
        legislacao => this.preencherFormLegislacao(legislacao),
       response => {
         if (response.status === 404) {
           this.router.navigate(['404']);
         }
       });
   }

   preencherFormLegislacao(legislacao: Legislacao): void {
     this.legislacao = legislacao;

     this.reativarVisivel = this.legislacao.excluido === 'S';
     this.removerVisivel = this.legislacao.excluido === 'N';

     this.legislacaoForm.patchValue({
       id: this.legislacao.id,
       grupoEmpresaId: this.legislacao.grupoEmpresaId,
       empresaId: this.legislacao.empresaId,
       codigo: this.legislacao.codigo,
       sigla: this.legislacao.sigla,
       descricao: this.legislacao.descricao,
       observacao: this.legislacao.observacao,
       dataHomologacao: this._utilService.ToDate(this.legislacao.dataHomologacao),
       dataDou: this._utilService.ToDate(this.legislacao.dataDou),
       excluido: this.legislacao.excluido
     });
     console.log(this.legislacaoForm);
    }

    removerLegislacao() {
       this.legislacaoService.RemoverLegislacao(this.legislacao)
         .subscribe(
           result => {
             if (result) {
               this.swal.showSwalSuccess('Legislação, Atualizado com Sucesso!');
               this.router.navigate(['legislacao/lista']);
             } else {
               this.swal.showSwalErro('Ocorreu um erro ao gravar!');
             }
           },
           error => {
             console.error(error);
           });
   }

   onError(error) {
     this.errors = JSON.parse(error._body).errors;
   }

   cancelar() {
     this.router.navigate(['legislacao/lista']);
   }

   remover(id) {
     this.router.navigate(['legislacao/excluir/' + id]);
   }

   reativar(id) {
     this.router.navigate(['legislacao/reativar/' + id]);
   }

   ConsultaEmpresa(idGrupo) {
     this.empresas = [];
     this.legislacaoService.obterTodosEmpresa(idGrupo)
       .subscribe(empresas => {
         this.empresas = empresas;
       },
         () => this.errors);
   }
 }

