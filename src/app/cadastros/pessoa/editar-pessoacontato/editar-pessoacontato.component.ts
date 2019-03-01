import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';

import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UtilService } from '../../../services/util.service';
import { PessoaService } from '../pessoa.service';
import { PessoaComponent } from '../pessoa.component';
import { ListaPessoacontatoComponent } from '../lista-pessoacontato/lista-pessoacontato.component';
import { PessoaContato, Departamento, Cargo, TipoContato } from '../models/pessoa';

@Component({
  selector: 'app-editar-pessoacontato',
  templateUrl: './editar-pessoacontato.component.html',
  styleUrls: ['./editar-pessoacontato.component.css']
})
export class EditarPessoacontatoComponent implements OnInit, AfterViewInit {
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

  public pessoaContato: PessoaContato;
  public pessoaContatos = [];
  public pessoaContatoForm: FormGroup;
  public pessoaId = 0;

  public departamentos: Departamento[];
  public cargos: Cargo[];
  public tipoContatos: TipoContato[];

  constructor(private pessoaService: PessoaService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent,
    private listPessoaContato: ListaPessoacontatoComponent) {

    this.validationMessages = {
      tipoContatoId: {
        required: 'Tipo requerido.'
      },
      descricao: {
        required: 'Descrição requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.pessoaContato = new PessoaContato();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.pessoaContatoForm = this.fb.group({
      id: 0,
      guid: 0,
      pessoaId: '',
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


    this.pessoaService.obterTodosTipoContato()
      .subscribe(tipoContatos => {
        this.tipoContatos = tipoContatos;
      },
      error => this.errors);

    this.pessoaService.obterTodosDepartamento()
      .subscribe(departamentos => {
        this.departamentos = departamentos;
      },
      error => this.errors);

    this.pessoaService.obterTodosCargo()
      .subscribe(cargos => {
        this.cargos = cargos;
      },
      error => this.errors);

    this.preencherContatoForm(this.pessoaComponent.PessoaContato);
  }

  preencherContatoForm(pessoaContato: PessoaContato): void {

    this.pessoaContato = pessoaContato;

    this.pessoaContatoForm.patchValue({
      pessoaId: this.pessoaContato.pessoaId,
      id: this.pessoaContato.id,
      cargoId: this.pessoaContato.cargoId,
      departamentoId: this.pessoaContato.departamentoId,
      tipoContatoId: this.pessoaContato.tipoContatoId,
      nome: this.pessoaContato.nome,
      descricao: this.pessoaContato.descricao,
      observacao: this.pessoaContato.observacao
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.pessoaContatoForm);
    });
  }

  editarPessoaContato() {

    if (this.pessoaContatoForm.dirty && this.pessoaContatoForm.valid) {
      let p = Object.assign({}, this.pessoaContato, this.pessoaContatoForm.getRawValue());

      this.pessoaComponent.dirty = true;
      
      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;

        console.log("p: ");
        console.log(p);
        this.pessoaService.AtualizarPessoaContato(p)
          .subscribe(
          result => {

            for (let i = 0; this.tipoContatos.length > i; i++) {
              if (result.tipoContatoId == this.tipoContatos[i].id) {
                result.tipoContato = this.tipoContatos[i];
              }
            }

            for (let i = 0; this.pessoaComponent.Pessoa.pessoaContato.length > i; i++) {
              if (result.id == this.pessoaComponent.Pessoa.pessoaContato[i].id) {
                this.pessoaComponent.Pessoa.pessoaContato[i] = result;
              }
            }

            this.listPessoaContato.pessoaContatoGravado('Contato editado com sucesso!');
            this.close();
          },
          error => {
            this.errors;
          });
      } else {

        this.pessoaContato = p;

        for (let i = 0; this.tipoContatos.length > i; i++) {
          if (this.pessoaContato.tipoContatoId == this.tipoContatos[i].id) {
            this.pessoaContato.tipoContato = this.tipoContatos[i];
          }
        }

        for (let i = 0; this.pessoaComponent.Pessoa.pessoaContato.length > i; i++) {
          if (this.pessoaContato.id == this.pessoaComponent.Pessoa.pessoaContato[i].id) {
            this.pessoaComponent.Pessoa.pessoaContato[i] = this.pessoaContato;
          }
        }

        this.listPessoaContato.pessoaContatoGravado('Contato editado com sucesso!');
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
