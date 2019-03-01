import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, Input, Output, EventEmitter, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ContrSindPatNumeroAlunos } from '../models/contribuicaosindicalpatronal';
import { ContribuicaoSindicalPatronalService } from '../contribuicaosindicalpatronal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContribuicaosindicalpatronalComponent } from '../contribuicaosindicalpatronal.component';
import { ListaContrsindpatnumeroalunosComponent } from '../lista-contrsindpatnumeroalunos/lista-contrsindpatnumeroalunos.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-adicionar-contrsindpatnumeroalunos',
  templateUrl: './adicionar-contrsindpatnumeroalunos.component.html',
  styleUrls: ['./adicionar-contrsindpatnumeroalunos.component.css']
})
export class AdicionarContrsindpatnumeroalunosComponent implements OnInit, AfterViewInit {
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
  public datePipe: DatePipe;

  public contrSindPatNumeroAlunos: ContrSindPatNumeroAlunos;
  public contrSindPatNumeroAluno = [];
  public contrSindPatNumeroAlunosForm: FormGroup;
  public contribuicaoSindicalPatronalId = 0;
  public listaContrSindPatNumeroAlunos: ContrSindPatNumeroAlunos[];

  constructor(
    private contribuicaoSindicalPatronalService: ContribuicaoSindicalPatronalService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private contribuicaosindicalpatronalComponent: ContribuicaosindicalpatronalComponent,
    private listcontrSindPatNumeroAlunos: ListaContrsindpatnumeroalunosComponent
  ) {
    this.validationMessages = {
      numeroAlunosDe: {
        required: 'O Número de alunos De é requerida.',
      },
      numeroAlunosAte: {
        required: 'O Número de alunos Ate é requerida.',
      },
      percentual: {
        required: 'Percentual requerido!',
        max: 'Percentual máximo é de 100%'
      },
      valor: {
        required: 'O Valor é requerido..',
        minlength: 'O Valor precisa ter no mínimo 2 caracteres',
        maxlength: 'O Valor precisa ter no máximo 18 caracteres'
      },
      ano: {
        required: 'Ano requerido.',
        minlength: 'O Ano deve ter 4 caracteres!',
        maxlength: 'O Ano deve ter 4 caracteres!',
        max: 'Ano máximo é de ' + new Date().getFullYear(),
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contrSindPatNumeroAlunos = new ContrSindPatNumeroAlunos();
    this.swal = new SweetAlertAdviceService();
    this.datePipe = new DatePipe("en-US");
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.contrSindPatNumeroAlunosForm);
    });
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] === undefined) {
      this.contribuicaoSindicalPatronalId = 0;
    } else {
      this.contribuicaoSindicalPatronalId = this.route.snapshot.params['id'];
    }
    this.contrSindPatNumeroAlunosForm = this.fb.group({
      id: 0,
      numeroAlunosDe: ['', [Validators.required, Validators.maxLength(18)]],
      numeroAlunosAte: ['', [Validators.required, Validators.maxLength(18)]],
      percentual: ['', [Validators.required, Validators.maxLength(3), Validators.max(100)]],
      valor: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(18)]],
      ano: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.max(new Date().getFullYear())]],
      excluido: 'N'
    });

    this.contribuicaoSindicalPatronalService.obterTodosContrSindPatNumeroAlunos().subscribe(
      resultado => {
        this.listaContrSindPatNumeroAlunos = resultado;
      });
  }

  adicionarcontrSindPatNumeroAlunos() {

    if (this.contrSindPatNumeroAlunosForm.dirty && this.contrSindPatNumeroAlunosForm.valid) {
      const p = Object.assign({}, this.contrSindPatNumeroAluno, this.contrSindPatNumeroAlunosForm.getRawValue());

      this.contribuicaosindicalpatronalComponent.dirty = true;

      if (this.contribuicaoSindicalPatronalId > 0) {
        p.contribuicaoSindicalPatronalId = this.contribuicaoSindicalPatronalId;
        p.id = 0;
        // p.cbo = null; 
        this.contribuicaoSindicalPatronalService.adicionarContrSindPatNumeroAlunos(p)
          .subscribe(
            result => {
              if (result) {

                if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno == null) {
                  this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno = new Array();
                }

                this.contribuicaoSindicalPatronalService.obterTodosContrSindPatNumeroAlunosPorContribuicaoSindicalPatronalId(this.contribuicaoSindicalPatronalId.toString())
                  .subscribe(ContrSindPatNumeroAlunos => {
                  this.contrSindPatNumeroAluno = ContrSindPatNumeroAlunos

                    this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno = this.contrSindPatNumeroAluno;

                  });

                this.swal.showSwalSuccess('Número de alunos, Adicionado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            () => {
              this.errors;
            });
      } else {
        p.id = 0;
        if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.length > 0) {
          p.id = this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.length + 1;
        }
        for (let i = 0; this.listaContrSindPatNumeroAlunos.length > i; i++) {
          if (p.contribuicaoSindicalPatronalId == this.listaContrSindPatNumeroAlunos[i].id) {
            this.contrSindPatNumeroAlunos = this.listaContrSindPatNumeroAlunos[i];
          }
        }
        if (this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno == null) {
          this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno = new Array();
        }
        this.contribuicaosindicalpatronalComponent.contribuicaoSindicalPatronal.contrSindPatNumeroAluno.push(p);
        this.listcontrSindPatNumeroAlunos.contrSindPatNumeroAlunosGravado('Número de alunos, adicionado com sucesso!');
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