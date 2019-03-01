import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Departamento, GrupoEmpresa, Empresa } from '../models/departamento';
import { Subscription, Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { DepartamentoService } from '../departamento.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-excluir-departamento',
  templateUrl: './excluir-departamento.component.html',
  styleUrls: []
})
export class ExcluirDepartamentoComponent implements OnInit {
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
    private fb: FormBuilder,private router: Router,
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
      () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerdepartamento();
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
      guid: 1,
      grupoEmpresaId: this.departamento.grupoEmpresaId,
      empresaId: this.departamento.empresaId,
      codigo: this.departamento.codigo,
      sigla: this.departamento.sigla,
      descricao: this.departamento.descricao,
      excluido: this.departamento.excluido
    });
  }

  removerdepartamento() {
    this.departamentoService.removerDepartamento(this.departamento)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Departamento removido com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['departamento/lista']);
        },
        () => {
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
