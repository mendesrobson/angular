import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NaturezaLesao } from '../models/naturezalesao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { NaturezaLesaoService } from '../naturezalesao.service';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar-naturezalesao',
  templateUrl: './editar-naturezalesao.component.html',
  styleUrls: []
})
export class EditarNaturezalesaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public naturezaLesao: NaturezaLesao;
  public naturezaLesaoForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  private genericValidator: GenericValidator;
  public errors: any[] = [];

  public removerVisivel: boolean;
  public reativarVisivel: boolean;

  public naturezaLesaoId: "";
  public sub: Subscription;


  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  constructor(
    private naturezaLesaoService: NaturezaLesaoService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {

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
    this.naturezaLesao = new NaturezaLesao();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.naturezaLesaoForm = this.fb.group({
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

    this.sub = this.route.params.subscribe(
      params => {
        this.naturezaLesaoId = params['id'];
        this.obterNaturezaLesao(this.naturezaLesaoId);
      });

    this.naturezaLesaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  obterNaturezaLesao(id: string) {
    this.naturezaLesaoService.obterNaturezaLesao(id)
      .subscribe(
        naturezaLesao => this.preencherFormNaturezaLesao(naturezaLesao),
        response => {
          if (response.status === 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormNaturezaLesao(naturezaLesao: NaturezaLesao): void {
    this.naturezaLesao = naturezaLesao;

    this.reativarVisivel = this.naturezaLesao.excluido === 'S';
    this.removerVisivel = this.naturezaLesao.excluido === 'N';
    !this.removerVisivel ? this.naturezaLesaoForm.disable() : this.naturezaLesaoForm.enable();

    this.naturezaLesaoForm.patchValue({
      id: this.naturezaLesao.id,
      grupoEmpresaId: this.naturezaLesao.grupoEmpresaId,
      empresaId: this.naturezaLesao.empresaId,
      codigo: this.naturezaLesao.codigo,
      sigla: this.naturezaLesao.sigla,
      descricao: this.naturezaLesao.descricao,
      excluido: this.naturezaLesao.excluido
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.naturezaLesaoForm);
    });
  }

  editarNaturezaLesao() {
    if (this.naturezaLesaoForm.dirty && this.naturezaLesaoForm.valid) {

      const p = Object.assign({}, this.naturezaLesao, this.naturezaLesaoForm.getRawValue());

      this.naturezaLesaoService.AtualizarNaturezaLesao(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Natureza da Lesão, Atualizado com Sucesso!');
              this.router.navigate(['naturezalesao/lista']);
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
    this.router.navigate(['naturezalesao/lista']);
  }
  remover(id) {
    this.router.navigate(['naturezalesao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['naturezalesao/reativar/' + id]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.naturezaLesaoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

}

