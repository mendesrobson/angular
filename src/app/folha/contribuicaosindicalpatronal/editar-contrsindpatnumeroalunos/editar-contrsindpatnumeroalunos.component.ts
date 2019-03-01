import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter, ViewContainerRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContrSindPatNumeroAlunos, ContribuicaoSindicalPatronal } from '../models/contribuicaosindicalpatronal';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';
import { Toast, ToastsManager } from 'ng2-toastr';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { ListaContrsindpatnumeroalunosComponent } from '../lista-contrsindpatnumeroalunos/lista-contrsindpatnumeroalunos.component';

@Component({
  selector: 'app-editar-contrsindpatnumeroalunos',
  templateUrl: './editar-contrsindpatnumeroalunos.component.html',
  styleUrls: ['./editar-contrsindpatnumeroalunos.component.css']
})
export class EditarContrsindpatnumeroalunosComponent implements OnInit , AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public errors: any[] = [];

  public contrSindPatNumeroAlunos: ContrSindPatNumeroAlunos;
  public contrSindPatNumeroAlunosArray = [];
  public contrSindPatNumeroAlunosForm: FormGroup;
  public contribuicaoSindicalPatronalId = 0;


  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contribuicaoSindicalPatronalComponent: ContribuicaosindicalpatronalComponent,
    private listaContrsindpatnumeroalunosComponent: ListaContrsindpatnumeroalunosComponent
  ) {
    this.validationMessages = {
      numeroAlunosDe: { required: 'Número de Alunos De requerido.' },
      numeroAlunosAte: { required: 'Número de Alunos Ate requerido.' },
      percentual: { required: 'Percentual requerido.' },
      valor: { required: 'Valor requerido.' },
      ano: { required: 'Ano requerido.' }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contrSindPatNumeroAlunos = new ContrSindPatNumeroAlunos();
    this.swal = new SweetAlertAdviceService();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.contrSindPatNumeroAlunosForm);
    });
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined)
      this.contribuicaoSindicalPatronalId = 0;
    else
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];

    this.contrSindPatNumeroAlunosForm = this.fb.group({
      id: 0,
      numeroAlunosDe: ['', [Validators.required, Validators.maxLength(18)]],
      numeroAlunosAte: ['', [Validators.required,  Validators.maxLength(18)]],
      percentual: ['', [Validators.required,  Validators.maxLength(18)]],
      valor: ['', [Validators.required, Validators.maxLength(18)]],
      ano: ['', [Validators.required, Validators.maxLength(4)]],
      excluido: 'N'
    });

    this.preenchercontrSindPatNumeroAlunos(this.contribuicaoSindicalPatronalComponent.contrSindPatNumeroAluno);
  }

  preenchercontrSindPatNumeroAlunos(contrSindPatNumeroAluno: ContrSindPatNumeroAlunos) {

    this.contrSindPatNumeroAlunosForm.patchValue({
      id: contrSindPatNumeroAluno.id,
      numeroAlunosAte: contrSindPatNumeroAluno.numeroAlunosAte,
      numeroAlunosDe: contrSindPatNumeroAluno.numeroAlunosDe,
      percentual: contrSindPatNumeroAluno.percentual,
      valor: contrSindPatNumeroAluno.valor,
      ano: contrSindPatNumeroAluno.ano,
      excluido: contrSindPatNumeroAluno.excluido
    });
  }

  editarContrSindPatNumeroAlunos() {
    this.contrSindPatNumeroAlunosArray = this.contribuicaoSindicalPatronalComponent.ContribuicaoSindicalPatronal.contrSindPatNumeroAluno;
    if (this.contrSindPatNumeroAlunosForm.dirty && this.contrSindPatNumeroAlunosForm.valid) {
      let p = Object.assign({}, this.contrSindPatNumeroAlunos, this.contrSindPatNumeroAlunosForm.getRawValue());

      this.contribuicaoSindicalPatronalComponent.dirty = true;

      if (this.contribuicaoSindicalPatronalId > 0) {
        p.contribuicaoSindicalPatronalId = this.contribuicaoSindicalPatronalId;

        this.contribuicaoSindicalPatronalService.atualizarContrSindPatNumeroAlunos(p)
          .subscribe(
            result => {
              if (result) {
                for (let i = 0; this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.length > i; i++) {
                    if (p.id === this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno[i].id) {
                      this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno[i] = p;
                     }
                }
                this.swal.showSwalSuccess('Número de Alunos, Editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            () => {
              this.errors;
            });

      } else {

        this.contrSindPatNumeroAlunos = p;

        for (let i = 0; this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.length > i; i++) {
          if (this.contrSindPatNumeroAlunos.id === this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno[i].id) {
            this.contribuicaoSindicalPatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno[i] = this.contrSindPatNumeroAlunos;
          }
        }
        this.close();
      }
    }
  }
  
  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}