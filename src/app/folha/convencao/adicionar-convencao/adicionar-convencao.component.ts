import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { Convencao, TipoConvencao } from '../models/convencao';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { ConvencaoService } from '../convencao.service';

@Component({
  selector: 'app-adicionar-convencao',
  templateUrl: './adicionar-convencao.component.html',
  styleUrls: []
})
export class AdicionarConvencaoComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public convencao: Convencao;
  public convencaoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];
  public tipoConvencao: TipoConvencao[];

  constructor(
    private convencaoService: ConvencaoService,
    private fb: FormBuilder, private router: Router) {

    this.validationMessages = {
      codigo: {
        required: 'Código requerido!',
        maxlength: 'O código deve ter no Máximo 5 caracteres!'
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
      //guid: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      tipoConvencao: ['', [Validators.required]],
      observacao: [''],
      excluido: 'N'
    });

    this.convencaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);


    // this.convencaoService.getTipoConvencao()
    // .subscribe(resultado => {
    //   this.tipoConvencao = resultado;
    // },
    //   () => this.errors);
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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.convencaoForm);
    });
  }

  adicionarConvencao() {
    if (this.convencaoForm.dirty && this.convencaoForm.valid) {
      let p = Object.assign({}, this.convencao, this.convencaoForm.value);
      console.log(p);
      this.convencaoService.adicionarConvencao(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Convenção adicionado com sucesso!');
              this.router.navigate(['convencao/lista']);
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
    this.router.navigate(['convencao/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.convencaoService.obterTodosEmpresa(idGrupo)
      .subscribe(resultado => {
        this.empresas = resultado;
      },
        () => this.errors);
  }
}

