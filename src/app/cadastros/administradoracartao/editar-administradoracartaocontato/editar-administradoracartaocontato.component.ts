import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
//import { UtilService } from '../../../services/util.service';
import { AdministradoracartaoService } from '../administradoracartao.service';
import { AdministradoracartaoComponent } from '../administradoracartao.component';
import { ListaAdministradoracartaocontatoComponent } from '../lista-administradoracartaocontato/lista-administradoracartaocontato.component';
import { Administradoracartao, AdministradoraCartaoEndereco, AdministradoraCartaoContato } from '../models/administradoracartao';
import { TipoLogradouro, Uf, Pais, Localidade, Departamento, Cargo, TipoContato } from '../../pessoa/models/pessoa';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-administradoracartaocontato',
  templateUrl: './editar-administradoracartaocontato.component.html',
  styleUrls: ['./editar-administradoracartaocontato.component.css']
})
export class EditarAdministradoracartaocontatoComponent implements OnInit, AfterViewInit {
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

      this.preencherContatoForm(this.administradoraCartaoComponent.AdministradoracartaoContato);
  }

  preencherContatoForm(contato: AdministradoraCartaoContato): void {

    this.contato = contato;

    this.contatoForm.patchValue({
      administradoraCartaoId: this.contato.administradoraCartaoId,
      id: this.contato.id,
      cargoId: this.contato.cargoId,
      departamentoId: this.contato.departamentoId,
      tipoContatoId: this.contato.tipoContatoId,
      nome: this.contato.nome,
      descricao: this.contato.descricao,
      observacao: this.contato.observacao
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contatoForm);
    });
  }

 
  editarContato() {

    if (this.contatoForm.dirty && this.contatoForm.valid) {
      let p = Object.assign({}, this.contato, this.contatoForm.getRawValue());

      if (this.administradoraCartaoId > 0) {
        p.administradoraCartaoId = this.administradoraCartaoId;

        this.administradoraCartaoService.AtualizarAdministradoraCartaoContato(p)
          .subscribe(
          result => {

            for (let i = 0; this.tipoContatos.length > i; i++) {
              if (result.tipoContatoId == this.tipoContatos[i].id) {
                result.tipoContato = this.tipoContatos[i];
              }
            }

            for (let i = 0; this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.length > i; i++) {
              if (result.id == this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato[i].id) {
                this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato[i] = result;
              }
            }

            this.listAdministradoracartaoContato.administradoraCartaoContatoGravado('Contato editado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {

        this.contato = p;

        for (let i = 0; this.tipoContatos.length > i; i++) {
          if (this.contato.tipoContatoId == this.tipoContatos[i].id) {
            this.contato.tipoContato = this.tipoContatos[i];
          }
        }

        for (let i = 0; this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato.length > i; i++) {
          if (this.contato.id == this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato[i].id) {
            this.administradoraCartaoComponent.Administradoracartao.administradoraCartaoContato[i] = this.contato;
          }
        }

        this.listAdministradoracartaoContato.administradoraCartaoContatoGravado('Contato editado com sucesso!');
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
