import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Parentesco } from '../models/Parentesco';
import { ParentescoService } from '../parentesco.service';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-excluir-parentesco',
  templateUrl: './excluir-parentesco.component.html',
  styleUrls: []
})
export class ExcluirParentescoComponent implements OnInit, AfterViewInit {


  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public parentesco: Parentesco;
  public parentescoForm: FormGroup;
  public parentescoId: "";
  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private parentescoService: ParentescoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.validationMessages = {
      codigoEsocial: {
        required: 'Código E-Social requerida.'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      elegivelSalarioFamilia: {
        required: 'Elegível Salário Família requerida.'
      },
      idadeLimiteSalarioFamilia: {
        required: 'Limite Salario Familia requerida.'
      },
      dependenteIR: {
        required: 'Dependente IR requerida.'
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.parentesco = new Parentesco();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.parentescoForm = this.fb.group({
      id: 0,
      codigo: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      idadeLimiteSalarioFamilia: ['', [Validators.required]],
      idadeLimiteSalarioFamiliaDef: '',
      idadeLimiteDeficienteIR: '',
      codigoEsocial: '',
      elegivelSalarioFamilia: ['N', [Validators.required]],
      dependenteIR: ['N', [Validators.required]],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.parentescoId = params['id'];
        this.obterParentesco(this.parentescoId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerParentesco();
      }
      else {
        self.cancelar();
      }
    });
  }


  obterParentesco(id: string) {
    this.parentescoService.obterParentesco(id)
      .subscribe(
        parentesco => this.preencherFormParentesco(parentesco),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormParentesco(parentesco: Parentesco): void {
    this.parentesco = parentesco;

    this.reativarVisivel = this.parentesco.excluido === 'S';
    this.removerVisivel = this.parentesco.excluido === 'N';

    this.parentescoForm.patchValue({
      id: this.parentesco.id,
      codigo: this.parentesco.codigo,
      sigla: this.parentesco.sigla,
      descricao: this.parentesco.descricao,
      codigoEsocial: this.parentesco.codigoEsocial,
      idadeLimiteSalarioFamilia: this.parentesco.idadeLimiteSalarioFamilia,
      idadeLimiteSalarioFamiliaDef: this.parentesco.idadeLimiteSalarioFamiliaDef,
      idadeLimiteDeficienteIR: this.parentesco.idadeLimiteDeficienteIR,      
      elegivelSalarioFamilia: this.parentesco.elegivelSalarioFamilia,
      dependenteIR: this.parentesco.dependenteIR,
      excluido: this.parentesco.excluido
    });
  }

  removerParentesco() {   
    this.parentescoService.removerParentesco(this.parentesco)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Parentesco Removido com Sucesso!');            
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');            
          }
          this.router.navigate(['parentesco/lista']);
        },
        error => {
          console.error(error)
        });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['parentesco/editar/' + this.parentescoId]);
  }

}
