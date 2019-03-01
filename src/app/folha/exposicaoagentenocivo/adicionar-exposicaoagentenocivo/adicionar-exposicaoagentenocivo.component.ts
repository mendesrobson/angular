import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { ExposicaoAgenteNocivo } from '../models/exposicaoAgenteNocivo';
import { ExposicaoagentenocivoService } from '../exposicaoagentenocivo.service';

@Component({
  selector: 'app-adicionar-exposicaoagentenocivo',
  templateUrl: './adicionar-exposicaoagentenocivo.component.html',
  styleUrls: []
})
export class AdicionarExposicaoagentenocivoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public exposicaoAgenteNocivo: ExposicaoAgenteNocivo;
  public exposicaoAgenteNocivoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private exposicaoAgenteNocivoService: ExposicaoagentenocivoService,
    private fb: FormBuilder, private router: Router) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
        maxlength: 'A Sigla precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.exposicaoAgenteNocivo = new ExposicaoAgenteNocivo();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.exposicaoAgenteNocivoForm = this.fb.group({
      id: 0,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      excluido: 'N'
    });

    this.exposicaoAgenteNocivoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.exposicaoAgenteNocivoForm);
    });
  }

  adicionarExposicaoAgenteNocivo() {
    if (this.exposicaoAgenteNocivoForm.dirty && this.exposicaoAgenteNocivoForm.valid) {
      let p = Object.assign({}, this.exposicaoAgenteNocivo, this.exposicaoAgenteNocivoForm.value);
      this.exposicaoAgenteNocivoService.adicionarExposicaoAgenteNocivo(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Exposição Agente Nocivo adicionado com sucesso!');
              this.router.navigate(['exposicaoagentenocivo/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { });
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['exposicaoagentenocivo/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.exposicaoAgenteNocivoService.obterTodosEmpresa(idGrupo)
      .subscribe(resultado => {
        this.empresas = resultado;
      },
        () => this.errors);
  }
  
}