import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Mascara, SeparadorNivel, GravaOrAdiciona, MascaraNivel, Tarefa } from '../models/mascara';
import { MascaraService } from '../mascara.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-adicionar-mascara',
  templateUrl: './adicionar-mascara.component.html',
  styleUrls: []
})

export class AdicionarMascaraComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public mascara: Mascara;
  public mascaraValid: Mascara;
  public mascaraForm: FormGroup;

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

  public errors: any[] = [];

  public listMask = [];
  public listMascaraFormatada = [{ id: null, mascaraformatada: null, mascaraexpression: null }];
  public _mascaraNivel = [];
  public mascaraNivel: MascaraNivel[];

  constructor(
    private mascaraService: MascaraService,
    private fb: FormBuilder,
    private router: Router
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
      empresaId: {
        required: 'Informe a Empresa'
      },
      grupoEmpresaId: {
        required: 'Informe o Grupo'
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
    this.mascaraNivel = [];
    this.swal = new SweetAlertAdviceService();
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
      separadorNiveis: ['', [Validators.required]],
      quantidadeNiveis: ['', [Validators.required]],
      siglaAdicionaGrava: [],
      sequencial: 'N',
      mascaraFormatada: [],
      mascaraExpression: [],
      excluido: 'N'
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

  async adicionarMascara() : Promise<void> {
    if (this.mascaraForm.dirty && this.mascaraForm.valid) {
      let p = Object.assign({}, this.mascara, this.mascaraForm.value);

      await this.mascaraService.obterMascaraPorEmpresaIdTarefaId(p.empresaId, p.tarefaId)
      .subscribe(result => { this.mascaraValid = result;

          if(this.mascaraValid != null){

                this.swal.showSwalErro('A empresa deste grupo, já possui uma mascara cadastrada para a tarefa ' + this.mascaraValid.tarefa.descricao + '!');
                return;
          }
          else{
                
                p.mascaraNivel = this.mascaraNivel;
                this.mascaraService.AdicionarMascara(p).subscribe(
                  result => {
                    this.swal.showSwalSuccess('Mascara Adicionado com Sucesso!');
                    this.router.navigate(['mascara/lista']);
                  },
                  error => {
                    this.onError(error)
                  });
        }

      });

      
    }
  }

  getQuantidadeNiveis(qtd) {
    var maskString = "";
    var mascaraFormatada = "";
    this.mascaraForm.controls['mascaraFormatada'].patchValue('');
    this.mascaraForm.controls['mascaraExpression'].patchValue('');
    for (var i = 0; i < this.listMask.length; i++) {
      if (this.listMask[i].mascara.length > 0) {
        this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada, mascaraexpression: this.listMask[i].mascaraexpression });
      }
    }

    for (var i = 0; i < this.listMascaraFormatada.length; i++) {
      mascaraFormatada += this.listMascaraFormatada[i];
    }

    this.listMask = [];
    this.mascaraNivel = [];
    this._mascaraNivel.length = qtd;

    for (var i = 0; i < this._mascaraNivel.length; i++) {
      this.listMask.push({ id: (i + 1), valor: null, mascara: [], mascaraformatada: null });
      this.mascaraNivel.push({ id: (i + 1), mascaraId: null, quantidadeNivel: null, sequencia: null });
    }

    for (var i = 1; i < this.mascara.quantidadeNiveis + 1; i++) {
      if (this.listMascaraFormatada.length > 1) {
        maskString += this.listMascaraFormatada[i].mascaraformatada;
      }
    }

    this.mascara.mascaraFormatada = maskString.substr(0, maskString.length - 1);
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

    for (var i = 0; i < this.mascaraNivel.length; i++) {
      if (this.mascaraNivel[i].id == event.target.id) {
        this.mascaraNivel[i].quantidadeNivel = event.target.value;
      }
    }

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
    for (var i = 0; i < this.mascaraNivel.length; i++) {
      if (this.mascaraNivel[i].id == event.target.id) {
        this.mascaraNivel[i].sequencia = event.target.value;
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

    if (mascaraFormatada != '') {
      this.mascaraForm.controls['mascaraFormatada'].patchValue(mFor);
    }

    if (mascaraExpression != '') {
      mExp = "[" + mExp + "]";
      this.mascaraForm.controls['mascaraExpression'].patchValue(mExp);
    }

  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['mascara/lista']);
  }

}
