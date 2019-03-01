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
  selector: 'app-editar-parentesco',
  templateUrl: './editar-parentesco.component.html',
  styleUrls: []
})
export class EditarParentescoComponent implements OnInit, AfterViewInit {
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
      codigo:{
        required: 'Código requerido!'
      },
      sigla:{
        required: 'Sigla requerida!'
      },
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
      idadeLimiteSalarioFamiliaDef:{
        required: 'Idade limite Salário Família Deficiênte requerido!'
      },
      idadeLimiteSalarioFamilia: {
        required: 'Idade Limite Salário Família requerida.'
      },
      idadeLimiteDeficienteIR:{
        required: 'Idade Limite Deficiênte IR requerida!'
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
      idadeLimiteSalarioFamiliaDef: ['', [Validators.required]],      
      idadeLimiteDeficienteIR: ['', [Validators.required]],
      codigoEsocial: ['', [Validators.required]],
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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.parentescoForm);
    });
  }

  editarParentesco() {
    if (this.parentescoForm.dirty && this.parentescoForm.valid) {
      const p = Object.assign({}, this.parentesco, this.parentescoForm.value);

      this.parentescoService.atualizarParentesco(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Parentesco Atualizado com Sucesso!');
                this.router.navigate(['parentesco/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

        },
        error => {
            console.error(error)
        })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['parentesco/lista']);
  }

  remover(id) {
    this.router.navigate(['parentesco/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['parentesco/reativar/' + id]);
  }

}
