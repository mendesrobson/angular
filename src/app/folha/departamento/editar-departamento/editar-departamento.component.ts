import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Departamento, GrupoEmpresa, Empresa } from '../models/departamento';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { DepartamentoService } from '../departamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-departamento',
  templateUrl: './editar-departamento.component.html',
  styleUrls: []
})
export class EditarDepartamentoComponent implements OnInit {

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
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Grupo requerido!',
        maxlength: 'O código deve ter no Máximo 4 caracteres!'
      },
      codigo: {
        required: 'Código requerido!',
        maxlength: 'O código deve ter no Máximo 4 caracteres!'
      },
      descricao: {
        required: 'Descrição requerida!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
        maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
      },
      tipodepartamento: {
        required: 'Tipo Covenção requerida!',
        minlength: 'Tipo Covenção deve ter no mínimo 3 caracteres!',
        maxlength: 'Tipo Covenção deve ter no máximo 100 caracteres!'
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
      descricao: ['', [Validators.required]],
      excluido: 'N'
    });
    this.sub = this.route.params.subscribe(
      params => {
        this.departamentoId = params['id'];
        this.ObterTipoDeAdmissao(this.departamentoId);
      });

    this.departamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }
  
  ObterTipoDeAdmissao(id: string) {
    this.departamentoService.obterDepartamentoPorId(id)
      .subscribe(
        resultado => this.preencherFormdepartamento(resultado),
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
    !this.removerVisivel ? this.departamentoForm.disable() : this.departamentoForm.enable();

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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.departamentoForm);
    });
  }

  editardepartamento() {
    if (this.departamentoForm.dirty && this.departamentoForm.valid) {
      const p = Object.assign({}, this.departamento, this.departamentoForm.value);

      this.departamentoService.atualizarDepartamento(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Departamento atualizado com sucesso!');
              this.router.navigate(['departamento/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
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
    this.router.navigate(['departamento/lista']);
  }

  remover(id) {
    this.router.navigate(['departamento/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['departamento/reativar/' + id]);
  }

}