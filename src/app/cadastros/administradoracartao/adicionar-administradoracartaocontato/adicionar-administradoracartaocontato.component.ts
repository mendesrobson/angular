import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { AdministradoracartaoComponent } from '../administradoracartao.component';
import { ListaAdministradoracartaocontatoComponent } from '../lista-administradoracartaocontato/lista-administradoracartaocontato.component';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from '../models/administradoracartao';
import { TipoLogradouro, Uf, Pais, Localidade, Departamento, Cargo, TipoContato } from '../../pessoa/models/pessoa';

@Component({
  selector: 'app-adicionar-administradoracartaocontato',
  templateUrl: './adicionar-administradoracartaocontato.component.html',
  styleUrls: ['./adicionar-administradoracartaocontato.component.css']
})
export class AdicionarAdministradoracartaocontatoComponent implements OnInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;

  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  telMask = this._maskService.Telefone();
  celMask = this._maskService.Celular();
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public contato: AdministradoraCartaoContato;
  public contatos = [];
  public contatoForm: FormGroup;
  public administradoraCartaoId = 0;

  public departamentos: Departamento[];
  public cargos: Cargo[];
  public tipoContatos: TipoContato[];

  constructor(private administradoraCartaoService: AdministradoracartaoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private administradoraCartaoComponent: AdministradoracartaoComponent,
    private listAdministradoracartaoContato: ListaAdministradoracartaocontatoComponent) {

    this.validationMessages = {
      codigo: {
        required: 'Código requerido.'
      },
      descricao: {
        required: 'Descrição requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contato = new AdministradoraCartaoContato();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.administradoraCartaoId = 0
    else
      this.administradoraCartaoId = this.route.snapshot.params['id'];

    this.contatoForm = this.fb.group({
      id: 0,
      guid: 0,
      administradoraCartaoId: '',
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null,
      excluido: 'N',
      usuarioAlteracaoId: null,
      usuarioCadastroId: null,
      usuarioInativacaoId: null,
      cargoId: '',
      departamentoId: '',
      tipoContatoId: ['', [Validators.required]],
      nome: '',
      descricao: ['', [Validators.required]],
      observacao: ''
    });

    this.administradoraCartaoService.obterTodosTipoContato()
      .subscribe(tipoContatos => {
        this.tipoContatos = tipoContatos
      },
      error => this.errors);

    this.administradoraCartaoService.obterTodosDepartamento()
      .subscribe(departamentos => {
        this.departamentos = departamentos
      },
      error => this.errors);

    this.administradoraCartaoService.obterTodosCargo()
      .subscribe(cargos => {
        this.cargos = cargos
      },
      error => this.errors);

  }


  adicionarContato() {
    this.contatos = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato;
    if (this.contatoForm.dirty && this.contatoForm.valid) {
      let p = Object.assign({}, this.contato, this.contatoForm.getRawValue());

      if (this.administradoraCartaoId > 0) {
        p.administradoraCartaoId = this.administradoraCartaoId;
        this.administradoraCartaoService.AdicionarAdministradoraCartaoContato(p)
          .subscribe(
          result => {
            this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.push(result);
            this.listAdministradoracartaoContato.administradoraCartaoContatoGravado('Contato adicionado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {
        p.id = 0;
        if (this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.length > 0) {
          p.id = this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.length + 1;
        }

        for (let i = 0; this.tipoContatos.length > i; i++) {
          if (p.tipoContatoId == this.tipoContatos[i].id) {
            p.tipoContato = this.tipoContatos[i];
          }
        }

        this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.push(p);
        this.listAdministradoracartaoContato.administradoraCartaoContatoGravado('Contato adicionado com sucesso!');
        this.close();
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

}
