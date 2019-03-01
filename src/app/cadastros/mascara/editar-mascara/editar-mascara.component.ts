import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Mascara, SeparadorNivel, GravaOrAdiciona, Tarefa } from '../models/mascara';
import { MascaraService } from '../mascara.service';
import { Subscription } from 'rxjs';
import { MaskService } from '../../../services/mask.service';
import { MascaraComponent } from '../mascara.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-mascara',
  templateUrl: './editar-mascara.component.html',
  styleUrls: []
})

export class EditarMascaraComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public mascara: Mascara;
  public mascaraForm: FormGroup;
  public mascaraId: string = "";

  swal: SweetAlertAdviceService;
  temCodigoMascara: Boolean;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tarefas: Tarefa[];
  public separadorNivel: SeparadorNivel[];
  public gravaOrAdiciona: GravaOrAdiciona[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;
  public sub: Subscription;

  public errors: any[] = [];

  public listMask = [];
  public listMascaraFormatada = [{ id: null, mascaraformatada: null, mascaraexpression: null }];
  public mascaraNivel = [];

  constructor(private mascaraService: MascaraService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mascaraComponent: MascaraComponent
  ) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla:{
        maxlength: 'A sigla deve ter no máximo 10 caracteres!'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      prefixo:{
        maxlength: 'O Prefixo deve ter no máximo 4 caracteres!'
      },
      sufixo:{
        maxlength: 'O Sufixo deve ter no máximo 4 caracteres!'
      },
      tarefaId: {
        required: 'Informe a Tarefa'
      },
      separadorNiveis: {
        required: 'Informe o Separador'
      },
      quantidadeNiveis: {
        required: 'Informe a Quantidade de Níveis'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.mascara = new Mascara();
    this.swal = new SweetAlertAdviceService();
    console.log("EditarMascaraComponent");
  }

  ngOnInit(): void {
    this.mascaraForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      tarefaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      prefixo: ['', Validators.maxLength(4)],
      sufixo: ['', Validators.maxLength(4)],
      separadorNiveis: [],
      quantidadeNiveis: [],
      siglaAdicionaGrava: [],
      sequencial: 'N',
      mascaraFormatada: [],
      mascaraExpression: [],
      excluido: 'N'
    });

    this.mascaraForm.controls['grupoEmpresaId'].disable();
    this.mascaraForm.controls['empresaId'].disable();
    this.mascaraForm.controls['tarefaId'].disable();

    this.sub = this.route.params.subscribe(
      params => {
        this.mascaraId = params['id'];
        this.obterMascaraPorId(this.mascaraId);
      });

    this.mascaraService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.mascaraService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.mascaraService.obterTodosTarefa()
      .subscribe(tarefas => {
        this.tarefas = tarefas
      },
        error => this.errors);

    // this.mascaraService.getSeparadorNivel()
    //   .subscribe(separadorNivel => {
    //     this.separadorNivel = separadorNivel
    //   },
    //     error => this.errors);
    this.separadorNivel = [
      {
        "id": "-",
        "valor": "-"
      },
      {
        "id": ",",
        "valor": ","
      },
      {
        "id": ".",
        "valor": "."
      },
      {
        "id": "/",
        "valor": "/"
      },
      {
        "id": ":",
        "valor": ":"
      },
      {
        "id": "\\",
        "valor": "\\"
      },
      {
        "id": "=",
        "valor": "="
      },
      {
        "id": ">",
        "valor": ">"
      }
    ];

    // this.mascaraService.getGravaOrAdiciona()
    //   .subscribe(gravaOrAdiciona => {
    //     this.gravaOrAdiciona = gravaOrAdiciona
    //   },
    //     error => this.errors);
    this.gravaOrAdiciona = [
      {
        "id": "GRAVA",
        "valor": "Ao Gravar"
      },
      {
        "id": "MOVI",
        "valor": "Ao Adicionar um Movimento"
      }
    ];


  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.mascaraForm);
    });
  }

  preencherFormMascara(mascara: Mascara): void {
    this.mascara = mascara;

    this.reativarVisivel = this.mascara.excluido === 'S';
    this.removerVisivel = this.mascara.excluido === 'N';

    this.mascaraForm.patchValue({
      id: this.mascara.id,
      grupoEmpresaId: this.mascara.grupoEmpresaId,
      empresaId: this.mascara.empresaId,
      tarefaId: this.mascara.tarefaId,
      codigo: this.mascara.codigo,
      sigla: this.mascara.sigla,
      descricao: this.mascara.descricao,
      prefixo: this.mascara.prefixo,
      sufixo: this.mascara.sufixo,
      separadorNiveis: this.mascara.separadorNiveis,
      quantidadeNiveis: this.mascara.quantidadeNiveis,
      siglaAdicionaGrava: this.mascara.siglaAdicionaGrava,
      sequencial: this.mascara.sequencial,
      mascaraFormatada: this.mascara.mascaraFormatada,
      mascaraExpression: this.mascara.mascaraExpression,
      excluido: this.mascara.excluido
    });

    this.gerarMascara();
  }

  obterMascaraPorId(id: string) {
    this.mascaraService.obterMascaraPorId(id)
      .subscribe(
        mascara => this.preencherFormMascara(mascara),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  editarMascara() {
    if (this.mascaraForm.valid) {

      let p = Object.assign({}, this.mascara, this.mascaraForm.value);

      this.mascaraService.AtualizarMascara(p).subscribe(
        result => {
          this.swal.showSwalSuccess('Mascara Atualizado com Sucesso!');
          this.router.navigate(['mascara/lista']);
        },
        error => {
          this.onError(error)
        })
    }
  }

  getMask(event) {
    var code = "9";
    var maskString = "";
    var mascaraFormatada = "";
    var separador = "";
    var pref = "";
    var suf = "";
    var mFor = "";

    this.listMascaraFormatada = [];
    separador = this.mascaraForm.controls['separadorNiveis'].value;
    pref = this.mascaraForm.controls['prefixo'].value;
    suf = this.mascaraForm.controls['sufixo'].value;

    for (var i = 0; i < this.listMask.length; i++) {
      if (this.listMask[i].id == event.target.id) {
        this.listMask[i].valor = event.target.value;
        this.listMask[i].mascara.length = event.target.value;

        if (this.listMask[i].mascara.length > 0) {
          for (var z = 0; z < event.target.value; z++) {
            maskString += code;
          }
          this.listMask[i].mascaraformatada = maskString + separador;
          this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada, mascaraexpression: this.listMask[i].mascaraexpression });
        }
      }

      if (this.listMask[i].mascaraformatada != null) {
        mascaraFormatada += this.listMask[i].mascaraformatada;
      }
    }

    for (var i = 0; i < this.mascara.mascaraNivel.length; i++) {
      if (this.mascara.mascaraNivel[i].id == event.target.id) {
        this.mascara.mascaraNivel[i].quantidadeNivel = event.target.value;
      }
    }

    if (pref == null) { pref = '' }
    if (suf == null) { suf = '' }

    if (pref != '') {
      if (suf != '') {
        mFor = pref + separador + mascaraFormatada.substr(0, mascaraFormatada.length - 1) + separador + suf
      } else {
        mFor = pref + separador + mascaraFormatada.substr(0, mascaraFormatada.length - 1)
      }
    } else {
      if (suf != '') {
        mFor = mascaraFormatada.substr(0, mascaraFormatada.length - 1) + separador + suf
      } else {
        mFor = mascaraFormatada.substr(0, mascaraFormatada.length - 1)
      }
    }

    this.mascaraForm.controls['mascaraFormatada'].patchValue(mFor);
  }

  getMaskExp(event) {
    var code = "/\\d/, ";
    var maskString = "";
    var mascaraExpression = "";
    var separador = "";
    var pref = "";
    var suf = "";
    var mExp = "";

    this.listMascaraFormatada = [];
    separador = this.mascaraForm.controls['separadorNiveis'].value;
    pref = this.mascaraForm.controls['prefixo'].value;
    suf = this.mascaraForm.controls['sufixo'].value;

    for (var i = 0; i < this.listMask.length; i++) {
      if (this.listMask[i].id == event.target.id) {
        this.listMask[i].valor = event.target.value;
        this.listMask[i].mascara.length = event.target.value;

        if (this.listMask[i].mascara.length > 0) {
          for (var z = 0; z < event.target.value; z++) {
            maskString += code;
          }
          this.listMask[i].mascaraexpression = maskString + "'" + separador + "', ";
          this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada, mascaraexpression: this.listMask[i].mascaraexpression });
        }
      }

      if (this.listMask[i].mascaraexpression != null) {
        mascaraExpression += this.listMask[i].mascaraexpression;
      }
    }

    mExp = mascaraExpression.substr(0, mascaraExpression.length - 7);
    if (pref == null) { pref = '' }
    if (suf == null) { suf = '' }

    if (pref != '') {
      if (suf != '') {
        mExp = "'" + pref + "'" + ", '" + separador + "', " + mExp + ", '" + separador + "', " + "'" + suf + "'"
      } else {
        mExp = "'" + pref + "'" + ", '" + separador + "', " + mExp
      }
    } else {
      if (suf != '') {
        mExp = mExp + ", '" + separador + "', " + "'" + suf + "'"
      } else {
        mExp = mExp
      }
    }

    mExp = "[" + mExp + "]";
    this.mascaraForm.controls['mascaraExpression'].patchValue(mExp);
  }

  getSequencia(event) {
    for (var i = 0; i < this.mascara.mascaraNivel.length; i++) {
      if (this.mascara.mascaraNivel[i].id == event.target.id) {
        this.mascara.mascaraNivel[i].sequencia = event.target.value;
      }
    }
  }

  gerarMascara() {
    var maskFormatada = "";
    var maskExpression = "";
    var separador = "";
    separador = this.mascaraForm.controls['separadorNiveis'].value;
    for (var i = 0; i < this.mascara.mascaraNivel.length; i++) {
      this.listMask.push({ id: this.mascara.mascaraNivel[i].id, valor: this.mascara.mascaraNivel[i].quantidadeNivel, mascara: [], mascaraformatada: null })
    }

    for (var i = 0; i < this.listMask.length; i++) {
      this.listMask[i].mascara.length = this.listMask[i].valor;
      maskFormatada = "";
      maskExpression = "";
      if (this.listMask[i].mascara.length > 0) {
        for (var z = 0; z < this.listMask[i].mascara.length; z++) {
          maskFormatada += "9";
          maskExpression += "/\\d/, ";
        }
        this.listMask[i].mascaraformatada = maskFormatada + separador;
        this.listMask[i].mascaraexpression = maskExpression + "'" + separador + "', ";
        this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada, mascaraexpression: this.listMask[i].mascaraexpression });
      }
    }
  }


  gerarMascaraAlt() {
    var maskFormatada = "";
    var maskExpression = "";
    var separador = "";
    var mascaraFormatada = "";
    var mascaraExpression = "";
    var mFor = "";
    var mExp = "";
    var pref = "";
    var suf = "";
    separador = this.mascaraForm.controls['separadorNiveis'].value;
    pref = this.mascaraForm.controls['prefixo'].value;
    suf = this.mascaraForm.controls['sufixo'].value;

    for (var i = 0; i < this.listMask.length; i++) {
      this.listMask[i].mascara.length = this.listMask[i].valor;
      maskFormatada = "";
      maskExpression = "";
      if (this.listMask[i].mascara.length > 0) {
        for (var z = 0; z < this.listMask[i].mascara.length; z++) {
          maskFormatada += "9";
          maskExpression += "/\\d/, ";
        }
        this.listMask[i].mascaraformatada = maskFormatada + separador;
        this.listMask[i].mascaraexpression = maskExpression + "'" + separador + "', ";
        this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada, mascaraexpression: this.listMask[i].mascaraexpression });
      }

      if (this.listMask[i].mascaraexpression != null) {
        mascaraExpression += this.listMask[i].mascaraexpression;
      }

      if (this.listMask[i].mascaraformatada != null) {
        mascaraFormatada += this.listMask[i].mascaraformatada;
      }
    }

    mFor = mascaraFormatada.substr(0, mascaraFormatada.length - 1);
    mExp = mascaraExpression.substr(0, mascaraExpression.length - 7);
    if (pref == null) { pref = '' }
    if (suf == null) { suf = '' }

    if (pref != '') {
      if (suf != '') {
        mExp = "'" + pref + "'" + ", '" + separador + "', " + mExp + ", '" + separador + "', " + "'" + suf + "'";
        mFor = pref + separador + mFor + separador + suf;
      } else {
        mExp = "'" + pref + "'" + ", '" + separador + "', " + mExp;
        mFor = pref + separador + mFor;
      }
    } else {
      if (suf != '') {
        mExp = mExp + ", '" + separador + "', " + "'" + suf + "'";
        mFor = mFor + separador + suf
      } else {
        mExp = mExp;
        mFor = mFor;
      }
    }

    this.mascaraForm.controls['mascaraFormatada'].patchValue(mFor);
    mExp = "[" + mExp + "]";
    this.mascaraForm.controls['mascaraExpression'].patchValue(mExp);
  }


  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['mascara/lista']);
  }

  remover(id) {
    this.router.navigate(['mascara/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['mascara/reativar/' + id]);
  }

}







