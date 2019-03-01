import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { TipoBeneficio } from '../models/tipobeneficio';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoBeneficioService } from '../tipobeneficio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-excluir-tipobeneficio',
  templateUrl: './excluir-tipobeneficio.component.html',
  styleUrls: []
})

export class ExcluirTipoBeneficioComponent implements OnInit, AfterViewInit {

  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public tipoBeneficio: TipoBeneficio;
  public tipoBeneficioForm: FormGroup;
  public tipoBeneficioId: string = "";

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private tipoBeneficioService: TipoBeneficioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

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

  ngOnInit() {
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
        error => this.errors);

    this.tipoBeneficioService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

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

    this.sub = this.route.params.subscribe(
      params => {
        this.tipoBeneficioId = params['id'];
        this.obterTipoBeneficio(this.tipoBeneficioId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTipoBeneficio();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterTipoBeneficio(id: string) {
    this.tipoBeneficioService.obterTipoBeneficio(id)
      .subscribe(
        tipoBeneficio => this.preencherFormTipoBeneficio(tipoBeneficio),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormTipoBeneficio(tipoBeneficio: TipoBeneficio): void {
    this.tipoBeneficio = tipoBeneficio;

    this.reativarVisivel = this.tipoBeneficio.excluido === 'S';
    this.removerVisivel = this.tipoBeneficio.excluido === 'N';

    this.tipoBeneficioForm.patchValue({
      id: this.tipoBeneficio.id,
      grupoEmpresaId: this.tipoBeneficio.grupoEmpresaId,
      empresaId: this.tipoBeneficio.empresaId,
      codigo: this.tipoBeneficio.codigo,
      sigla: this.tipoBeneficio.sigla,
      descricao: this.tipoBeneficio.descricao,
      tipo: this.tipoBeneficio.tipo,
      diasTrabalhados: this.tipoBeneficio.diasTrabalhados,
      descontaDiasFerias: this.tipoBeneficio.descontaDiasFerias, 
      descontaDiasAfastamento: this.tipoBeneficio.descontaDiasAfastamento,
      aliquotaDesconto: this.tipoBeneficio.aliquotaDesconto,
      valor: this.tipoBeneficio.valor,
      excluido: this.tipoBeneficio.excluido
    });

  }
  removerTipoBeneficio() {
    this.tipoBeneficioService.removerTipoBeneficio(this.tipoBeneficio)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Tipo de Benefício Removido com Sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['tipobeneficio/lista']);
        },
        error => {
          console.error(error)
        });
  }

  cancelar() {
    this.router.navigate(['tipobeneficio/editar/' + this.tipoBeneficioId]);
  }
}



