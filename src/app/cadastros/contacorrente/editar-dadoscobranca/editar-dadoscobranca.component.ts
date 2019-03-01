import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ContaCorrenteCobranca, Banco, Agencia, ContaCorrente } from '../models/contacorrente';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { ContaCorrenteComponent } from '../contacorrente.component';

@Component({
  selector: 'app-editar-dadoscobranca',
  templateUrl: './editar-dadoscobranca.component.html',
  providers: [MaskService],
  styleUrls: ['../css-modal/css-modal.component.css']
})
export class EditarDadosCobrancaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  contaCorrenteId = 0;

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

  constructor(
    private contaCorrenteService: ContaCorrenteService,
    private _maskService: MaskService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contaCorrenteComponent: ContaCorrenteComponent) {
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
    if (this.route.snapshot.params['id'] === undefined){
      this.contaCorrenteId = 0;
    }  else {
      this.contaCorrenteId = this.route.snapshot.params['id'];
    }
    this.contaCorrenteCobrancaForm = this._fb.group({
      guid: 0,
      id: 0,
      codigo: ['', [Validators.required]],
      sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      numeroConvenio: ['', [Validators.required]],
      codigoCedente: ['', [Validators.required]],
      numeroRemessa: ['', [Validators.required]],
      nossoNumero: ['', [Validators.required]],
      numeroContrato: ['', [Validators.required]],
      numeroCarteira: ['', [Validators.required]],
      numeroVariacaoCarteira: ['', [Validators.required]],
      localPagamento: ['', [Validators.required]],
      carteiraIntegracaoId: ['', [Validators.required]],
      instrucao: ['']
    });

    this.campos = [
      { name: '{{Valor Desconto}}', type: 'campo' },
      { name: '{{Data desconto}}', type: 'campo' },
      { name: '{{Valor Juros}}', type: 'campo' },
      { name: '{{Data Juros}}', type: 'campo' },
      { name: '{{Valor Multa}}', type: 'campo' },
      { name: '{{Data Multa}}', type: 'campo' }
    ];

    this.validationMessages = {
      codigo: {
        required: 'Codigo requerido.'
      },
      sigla: {
        required: 'Sigla requerida.'
      },
      descricao: {
        required: 'Descrição requerida.'
      },
      numeroConvenio: {
        required: 'Número convênio requerido.'
      },
      codigoCedente: {
        required: 'Código cedente requerido.'
      },
      numeroRemessa: {
        required: 'Número remessa requerido.'
      },
      nossoNumero: {
        required: 'Nosso número requerido.'
      },
      numeroContrato: {
        required: 'Número contrato requerido.'
      },
      numeroCarteira: {
        required: 'Número carteira requerido.'
      },
      numeroVariacaoCarteira: {
        required: 'Número variação carteira requerido.'
      },
      localPagamento: {
        required: 'Local pagamento requerido.'
      },
      carteiraIntegracaoId: {
        required: 'Carteira integração requerida.'
      },
    };



    this.genericValidator = new GenericValidator(this.validationMessages);
    this.swal = new SweetAlertAdviceService();

    this.preencherDadosCobrancaForm(this.contaCorrenteComponent.ContaCorrenteCobranca);
  }

  public preencherDadosCobranca() {
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

  editarDadosCobranca() {
    if (this.contaCorrenteCobrancaForm.dirty && this.contaCorrenteCobrancaForm.valid) {
      const p = Object.assign({}, this.contaCorrenteCobranca, this.contaCorrenteCobrancaForm.value);
      this.contaCorrenteComponent.ContaCorrenteCobranca = p;
      this.contaCorrenteService.atualizarContaCorrenteCobranca(p).subscribe(
      result => {
        this.close();
      });

      for (let i = 0; i < this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.length; i++) {
        if (this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca[i].id === p.id) {
          this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca[i] = p;
        }
      }
    }
  }

  preencherDadosCobrancaForm(contacorrentecobranca: ContaCorrenteCobranca): void {
    this.contaCorrenteCobranca = contacorrentecobranca;

    console.log(this.contaCorrenteCobranca);

    this.contaCorrenteCobrancaForm.patchValue({
      id: this.contaCorrenteCobranca.id,
      codigo: this.contaCorrenteCobranca.codigo,
      sigla: this.contaCorrenteCobranca.sigla,
      descricao: this.contaCorrenteCobranca.descricao,
      numeroConvenio: this.contaCorrenteCobranca.numeroConvenio,
      codigoCedente: this.contaCorrenteCobranca.codigoCedente,
      numeroRemessa: this.contaCorrenteCobranca.numeroRemessa,
      nossoNumero: this.contaCorrenteCobranca.nossoNumero,
      numeroContrato: this.contaCorrenteCobranca.numeroContrato,
      numeroCarteira: this.contaCorrenteCobranca.numeroCarteira,
      numeroVariacaoCarteira: this.contaCorrenteCobranca.numeroVariacaoCarteira,
      localPagamento: this.contaCorrenteCobranca.localPagamento,
      carteiraIntegracaoId: this.contaCorrenteCobranca.carteiraIntegracaoId,
      instrucao: this.contaCorrenteCobranca.instrucao
    });
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
