import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { TipoBeneficio, Tipo } from '../models/tipobeneficio';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoBeneficioService } from '../tipobeneficio.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-adicionar-tipobeneficio',
  templateUrl: './adicionar-tipobeneficio.component.html',
  styleUrls: []
})

export class AdicionarTipoBeneficioComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoBeneficio: TipoBeneficio;
  public tipoBeneficioForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipo: Tipo[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoBeneficioService: TipoBeneficioService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      grupoEmpresaId: {
        required: 'Grupo é requerido.'
      },
      empresaId: {
        required: 'Empresa é requerida.'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      tipo: {
        required: 'O Tipo é requerido.'
      },
      diasTrabalhados: {
        required: 'Dias Trabalhados é requerido.'
      },
      descontaDiasFerias: {
        required: 'Desconto Dias de Férias é requerido.'
      },
      descontaDiasAfastamento: {
        required: 'Desconta Dias de Afastamento é requerido.'
      },
      aliquotaDesconto: {
        required: 'Alíquota de Desconto é requerido.'
      },
      valor: {
        required: 'O Valor é requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoBeneficio = new TipoBeneficio();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.tipoBeneficioForm = this.fb.group({
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: '',
      sigla: '',
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      tipo: 'M',
      diasTrabalhados: 'N',
      descontaDiasFerias: 'N',
      descontaDiasAfastamento: 'N',
      excluido: 'N',
      aliquotaDesconto: 0,
      valor: 0
    });

    this.tipoBeneficioService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors);

    this.tipoBeneficioService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);


    // this.tipoBeneficioService.getTipo()
    //   .subscribe(tipo => {
    //     this.tipo = tipo

    //   },
    //     () => this.errors);
    this.tipo = [{
      "id": "M",
      "valor": "Mensal"
    },
    {
      "id": "F",
      "valor": "Fixo"
    }];
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoBeneficioForm);
    });
  }

  adicionarTipoBeneficio() {
    if (this.tipoBeneficioForm.dirty && this.tipoBeneficioForm.valid) {
      let p = Object.assign({}, this.tipoBeneficio, this.tipoBeneficioForm.getRawValue());

      this.tipoBeneficioService.adicionarTipoBeneficio(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Tipo de Benefício Adicionado com Sucesso!');
              this.router.navigate(['tipobeneficio/lista']);
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
    this.router.navigate(['tipobeneficio/lista']);
  }

}

