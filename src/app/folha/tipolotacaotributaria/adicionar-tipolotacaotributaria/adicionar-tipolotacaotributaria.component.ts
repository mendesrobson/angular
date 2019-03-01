import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { TipolotacaotributariaService } from '../tipolotacaotributaria.service';
import { TipoLotacaoTributaria, GrupoEmpresa, Empresa } from '../models/tipolotacaotributaria';

@Component({
  selector: 'app-adicionar-tipolotacaotributaria',
  templateUrl: './adicionar-tipolotacaotributaria.component.html',
  styleUrls: []
})
export class AdicionarTipolotacaotributariaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoLotacaoTributaria: TipoLotacaoTributaria;
  public tipoLotacaoTributariaForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoLotacaoTributariaService: TipolotacaotributariaService,
    private fb: FormBuilder, private router: Router) {

    this.validationMessages = {
      descricao: {
        required: 'Descrição requerida!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
        maxlength: 'A Descrição deve ter no máximo 500 caracteres!'
      },
      preenchimentoCampo: {
        maxlength: 'O campo Requer Preenchimento do Campo deve ter no máximo 100 caracteres!'
      },

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoLotacaoTributaria = new TipoLotacaoTributaria();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.tipoLotacaoTributariaForm = this.fb.group({
      id: 0,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      preenchimentoCampo:[''],
      excluido: 'N'
    });

    this.tipoLotacaoTributariaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);

    }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoLotacaoTributariaForm);
    });
  }

  adicionarTipolotacaotributaria() {
    if (this.tipoLotacaoTributariaForm.dirty && this.tipoLotacaoTributariaForm.valid) {
      let p = Object.assign({}, this.tipoLotacaoTributaria, this.tipoLotacaoTributariaForm.value);
      this.tipoLotacaoTributariaService.adicionarTipolotacaotributaria(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Tipos de Lotação Tributária, adicionado com sucesso!');
              this.router.navigate(['tipolotacaotributaria/lista']);
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
    this.router.navigate(['tipolotacaotributaria/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoLotacaoTributariaService.obterTodosEmpresa(idGrupo)
      .subscribe(resultado => {
        this.empresas = resultado;
      },
        () => this.errors);
  }
}

