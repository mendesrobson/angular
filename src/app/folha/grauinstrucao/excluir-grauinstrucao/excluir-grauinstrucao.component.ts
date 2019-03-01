import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrauInstrucao } from '../models/grauinstrucao';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrauInstrucaoService } from '../grauinstrucao.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-excluir-grauinstrucao',
  templateUrl: './excluir-grauinstrucao.component.html',
  styleUrls: []
})

export class ExcluirGrauInstrucaoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel = false;
  public reativarVisivel = false;
  displayMessage: { [key: string]: string } = {};

  private result = {};
  public grauInstrucao: GrauInstrucao;
  public grauInstrucaoForm: FormGroup;
  public grauInstrucaoId = "";
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
      codigoEsocial: {
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

    this.sub = this.route.params.subscribe(
      params => {
        this.grauInstrucaoId = params['id'];
        this.obterGrauInstrucao(this.grauInstrucaoId);
      });


  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerGrauInstrucao();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterGrauInstrucao(id: string) {
    this.grauInstrucaoService.obterGrauInstrucao(id)
      .subscribe(
        grauInstrucao => this.preencherFormGrauInstrucao(grauInstrucao),
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

  removerGrauInstrucao() {
    this.grauInstrucaoService.removerGrauInstrucao(this.grauInstrucao)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Grau Instrução Removido com Sucesso');
          this.router.navigate(['grauinstrucao/lista']);
        },
        error => {
          console.error(error);
        });
  }

  cancelar() {
    this.router.navigate(['grauinstrucao/editar/' + this.grauInstrucaoId]);
  }

}
