import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departamento, GrupoEmpresa, Empresa } from '../models/departamento';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartamentoService } from '../departamento.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-reativar-departamento',
  templateUrl: './reativar-departamento.component.html',
  styleUrls: []
})
export class ReativarDepartamentoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public departamento: Departamento;
  public departamentoForm: FormGroup;
  public departamentoId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private departamentoService: DepartamentoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

      this.validationMessages = {
          descricao: {
            required: 'Descrição requerida!',
            minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
            maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
          }
      };
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.departamento = new Departamento();
      this.swal = new SweetAlertAdviceService();

     }

  ngOnInit() {
    this.departamentoForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: [''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.departamentoId = params['id'];
        this.Obterdepartamento(this.departamentoId);
      });

    this.departamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativardepartamento();
      } else {
        self.cancelar();
      }
    });
  }

  Obterdepartamento(id: string) {
    this.departamentoService.obterDepartamentoPorId(id)
      .subscribe(
        departamento => this.preencherFormdepartamento(departamento),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormdepartamento(departamento: Departamento): void {
    this.departamento = departamento;

    this.reativarVisivel = this.departamento.excluido === 'S';
    this.removerVisivel = this.departamento.excluido === 'N';

    this.departamentoForm.patchValue({
      id: this.departamento.id,
      grupoEmpresaId: this.departamento.grupoEmpresaId,
      empresaId: this.departamento.empresaId,
      codigo: this.departamento.codigo,
      sigla: this.departamento.sigla,
      descricao: this.departamento.descricao,
      excluido: this.departamento.excluido
    });
  }

  reativardepartamento() {
    this.departamentoService.reativarDepartamento(this.departamento)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('Departamento, reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }
        this.router.navigate(['departamento/lista']);
      },
      error => {
        console.error(error);
      });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.departamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['departamento/editar/' + this.departamentoId]);
  }
}


