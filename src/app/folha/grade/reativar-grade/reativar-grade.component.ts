import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from '../../../cadastros/empresa/models/empresa';
import { TipoJornada } from '../../tipojornada/models/tipojornada';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GradeService } from '../grade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Grade } from './../models/grade';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reativar-grade',
  templateUrl: './reativar-grade.component.html',
  styleUrls: []
})
export class ReativarGradeComponent implements OnInit, AfterViewInit  {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel = false;
  public reativarVisivel = false;

  public grade: Grade;
  public gradeForm: FormGroup;
  public gradeId = "";

  displayMessage: { [key: string]: string } = {};

  public empresas: Empresa[];
  public tipoJornadas: TipoJornada[];
  public grades: Grade[];
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
    private route: ActivatedRoute) {
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

    this.sub = this.route.params.subscribe(
      params => {
        this.gradeId = params['id'];
        this.obtertGrade(this.gradeId);
      });
      this.gradeService.obterTipoJornadas()
      .subscribe(tipoJornada => {
        this.tipoJornadas = tipoJornada;
      },
      error => this.errors);

  }

  obtertGrade(id: string) {
    this.gradeService.obterGrade(id)
      .subscribe(
        grade => this.preencherFormGrade(grade),
      response => {
        if (response.status === 404) {
          this.router.navigate(['NotFound']);
        }
      });
  }

  preencherFormGrade(grade: Grade): void {
    this.grade = grade;

    this.reativarVisivel = this.grade.excluido === 'S';
    this.removerVisivel = this.grade.excluido === 'N';

    this.gradeForm.patchValue({
      id: this.grade.id,
      tipoJornadaId: this.grade.tipoJornadaId,
      empresaId: this.grade.empresaId,
      turno: this.grade.turno,
      totalHorasMes: this.grade.totalHorasMes,
      descricao: this.grade.descricao,
      excluido: this.grade.excluido
    });
  }


  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      const self = this;
      this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
        if (isConfirmed) {
          self.reativarGrade();
        } else {
          self.cancelar();
        }
      });
  }

  reativarGrade() {
    this.gradeService.ReativarGrade(this.grade)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Grade Reativado com Sucesso');
        this.router.navigate(['grade/lista']);
      },
      error => {
        console.error(error);
      });
  }

  cancelar() {
    this.router.navigate(['grade/editar/' + this.grade]);
  }

}
