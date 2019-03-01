import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrauInstrucao } from '../models/grauinstrucao';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrauInstrucaoService } from '../grauinstrucao.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-editar-grauinstrucao',
  templateUrl: './editar-grauinstrucao.component.html',
  styleUrls: []
})
export class EditarGrauInstrucaoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel = false;
  public reativarVisivel = false;

  public grauInstrucao: GrauInstrucao;
  public grauInstrucaoForm: FormGroup;
  public grauInstrucaoId: " ";
  displayMessage: { [key: string]: string } = {};

  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];
  public sub: Subscription;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private grauInstrucaoService: GrauInstrucaoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigoRais: {
        required: 'Empresa requerida.'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      codigoESocial: {
        required: 'Total de horas requerida.'
      },
      codigoCaged: {
        required: 'Tipo Jornada requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 60 caracteres'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.grauInstrucao = new GrauInstrucao();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.grauInstrucaoForm = this.fb.group({
      id: 0,
      codigoRais: ['', [Validators.required]],
      codigoESocial: ['', [Validators.required]],
      codigoCaged: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      codigo: '',
      sigla: '',
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.grauInstrucaoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        error => console.log(this.errors)
      );

    this.sub = this.route.params.subscribe(
      params => {
        this.grauInstrucaoId = params['id'];
        this.obterGrauInstrucao(this.grauInstrucaoId);
      });
  }

  obterGrauInstrucao(id: string) {
    this.grauInstrucaoService.obterGrauInstrucao(id)
      .subscribe(
        tipoJornada => this.preencherFormGrauInstrucao(tipoJornada),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }
  preencherFormGrauInstrucao(grauInstrucao: GrauInstrucao): void {
    this.grauInstrucao = grauInstrucao;

    this.reativarVisivel = this.grauInstrucao.excluido === 'S';
    this.removerVisivel = this.grauInstrucao.excluido === 'N';
    !this.removerVisivel ? this.grauInstrucaoForm.disable() : this.grauInstrucaoForm.enable();

    this.grauInstrucaoForm.patchValue({
      id: this.grauInstrucao.id,
      codigoRais: this.grauInstrucao.codigoRais,
      codigoESocial: this.grauInstrucao.codigoESocial,
      codigoCaged: this.grauInstrucao.codigoCaged,
      codigo: this.grauInstrucao.codigo,
      sigla: this.grauInstrucao.sigla,
      descricao: this.grauInstrucao.descricao,
      excluido: this.grauInstrucao.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.grauInstrucaoForm);
    });
  }

  editarGrauInstrucao() {
    if (this.grauInstrucaoForm.dirty && this.grauInstrucaoForm.valid) {
      const p = Object.assign({}, this.grauInstrucao, this.grauInstrucaoForm.value);

      this.grauInstrucaoService.atualizarGrauInstrucao(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Grau de Instrução Atualizado com Sucesso!');
            this.router.navigate(['grauinstrucao/lista']);
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
    this.router.navigate(['grauinstrucao/lista']);
  }

  remover(id) {
    this.router.navigate(['grauinstrucao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['grauinstrucao/reativar/' + id]);
  }

}
