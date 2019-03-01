import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';

import * as _ from 'lodash';
import { MaskService } from '../../../services/mask.service';
import { TestemunhaService } from '../testemunha.service';
import { Uf, Testemunha } from '../models/testemunha';
import { FormGroup, Validators, FormBuilder, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-testemunha',
  templateUrl: './editar-testemunha.component.html',
  styleUrls: [],
  providers: [MaskService]
})

export class EditarTestemunhaComponent implements OnInit, AfterViewInit {
  ufs: Uf[];
  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  cpfMask = this.maskService.Cpf();
  rgMask = this.maskService.Rg();

  //cpfPattern = "^[0-9]+.[0-9]+.[0-9]+-[0-9]{2,11}$";
  cpfPattern = this.maskService.cpfPattern;


  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public testemunha: Testemunha;
  public testemunhaForm: FormGroup;
  public testemunhaId: string = "";

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;

  private result = {};
  public errors: any[] = [];

  constructor(
    private maskService: MaskService,
    private testemunhaService: TestemunhaService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      nome: {
        required: 'O Nome é requerido.',
        minlength: 'O Nome precisa ter no mínimo 3 caracteres',
        maxlength: 'O Nome precisa ter no máximo 120 caracteres'
      },
      cpf: {
        required: 'O CPF é requerido.',
        minlength: 'O CPF precisa ter no mínimo 11 caracteres',
        maxlength: 'O CPF precisa ter no máximo 11 caracteres',
        pattern: 'Formato de CPF inválido'
      },
      rg: {
        required: 'O RG é requerido'
      },
      orgaoEmissor: {
        required: 'O Órgão Emissor é requerido',
        minlength: 'O Orgão Emissor precisa ter no mínimo 2 caracteres',
        maxlength: 'O Orgão Emissor precisa ter no máximo 5 caracteres'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      ufId: {
        required: 'Informe a UF'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.testemunha = new Testemunha();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.testemunhaForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      nome: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120)]],
      cpf: ['', [Validators.required,
      Validators.minLength(14),
      Validators.maxLength(14),
      Validators.pattern(this.cpfPattern)]],
      rg: ['', [Validators.required]],
      orgaoEmissor: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(5)]],
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]],
      ufId: ['', [Validators.required]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.testemunhaId = params['id'];
        this.obterTestemunha(this.testemunhaId);
      });

    this.testemunhaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.testemunhaService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

    this.testemunhaService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs
      },
      error => this.errors);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.testemunhaForm);
    });
  }


  obterTestemunha(id: string) {
    this.testemunhaService.obterTestemunha(id)
      .subscribe(
      testemunha => this.preencherFormTestemunha(testemunha),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormTestemunha(testemunha: Testemunha): void {

    this.testemunha = testemunha;

    this.reativarVisivel = this.testemunha.excluido === 'S';
    this.removerVisivel = this.testemunha.excluido === 'N';

    this.testemunhaForm.controls['codigo'].disable();

    this.testemunhaForm.patchValue({
      codigo: this.testemunha.codigo,
      nome: this.testemunha.nome,
      cpf: this.testemunha.cpf,
      rg: this.testemunha.rg,
      orgaoEmissor: this.testemunha.orgaoEmissor,
      empresaId: this.testemunha.empresaId,
      grupoEmpresaId: this.testemunha.grupoEmpresaId,
      ufId: this.testemunha.ufId
    });
  }

  editarTestemunha() {
    if (this.testemunhaForm.dirty && this.testemunhaForm.valid) {
      let p = Object.assign({}, this.testemunha, this.testemunhaForm.value);

      this.testemunhaService.atualizarTestemunha(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Testemunha Atualizada com Sucesso');
          this.router.navigate(['testemunha/lista']);
        },
        error => {
          this.errors;
        })
    }
  }




  cancelar() {
    this.router.navigate(['testemunha/lista']);
  }

  remover(id) {
    this.router.navigate(['testemunha/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['testemunha/reativar/' + id]);
  }




}