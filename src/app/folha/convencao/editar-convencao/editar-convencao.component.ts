import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Convencao, TipoConvencao } from '../models/convencao';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ConvencaoService } from '../convencao.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-convencao',
  templateUrl: './editar-convencao.component.html',
  styleUrls: []
})
export class EditarConvencaoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public convencao: Convencao;
  public convencaoForm: FormGroup;
  public convencaoId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public tipoConvencao: TipoConvencao[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private convencaoService: ConvencaoService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigo: {
        required: 'Código requerido!',
        maxlength: 'O código deve ter no Máximo 4 caracteres!'
      },
      descricao: {
        required: 'Descrição requerida!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
        maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
      },
      tipoConvencao: {
        required: 'Tipo Covenção requerida!',
        minlength: 'Tipo Covenção deve ter no mínimo 3 caracteres!',
        maxlength: 'Tipo Covenção deve ter no máximo 100 caracteres!'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.convencao = new Convencao();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.convencaoForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      tipoConvencao: ['', [Validators.required]],
      observacao: [''],
      excluido: 'N'
    });
    this.sub = this.route.params.subscribe(
      params => {
        this.convencaoId = params['id'];
        this.ObterTipoDeAdmissao(this.convencaoId);
      });

    this.convencaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);


    // this.convencaoService.getTipoConvencao()
    //   .subscribe(resultado => {
    //     this.tipoConvencao = resultado;
    //   },
    //     () => this.errors);
    this.tipoConvencao = [
      {
        "id": "",
        "descricao": ""
      },
      {
        "id": "AC",
        "descricao": "Acordo"
      },
      {
        "id": "CO",
        "descricao": "Convenção"
      }
    ];
  }

  ObterTipoDeAdmissao(id: string) {
    this.convencaoService.obterConvencao(id)
      .subscribe(
        resultado => this.preencherFormConvencao(resultado),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormConvencao(convencao: Convencao): void {
    this.convencao = convencao;

    this.reativarVisivel = this.convencao.excluido === 'S';
    this.removerVisivel = this.convencao.excluido === 'N';
    !this.removerVisivel ? this.convencaoForm.disable() : this.convencaoForm.enable();

    this.convencaoForm.patchValue({
      id: this.convencao.id,
      guid: 1,
      grupoEmpresaId: this.convencao.grupoEmpresaId,
      empresaId: this.convencao.empresaId,
      codigo: this.convencao.codigo,
      sigla: this.convencao.sigla,
      descricao: this.convencao.descricao,
      tipoConvencao: this.convencao.tipoConvencao,
      observacao: this.convencao.observacao,
      excluido: this.convencao.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.convencaoForm);
    });
  }

  editarConvencao() {
    if (this.convencaoForm.dirty && this.convencaoForm.valid) {
      const p = Object.assign({}, this.convencao, this.convencaoForm.value);

      this.convencaoService.atualizarConvencao(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Tipo de Deficiência atualizado com sucesso!');
              this.router.navigate(['convencao/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.convencaoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['convencao/lista']);
  }

  remover(id) {
    this.router.navigate(['convencao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['convencao/reativar/' + id]);
  }

}