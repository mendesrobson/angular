import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { SitGeradoraAcidenteTrabalho } from '../models/sitgeradoraacidentetrabalho';
import { SitGeradoraAcidenteTrabalhoService } from '../sitgeradoraacidentetrabalho.service';

@Component({
  selector: 'app-editar-sitgeradoraacidentetrabalho',
  templateUrl: './editar-sitgeradoraacidentetrabalho.component.html',
  styleUrls: []
})
export class EditarSitgeradoraacidentetrabalhoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public reativarVisivel = false;
    public removerVisivel = false;
  
    public sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho;
    public sitGeradoraAcidenteTrabalhoForm: FormGroup;
    public sitGeradoraAcidenteTrabalhoId: "";
    displayMessage: { [key: string]: string } = {};
  
    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public afastamentos = new Array();
  
    public sub: Subscription;
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
  
    swal: SweetAlertAdviceService;
    public errors: any[] = [];

  constructor(
    private sitGeradoraAcidenteTrabalhoService: SitGeradoraAcidenteTrabalhoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

      this.validationMessages = {
        codigo: {
            required: 'O Código é requerido.',
            minlength: 'O Código precisa ter no mínimo 2 caracteres',
            maxlength: 'O Código precisa ter no máximo 20 caracteres'
        },
        sigla: {
            required: 'A Sigla é requerida.',
            minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
            maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
        },
        descricao: {
            required: 'A Descrição é requerida.',
            minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
            maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
        }
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.sitGeradoraAcidenteTrabalho = new SitGeradoraAcidenteTrabalho();
      this.swal = new SweetAlertAdviceService();

     }

  ngOnInit() {

    this.sitGeradoraAcidenteTrabalhoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.sitGeradoraAcidenteTrabalhoService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
      error => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.sitGeradoraAcidenteTrabalhoId = params['id'];
        this.obterSitGeradoraAcidenteTrabalho(this.sitGeradoraAcidenteTrabalhoId);
      });
  }

  obterSitGeradoraAcidenteTrabalho(id: string) {
    this.sitGeradoraAcidenteTrabalhoService.obterSitGeradoraAcidenteTrabalho(id)
      .subscribe(
        sitGeradoraAcidenteTrabalho => this.preencherFormSitGeradoraAcidenteTrabalho(sitGeradoraAcidenteTrabalho),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormSitGeradoraAcidenteTrabalho(sitGeradoraAcidenteTrabalho: SitGeradoraAcidenteTrabalho): void {
    this.sitGeradoraAcidenteTrabalho = sitGeradoraAcidenteTrabalho;

    this.reativarVisivel = this.sitGeradoraAcidenteTrabalho.excluido === 'S';
    this.removerVisivel = this.sitGeradoraAcidenteTrabalho.excluido === 'N';
    !this.removerVisivel ? this.sitGeradoraAcidenteTrabalhoForm.disable() : this.sitGeradoraAcidenteTrabalhoForm.enable();

    this.sitGeradoraAcidenteTrabalhoForm.patchValue({
      id: this.sitGeradoraAcidenteTrabalho.id,
      grupoEmpresaId: this.sitGeradoraAcidenteTrabalho.grupoEmpresaId,
      empresaId: this.sitGeradoraAcidenteTrabalho.empresaId,
      codigo: this.sitGeradoraAcidenteTrabalho.codigo,
      sigla: this.sitGeradoraAcidenteTrabalho.sigla,
      descricao: this.sitGeradoraAcidenteTrabalho.descricao,
      excluido: this.sitGeradoraAcidenteTrabalho.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.sitGeradoraAcidenteTrabalhoForm);
    });
  }

  editarSituacaoGeradoraAcidenteTrabalho() {
    if (this.sitGeradoraAcidenteTrabalhoForm.dirty && this.sitGeradoraAcidenteTrabalhoForm.valid) {
      const p = Object.assign({}, this.sitGeradoraAcidenteTrabalho, this.sitGeradoraAcidenteTrabalhoForm.value);

      this.sitGeradoraAcidenteTrabalhoService.atualizarSitGeradoraAcidenteTrabalho(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Situação Geradora do Acidente de Trabalho atualizado com sucesso!');
                this.router.navigate(['sitgeradoraacidentetrabalho/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

        },
        error => {
            console.error(error)
        })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.sitGeradoraAcidenteTrabalhoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['sitgeradoraacidentetrabalho/lista']);
  }

  remover(id) {
    this.router.navigate(['sitgeradoraacidentetrabalho/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['sitgeradoraacidentetrabalho/reativar/' + id]);
  }

}
