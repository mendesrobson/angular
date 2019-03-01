import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { PessoaService } from '../pessoa.service';
import { PessoaComponent } from '../pessoa.component';
import { ListaPessoacontatoComponent } from '../lista-pessoacontato/lista-pessoacontato.component';
import { PessoaContato, Departamento, Cargo, TipoContato } from '../models/pessoa';

@Component({
  selector: 'app-adicionar-pessoacontato',
  templateUrl: './adicionar-pessoacontato.component.html',
  styleUrls: ['./adicionar-pessoacontato.component.css']
})
export class AdicionarPessoacontatoComponent implements OnInit {
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
      codigo: {
        required: 'Código requerido.'
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
    if (this.route.snapshot.params['id'] === undefined){
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }
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


  }

  adicionarPessoaContato() {

    if (this.pessoaContatoForm.dirty && this.pessoaContatoForm.valid) {
      const p = Object.assign({}, this.pessoaContato, this.pessoaContatoForm.getRawValue());

      this.pessoaComponent.dirty = true;
      p.tipoContato = null;

      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;

        this.pessoaService.AdicionarPessoaContato(p)
          .subscribe(
          result => {

            for (let i = 0; this.tipoContatos.length > i; i++) {
              if (result.tipoContatoId === this.tipoContatos[i].id) {
                result.tipoContato = this.tipoContatos[i];
              }
            }
            if(this.pessoaComponent.Pessoa.pessoaContato == null){
              this.pessoaComponent.Pessoa.pessoaContato = new Array();
            }  
            this.pessoaComponent.Pessoa.pessoaContato.push(result);
            this.listPessoaContato.pessoaContatoGravado('Contato adicionado com sucesso!');
            this.close();
          },
          () => {
            this.errors;
          });
      } else {

        p.id = 0;

        this.pessoaContato = p;

        if (this.pessoaComponent.Pessoa.pessoaContato.length > 0) {
          p.id = this.pessoaComponent.Pessoa.pessoaContato.length + 1;
        }

        for (let i = 0; this.tipoContatos.length > i; i++) {
          if (this.pessoaContato.tipoContatoId === this.tipoContatos[i].id) {
            this.pessoaContato.tipoContato = this.tipoContatos[i];
          }
        }

        this.pessoaComponent.Pessoa.pessoaContato.push(p);
        this.listPessoaContato.pessoaContatoGravado('Contato adicionado com sucesso!');
        this.close();
      }
    }
  }

  validarEmail(email) {
    const emailValido = email.pessoaContatoForm.controls.descricao.value.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    if (emailValido === null ) {
      this.swal.showSwalError('E-mail Inválido!!', function (isConfirmed) {
        if (isConfirmed) {
          email.pessoaContatoForm.controls.descricao.reset();
        }
      });
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