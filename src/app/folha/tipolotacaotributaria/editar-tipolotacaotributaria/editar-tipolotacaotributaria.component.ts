import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { TipoLotacaoTributaria, GrupoEmpresa, Empresa } from '../models/tipolotacaotributaria';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { TipolotacaotributariaService } from '../tipolotacaotributaria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-tipolotacaotributaria',
  templateUrl: './editar-tipolotacaotributaria.component.html',
  styleUrls: []
})
export class EditarTipolotacaotributariaComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipoLotacaoTributaria: TipoLotacaoTributaria;
  public tipoLotacaoTributariaForm: FormGroup;
  public tipoLotacaoTributariaId: "";
  public displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoLotacaoTributariaService: TipolotacaotributariaService,
    private fb: FormBuilder, private router: Router,
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
      descricao: ['', [Validators.required]],
      preenchimentoCampo:[''],
      excluido: 'N'
    });
    this.sub = this.route.params.subscribe(
      params => {
        this.tipoLotacaoTributariaId = params['id'];
        this.ObterTipoDeAdmissao(this.tipoLotacaoTributariaId);
      });

    this.tipoLotacaoTributariaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }
  
  ObterTipoDeAdmissao(id: string) {
    this.tipoLotacaoTributariaService.obterTipolotacaotributariaPorId(id)
      .subscribe(
        resultado => this.preencherFormTipolotacaotributaria(resultado),
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
    !this.removerVisivel ? this.tipoLotacaoTributariaForm.disable() : this.tipoLotacaoTributariaForm.enable();

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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoLotacaoTributariaForm);
    });
  }

  editartipoLotacaoTributaria() {
    if (this.tipoLotacaoTributariaForm.dirty && this.tipoLotacaoTributariaForm.valid) {
      const p = Object.assign({}, this.tipoLotacaoTributaria, this.tipoLotacaoTributariaForm.value);

      this.tipoLotacaoTributariaService.atualizarTipolotacaotributaria(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Tipos de Lotação Tributária atualizado com sucesso!');
              this.router.navigate(['tipolotacaotributaria/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
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
    this.router.navigate(['tipolotacaotributaria/lista']);
  }

  remover(id) {
    this.router.navigate(['tipolotacaotributaria/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['tipolotacaotributaria/reativar/' + id]);
  }

}