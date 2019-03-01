import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Legislacao } from '../models/legislacao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { LegislacaoService } from '../legislacao.service';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-adicionar-legislacao',
  templateUrl: './adicionar-legislacao.component.html',
  styleUrls: []
})
export class AdicionarLegislacaoComponent implements OnInit , AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public legislacao: Legislacao;
  public legislacaoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private legislacaoService : LegislacaoService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router
  ) {
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
      dataDou: [''],
      excluido: 'N'
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

      Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.legislacaoForm);
    });
  }

  adicionarLegislacao() {
    if (this.legislacaoForm.dirty && this.legislacaoForm.valid) {

      const p = Object.assign({}, this.legislacao, this.legislacaoForm.getRawValue());
      console.log(p);

      this.legislacaoService.AdicionarLegislacao(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Legislação, Adicionado com Sucesso!');
              this.router.navigate(['legislacao/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          error => {
            console.error(error);
          });
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['legislacao/lista']);
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
