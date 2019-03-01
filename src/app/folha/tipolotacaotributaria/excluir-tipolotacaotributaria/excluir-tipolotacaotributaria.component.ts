import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoLotacaoTributaria, GrupoEmpresa, Empresa } from '../models/tipolotacaotributaria';
import { Subscription, Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipolotacaotributariaService } from '../tipolotacaotributaria.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-excluir-tipolotacaotributaria',
  templateUrl: './excluir-tipolotacaotributaria.component.html',
  styleUrls: []
})
export class ExcluirTipolotacaotributariaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipoLotacaoTributaria: TipoLotacaoTributaria;
  public tipoLotacaoTributariaForm: FormGroup;
  public tipoLotacaoTributariaId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoLotacaoTributariaService: TipolotacaotributariaService,
    private fb: FormBuilder,private router: Router,
    private route: ActivatedRoute) {

      this.validationMessages = {
         descricao: {
           required: 'Descrição requerida!',
           minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
           maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
         }
       };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.tipoLotacaoTributaria = new TipoLotacaoTributaria();
      this.swal = new SweetAlertAdviceService();
   }

  ngOnInit() {

    this.tipoLotacaoTributariaForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: [''],
      preenchimentoCampo:[''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.tipoLotacaoTributariaId = params['id'];
        this.ObterTipolotacaotributaria(this.tipoLotacaoTributariaId);
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

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTipolotacaotributaria();
      } else {
        self.cancelar();
      }
    });
  }

  ObterTipolotacaotributaria(id: string) {
    this.tipoLotacaoTributariaService.obterTipolotacaotributariaPorId(id)
      .subscribe(
        tipoLotacaoTributaria => this.preencherFormTipolotacaotributaria(tipoLotacaoTributaria),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormTipolotacaotributaria(tipoLotacaoTributaria: TipoLotacaoTributaria): void {
    this.tipoLotacaoTributaria = tipoLotacaoTributaria;

    this.reativarVisivel = this.tipoLotacaoTributaria.excluido === 'S';
    this.removerVisivel = this.tipoLotacaoTributaria.excluido === 'N';

    this.tipoLotacaoTributariaForm.patchValue({
      id: this.tipoLotacaoTributaria.id,
      guid: 1,
      grupoEmpresaId: this.tipoLotacaoTributaria.grupoEmpresaId,
      empresaId: this.tipoLotacaoTributaria.empresaId,
      codigo: this.tipoLotacaoTributaria.codigo,
      sigla: this.tipoLotacaoTributaria.sigla,
      descricao: this.tipoLotacaoTributaria.descricao,
      preenchimentoCampo: this.tipoLotacaoTributaria.preenchimentoCampo,
      excluido: this.tipoLotacaoTributaria.excluido
    });
  }

  removerTipolotacaotributaria() {
    this.tipoLotacaoTributariaService.removerTipolotacaotributaria(this.tipoLotacaoTributaria)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Tipos de Lotação Tributária, removido com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['tipolotacaotributaria/lista']);
        },
        () => {
        });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoLotacaoTributariaService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipolotacaotributaria/editar/' + this.tipoLotacaoTributariaId]);
  }

}
