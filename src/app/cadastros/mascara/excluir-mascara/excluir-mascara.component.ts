import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Mascara, SeparadorNivel, GravaOrAdiciona } from '../models/mascara';
import { MascaraService } from '../mascara.service';
import { Subscription } from 'rxjs';
import { MaskService } from '../../../services/mask.service';
import { MascaraComponent } from '../mascara.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-excluir-mascara',
  templateUrl: './excluir-mascara.component.html',
  styleUrls: []
})

export class ExcluirMascaraComponent implements OnInit, AfterViewInit {
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
  public separadorNivel: SeparadorNivel[];
  public gravaOrAdiciona: GravaOrAdiciona[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;  
  public sub: Subscription;
  
  public errors: any[] = [];

  public listMask = [];
  public listMascaraFormatada = [{ id: null, mascaraformatada: null }];
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
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.mascara = new Mascara();
    this.swal = new SweetAlertAdviceService();

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

  ngOnInit(): void {
    this.mascaraForm = this.fb.group({
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      tarefaId: [],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      prefixo: [''],
      sufixo: [''],
      separadorNiveis: [],
      quantidadeNiveis: [],
      siglaAdicionaGrava: [],
      sequencial: 'N',
      mascaraFormatada: [],
      mascaraExpression: [],
      excluido: []
    });

    this.mascaraForm.controls['grupoEmpresaId'].disable();
    this.mascaraForm.controls['empresaId'].disable();
    this.mascaraForm.controls['tarefaId'].disable();

    // this.sub = this.route.params.subscribe(
    //   params => {
    //     this.mascaraId = params['id'];
    //     this.obterMascaraPorId(this.mascaraId);
    //   });

    // this.mascaraService.obterTodosGrupoEmpresa()
    //   .subscribe(grupoEmpresas => {
    //     this.grupoEmpresas = grupoEmpresas
    //   },
    //     error => this.errors);

    // this.mascaraService.obterTodosEmpresa()
    //   .subscribe(empresas => {
    //     this.empresas = empresas
    //   },
    //     error => this.errors);

    // this.mascaraService.getSeparadorNivel()
    //   .subscribe(separadorNivel => {
    //     this.separadorNivel = separadorNivel
    //   },
    //     error => this.errors);

    // this.mascaraService.getGravaOrAdiciona()
    //   .subscribe(gravaOrAdiciona => {
    //     this.gravaOrAdiciona = gravaOrAdiciona
    //   },
    //     error => this.errors);

  }


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.mascaraForm);
    });

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerMascara();
      }
      else {
        self.cancelar();
      }
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


  getQuantidadeNiveis(qtd) {
    var maskString = "";
    var mascaraFormatada = "";
    for (var i = 0; i < this.listMask.length; i++) {
      if (this.listMask[i].mascara.length > 0) {
        this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada });
      }
    }

    for (var i = 0; i < this.listMascaraFormatada.length; i++) {
      mascaraFormatada += this.listMascaraFormatada[i];
    }

    this.listMask = [];
    this.mascaraNivel.length = qtd;
    for (var i = 0; i < this.mascaraNivel.length; i++) {
      this.listMask.push({ id: (i + 1), valor: null, mascara: [], mascaraformatada: null })
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
    var mExp = "";
    var _separador = "";

    this.listMascaraFormatada = [];
    separador = this.mascaraForm.controls['separadorNiveis'].value;
    pref = this.mascaraForm.controls['prefixo'].value;
    suf  = this.mascaraForm.controls['sufixo'].value;

    for (var i = 0; i < this.listMask.length; i++) {
      if (this.listMask[i].id == event.target.id) {
        this.listMask[i].valor = event.target.value;
        this.listMask[i].mascara.length = event.target.value;

        if (this.listMask[i].mascara.length > 0) {
          for (var z = 0; z < event.target.value; z++) {
            maskString += code;
          }
          this.listMask[i].mascaraformatada = maskString + separador;
          this.listMascaraFormatada.push({ id: this.listMask[i].id, mascaraformatada: this.listMask[i].mascaraformatada });
        }
      }

      if (this.listMask[i].mascaraformatada != null) {
        mascaraFormatada += this.listMask[i].mascaraformatada;
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

    mExp = mascaraFormatada.replace(/9/g, "/\\d/, "); 
    mExp = mExp.substr(0, mExp.length - 3);
    _separador = '/'+separador+'/g';
    mExp = mExp.replace(_separador,  "'" + separador + "' "); 
    
    this.mascaraForm.controls['mascaraFormatada'].patchValue(mFor);    
    this.mascaraForm.controls['mascaraExpression'].patchValue(mExp);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['mascara/editar/' + this.mascaraId]);
  }

  removerMascara() {
    this.mascaraService.RemoverMascara(this.mascara)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Mascara Removida com Sucesso');
        this.router.navigate(['mascara/lista']);
      },
      error => {
        error => this.errors;
      });
  }


}
