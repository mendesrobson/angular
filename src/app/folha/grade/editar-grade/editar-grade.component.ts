import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Grade } from '../models/grade';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GradeService } from '../grade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoJornada } from './../../tipojornada/models/tipojornada';

@Component({
  selector: 'app-editar-grade',
  templateUrl: './editar-grade.component.html',
  styleUrls: []
})
export class EditarGradeComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel = false;
  public reativarVisivel = false;

  public grade: Grade;
  public gradeForm: FormGroup;
  public gradeId = "";

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipoJornadas: TipoJornada[];
  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private gradeService: GradeService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.validationMessages = {
      empresaId: {
        required: 'Empresa requerida.'
      },
      descricao: {
          required: 'A Descrição é requerida.',
          minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
          maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      totalHorasMes: {
        required: 'Total de horas requerida.'
      },
      tipoJornadaId: {
        required: 'Tipo Jornada requerida.'
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.grade = new Grade();
    this.swal = new SweetAlertAdviceService();
  }
  ngOnInit() {
    this.gradeForm = this.fb.group({
      id: 0,
      empresaId: ['', [Validators.required]],
      totalHorasMes: '',
      tipoJornadaId: ['', [Validators.required]],
      turno: '',
      descricao: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
        excluido: 'N'
          });

    this.gradeService.obterTodosEmpresa()
    .subscribe(empresas => {
      this.empresas = empresas;
    },
    error => this.errors);

    this.gradeService.obterTipoJornadas()
    .subscribe(tipoJornada => {
      this.tipoJornadas = tipoJornada;
    },
    error => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this.gradeId = params['id'];
        this.obterGrade(this.gradeId);
      });
  }

  obterGrade(id: string) {
    this.gradeService.obterGrade(id)
      .subscribe(
      tipoJornada => this.preencherFormTipoJornada(tipoJornada),
      response => {
        if (response.status === 404) {
          this.router.navigate(['NotFound']);
        }
      });
    }

  preencherFormTipoJornada(grade: Grade): void {
    this.grade = grade;
    this.reativarVisivel = this.grade.excluido === 'S';
    this.removerVisivel = this.grade.excluido === 'N';
    !this.removerVisivel ? this.gradeForm.disable() : this.gradeForm.enable();

    this.gradeForm.patchValue({
      id: this.grade.id,
      empresaId: this.grade.empresaId,
      descricao: this.grade.descricao,
      excluido: this.grade.excluido,
      turno : this.grade.turno,
      totalHorasMes : this.grade.totalHorasMes,
      tipoJornadaId : this.grade.tipoJornadaId,
    });
  }

  editarGrade() {
    if (this.gradeForm.dirty && this.gradeForm.valid) {
      const p = Object.assign({}, this.grade, this.gradeForm.value);
      this.gradeService.AtualizarGrade(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Grade Atualizado com Sucesso');
          this.router.navigate(['grade/lista']);
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
    this.router.navigate(['grade/lista']);
  }

  remover(id) {
    this.router.navigate(['grade/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['grade/reativar/' + id]);
  }
}
