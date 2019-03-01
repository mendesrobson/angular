import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CobrancaContato, TipoAtendimento, CobrancaAcao } from '../models/cobranca';
import { CobrancaService } from '../cobranca.service';
import { MaskService } from '../../../services/mask.service';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { CobrancaComponent } from '../cobranca.component';
import { ListaCobrancacontatoComponent } from '../lista-cobrancacontato/lista-cobrancacontato.component';
import { FiltroCobrancaparcelaComponent } from '../filtro-cobrancaparcela/filtro-cobrancaparcela.component';
@Component({
  selector: 'app-adicionar-cobrancacontato',
  templateUrl: './adicionar-cobrancacontato.component.html',
  styleUrls: ['./adicionar-cobrancacontato.component.css']
})
export class AdicionarCobrancacontatoComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public cobrancaContato: CobrancaContato;
  public cobrancaContatos = [];
  public cobrancaForm: FormGroup;

  public tipoAtendimentos: TipoAtendimento[];
  public cobrancaAcaos: CobrancaAcao[];

  public minDate: Date;
  public maxDate: Date;

  constructor(private cobrancaService: CobrancaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cobrancaComponent: CobrancaComponent,
    private listCobranca: ListaCobrancacontatoComponent,
    private filtroCobranca: FiltroCobrancaparcelaComponent
  ) {

    this.validationMessages = {
      tipoAtendimentoId: {
        required: 'Tipo de Atendimento requerido.'
      },
      cobrancaAcaoId: {
        required: 'Ação Cobrança requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.cobrancaContato = new CobrancaContato();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.cobrancaForm = this.fb.group({
      id: 0,
      empresaId: '',
      grupoEmpresaId: '',
      parcelaId: '',
      tipoAtendimentoId: ['', [Validators.required]],
      cobrancaAcaoId: ['', [Validators.required]],
      codigo: '',
      dataContato: '',
      dataProximoContato: '',
      dataRealizacao: '',
      comentario: '',
      excluido: 'N'
    });


    this.cobrancaService.obterTodosTipoAtendimento()
      .subscribe(tipoAtendimentos => {
        this.tipoAtendimentos = tipoAtendimentos
      },
        error => this.errors);

    this.cobrancaService.obterTodosCobrancaAcao()
      .subscribe(cobrancaAcaos => {
        this.cobrancaAcaos = cobrancaAcaos
      },
        error => this.errors);

  }

  adicionarCobranca() {

    if (this.cobrancaForm.dirty && this.cobrancaForm.valid) {
      let p = Object.assign({}, this.cobrancaContato, this.cobrancaForm.getRawValue());

      p.empresaId = this.cobrancaComponent.cobrancaContato.empresaId;
      p.grupoEmpresaId = this.cobrancaComponent.cobrancaContato.grupoEmpresaId;

      for (let i = 0; this.cobrancaComponent.parcela.length > i; i++) {
        if (this.cobrancaComponent.parcela[i].selecionado == 'S') {
          p.parcelaId = this.cobrancaComponent.parcela[i].id;    
          this.cobrancaService.adicionarCobrancaContato(p)
            .subscribe(
              result => {
                this.listCobranca.cobrancaGravado('Contato Cobrança adicionado com sucesso!');
                this.filtroCobranca.filtrarParcelas();
                this.close();
              },
              error => {
                this.errors;
          });
        }
      }

    }
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  definirValor(event) {
    this.minDate = event.value;
    // var ultimoDia = new Date(this.minDate.getFullYear(), this.minDate.getMonth() + 1, 0);
    // this.maxDate = ultimoDia;
  }
}