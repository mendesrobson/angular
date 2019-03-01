import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { ParteCorpoAtingida } from '../models/partecorpoatingida';
import { PartecorpoatingidaService } from './../partecorpoatingida.service';


@Component({
  selector: 'app-adicionar-partecorpoatingida',
  templateUrl: './adicionar-partecorpoatingida.component.html',
  styleUrls: []
})
export class AdicionarPartecorpoatingidaComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public parteCorpoAtingida: ParteCorpoAtingida;
  public parteCorpoAtingidaForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private parteCorpoAtingidaService: PartecorpoatingidaService,
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
    this.parteCorpoAtingida = new ParteCorpoAtingida();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.parteCorpoAtingidaForm = this.fb.group({
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

    this.parteCorpoAtingidaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.parteCorpoAtingidaForm);
    });
  }

  adicionarParteCorpoAtingida() {
    if (this.parteCorpoAtingidaForm.dirty && this.parteCorpoAtingidaForm.valid) {
      let p = Object.assign({}, this.parteCorpoAtingida, this.parteCorpoAtingidaForm.value);
      this.parteCorpoAtingidaService.adicionarParteCorpoAtingida(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Parte Corpo Atiginda, adicionado com sucesso!');
              this.router.navigate(['partecorpoatingida/lista']);
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
    this.router.navigate(['partecorpoatingida/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.parteCorpoAtingidaService.obterTodosEmpresa(idGrupo)
      .subscribe(resultado => {
        this.empresas = resultado;
      },
        () => this.errors);
  }

}