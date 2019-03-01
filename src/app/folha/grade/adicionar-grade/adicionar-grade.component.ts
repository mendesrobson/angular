import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Grade } from './../models/grade';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GradeService } from '../grade.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { testemunhaRouterConfig } from './../../../cadastros/testemunha/testemunha.routes';
import { TipoJornada } from '../../tipojornada/models/tipojornada';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Apontamento, Calendario, IDiaSemana } from '../../grade/models/apontamento';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-adicionar-grade',
  templateUrl: './adicionar-grade.component.html',
  styleUrls: []
})
export class AdicionarGradeComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  private modalIsOpen: boolean = false;
  @Input() apontamentoData: Apontamento[];
  dataAtual: Date = new Date(2018, 6, 15);
  calendario: Calendario[];
  diasSemana: IDiaSemana[];


  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
  dataSource: any;

  public grade: Grade;
  public gradeForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];
  public tipoJornadas: TipoJornada[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private gradeService: GradeService,
    private fb: FormBuilder,
    private router: Router,
    public toastr: ToastsManager,
    vcr: ViewContainerRef) {

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
      }
    };
    this.toastr.setRootViewContainerRef(vcr);
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.grade = new Grade();
    this.swal = new SweetAlertAdviceService();
    this.apontamentoData = this.gradeService.ObterTodosApontamentos();
    // this.diasSemana = [{ id: 15, dia: "Dom" }, { id: 16, dia: "Seg" }, { id: 17, dia: "Ter" }, { id: 18, dia: "Qua" },
    // { id: 19, dia: "Qui" }, { id: 20, dia: "Sex" }, { id: 21, dia: "Sab" }];
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


    // this.calendarioForm = this.fb.group({
    //   horarioInicio: '',
    //   horarioFim: '',
    //   intervaloInicio: '',
    //   intervaloFim: '',
    //   tipo: '',
    //   tipoIntervalo: '',
    //   dom: '',
    //   seg: '',
    //   ter: '',
    //   qua: '',
    //   qui: '',
    //   sex: '',
    //   sab: ''
    // });

    this.gradeService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => console.log(this.errors)
      );

    this.gradeService.obterTipoJornadas()
      .subscribe(tipoJornadas => {
        this.tipoJornadas = tipoJornadas;
      },
        () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.gradeForm);
    });
  }


  adicionarGrade() {
    if (this.gradeForm.dirty && this.gradeForm.valid) {
      const p = Object.assign({}, this.grade, this.gradeForm.value);

      this.gradeService.AdicionarGrade(p)
        .subscribe(
          () => {
            this.swal.showSwalSuccess('Grade Adicionado com Sucesso!');
            this.router.navigate(['grade/lista']);
          },
          error => {
            console.error(error);
          });
    }
  }
  // adicionarCalendario() {
  //   let p: Calendario = Object.assign({}, this.calendario, this.calendarioForm.getRawValue());
  //   let id = 15;
  //   for (let i = 0; i < this.diasSemana.length; i++) {
  //     if (this.diasSemana[i][id] == true) {
  //       if (p.intervaloInicio != '' || p.intervaloFim != '') {
  //         this.apontamentoData = this.gradeService.ObterApontamentos(p, this.diasSemana[i].id);
  //       } else {
  //         this.apontamentoData = this.gradeService.ObterApontamentosInicioFim(p, this.diasSemana[i].id);
  //       }
  //     }
  //     id++;
  //   }
  //   this.toastr.success("Apontamento inserido com Sucesso!", "Sucesso");
  //   this.modalIsOpen = false;
  // }

  // private openModal(open: boolean): void {
  //   this.modalIsOpen = open;
  // }


  apontamentoRendered($event) {
  //   for (let i = 0; i < this.apontamentoData.length; i++) {
  //     if (this.apontamentoData[i].endDate.valueOf() == $event.targetedAppointmentData.endDate.valueOf()
  //      && this.apontamentoData[i].startDate.valueOf() == $event.targetedAppointmentData.startDate.valueOf()){
  //       this.toastr.error("O Apontamento já existe!, remova para salvar", "Ops!");
  //       break;
  //     }  
  //  }
  }

  // private close() {
  //   this.modalIsOpen = false;
  // }
  // private ValidarApontamento(apontamentoAtual: Apontamento[], apontamentoNovo: Apontamento[]): boolean {
  //   let retorno: boolean = false;
  //   for (var posicao = 0; posicao < apontamentoAtual.length; posicao++) {
  //     if (apontamentoAtual[posicao].text == apontamentoNovo[posicao].text) {
  //       retorno = false;
  //       this.toastr.error("O Apontamento já existe,dele", "Ops!");
  //       break;
  //     } else {
  //       this.toastr.success("Apontamento inserido com Sucesso!", "Sucesso");
  //       retorno = true;
  //       this.apontamentoData = apontamentoNovo;
  //     }
  //   }
  //   return retorno;
  // }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['grade']);
  }

}
