import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ContaCorrenteCobranca, Banco, Agencia, ContaCorrente } from '../models/contacorrente';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContaCorrenteService } from '../contacorrente.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { ContaCorrenteComponent } from '../contacorrente.component';
import { ListaDadosCobrancaComponent } from '../lista-dadoscobranca/lista-dadoscobranca.component';

@Component({
  selector: 'app-adicionar-dadoscobranca',
  templateUrl: './adicionar-dadoscobranca.component.html',
  providers: [MaskService],
  styleUrls: ['../css-modal/css-modal.component.css']
})
export class AdicionarDadosCobrancaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public contaCorrenteId = 0;
  public contaCorrenteCobrancaForm: FormGroup;
  public contaCorrente: ContaCorrente[];
  public contaCorrenteCobranca: ContaCorrenteCobranca;
  public contaCorrenteCobrancaArray = [];
  public errors: any[] = [];
  public data: any[];
  public campos: any[] = [];
  public droppedCampos: any[] = [];
  public dragEnabled = true;
  public cursor = 0;
  public caretPos = 0;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private contaCorrenteService: ContaCorrenteService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private contaCorrenteComponent: ContaCorrenteComponent,
    private listaDadosCobranca: ListaDadosCobrancaComponent) {

    this.validationMessages = {
      codigo: {
        required: 'Código requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'Sigla requerida.',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'Descrição requerida.',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      numeroConvenio: {
        required: 'Nro. Convênio requerido.',
        maxlength: 'O Nro. Convênio precisa ter no máximo 50 caracteres'
      },
      codigoCedente: {
        required: 'Código cedente requerido.',
        maxlength: 'O Código Cedente precisa ter no máximo 20 caracteres'
      },
      numeroRemessa: {
        required: 'Nro. remessa requerido.',
        maxlength: 'O Nro. Remessa precisa ter no máximo 50 caracteres'
      },
      nossoNumero: {
        required: 'Nosso número requerido.',
        maxlength: 'O Nosso Número precisa ter no máximo 50 caracteres'
      },
      numeroContrato: {
        required: 'Número contrato requerido.',
        maxlength: 'O Nro. Contrato precisa ter no máximo 50 caracteres'
      },
      numeroCarteira: {
        required: 'Nro. Carteira requerido.',
        maxlength: 'O Nro. Carteira precisa ter no máximo 50 caracteres'
      },
      numeroVariacaoCarteira: {
        required: 'Nro. Variação Carteira requerido.',
        maxlength: 'O Nro. Variação Carteira precisa ter no máximo 50 caracteres'
      },
      localPagamento: {
        required: 'Local Pagamento requerido.',
        maxlength: 'O Local Pagamento precisa ter no máximo 200 caracteres'
      },
      carteiraIntegracaoId: {
        required: 'Carteira integração requerida.'
      },
    };

    this.contaCorrenteCobranca = new ContaCorrenteCobranca();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.swal = new SweetAlertAdviceService();

  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contaCorrenteCobrancaForm);
    });
  }


  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.contaCorrenteId = 0;
    } else {
      this.contaCorrenteId = this.route.snapshot.params['id'];
    }

    this.contaCorrenteCobrancaForm = this._fb.group({
      guid: 0,
      id: 0,
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: ['', [Validators.required, Validators.maxLength(10)]],
      descricao: ['', [Validators.required, Validators.maxLength(100)]],
      numeroConvenio: ['', [Validators.required, Validators.maxLength(50)]],
      codigoCedente: ['', [Validators.required, Validators.maxLength(20)]],
      numeroRemessa: ['', [Validators.required, Validators.maxLength(50)]],
      nossoNumero: ['', [Validators.required, Validators.maxLength(50)]],
      numeroContrato: ['', [Validators.required, Validators.maxLength(50)]],
      numeroCarteira: ['', [Validators.required, Validators.maxLength(50)]],
      numeroVariacaoCarteira: ['', [Validators.required, Validators.maxLength(50)]],
      localPagamento: ['', [Validators.required, Validators.maxLength(50)]],
      carteiraIntegracaoId: ['', [Validators.required]],
      instrucao: [''],
      excluido: 'N',
      aceite: 'N',
      producao: 'N'
     // contaCorrenteId: 0
    });

    this.campos = [
      { name: '{{Valor Desconto}}', type: 'campo' },
      { name: '{{Data desconto}}', type: 'campo' },
      { name: '{{Valor Juros}}', type: 'campo' },
      { name: '{{Data Juros}}', type: 'campo' },
      { name: '{{Valor Multa}}', type: 'campo' },
      { name: '{{Data Multa}}', type: 'campo' }
    ];

  }


  onCamposDrop(e: any) {
    this.droppedCampos.push(e.dragData);
    const instrucaoValue = this.contaCorrenteCobrancaForm.controls['instrucao'].value;
    const textoInicio: string = instrucaoValue.substr(0, this.cursor);
    const textoFim: string = instrucaoValue.substr(textoInicio.length, instrucaoValue.length);
    this.contaCorrenteCobrancaForm.patchValue({
      instrucao: textoInicio + this.droppedCampos[this.droppedCampos.length - 1].name + textoFim
    });
  }

  getPosition(oField) {
    if (oField.selectionStart || oField.selectionStart === '0') {
      this.caretPos = oField.selectionStart;
      this.cursor = this.caretPos;
    }
  }

  adicionarDadosCobranca() {
    if (this.contaCorrenteCobrancaForm.dirty && this.contaCorrenteCobrancaForm.valid) {
      const p = Object.assign({}, this.contaCorrenteCobranca, this.contaCorrenteCobrancaForm.value);

      if (this.contaCorrenteId > 0) {
       p.ContaCorrenteId = this.contaCorrenteId;
        this.contaCorrenteService.adicionarContaCorrenteCobranca(p)
        .subscribe(
          result => {
            this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.push(result);
            this.listaDadosCobranca.mensagemToastr('Dados de Cobrança adicionado com sucesso');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {
         this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.push(p);
         this.listaDadosCobranca.mensagemToastr('Dados de Cobrança adicionado com sucesso');
         this.close();
      }
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
