import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { MaskService } from '../../../services/mask.service';
import { Observable } from 'rxjs/Observable';

import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { PessoaContato, Departamento, Cargo, TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { ListaPessoacontatoComponent } from '../lista-pessoacontato/lista-pessoacontato.component';

@Component({
  selector: 'app-editar-pessoacontato',
  templateUrl: './editar-pessoacontato.component.html',
  styleUrls: ['./editar-pessoacontato.component.css']
})
export class EditarPessoacontatoComponent implements OnInit, AfterViewInit{
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
  public empregadoId = 0;

  public departamentos: Departamento[];
  public cargos: Cargo[];
  public tipoContatos: TipoContato[];

  constructor(private empregadoService: EmpregadoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private empregadoComponent: EmpregadoComponent,
    private listaPessoacontatoComponent: ListaPessoacontatoComponent) {

      this.validationMessages = {};
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.pessoaContato = new PessoaContato();
      this.swal = new SweetAlertAdviceService();
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] == undefined)
      this.empregadoId = 0
    else
      this.empregadoId = this.route.snapshot.params['id'];

    this.pessoaContatoForm = this.fb.group({
      id: 0,
      tipoContatoId: 0,
      pessoaId: '', 
      excluido: 'N',
      cargoId: 0,
      departamentoId: '',
      nome: '',
      descricao: '',
      observacao: ''
    });

    this.empregadoService.obterTodosTipoContato()
      .subscribe(tipoContatos => {
        this.tipoContatos = tipoContatos;
      },
      error => this.errors);

    this.empregadoService.obterTodosDepartamento()
      .subscribe(departamentos => {
        this.departamentos = departamentos;
      },
      error => this.errors);

    this.empregadoService.obterTodosCargo()
      .subscribe(cargos => {
        this.cargos = cargos;
      },
      error => this.errors);

    this.preencherContatoForm(this.empregadoComponent.contato);
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

      this.empregadoComponent.dirty = true;
      
      if (this.empregadoId > 0) {
        p.pessoaId = this.empregadoComponent.empregado.pessoaId;
        p.tipoContato = null;
        console.log("p: ");
        console.log(p);
        this.empregadoService.atualizarContato(p)
          .subscribe(
          result => {

            for (let i = 0; this.tipoContatos.length > i; i++) {
              if (p.tipoContatoId == this.tipoContatos[i].id) {
                p.tipoContato = this.tipoContatos[i];
              }
            }

            for (let i = 0; this.empregadoComponent.empregado.pessoa.pessoaContato.length > i; i++) {
              if (p.id == this.empregadoComponent.empregado.pessoa.pessoaContato[i].id) {
                this.empregadoComponent.empregado.pessoa.pessoaContato[i] = p;
              }
            }

            this.listaPessoacontatoComponent.pessoaContatoGravado('Contato editado com sucesso!');
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

        for (let i = 0; this.empregadoComponent.empregado.pessoa.pessoaContato.length > i; i++) {
          if (this.pessoaContato.id == this.empregadoComponent.empregado.pessoa.pessoaContato[i].id) {
            this.empregadoComponent.empregado.pessoa.pessoaContato[i] = this.pessoaContato;
          }
        }

        this.listaPessoacontatoComponent.pessoaContatoGravado('Contato editado com sucesso!');
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

  validarEmail(email) {
    const emailValido = email.target.value.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    if (emailValido === null ) {
      this.swal.showSwalError('E-mail Inválido!!', function (isConfirmed) {
        if (isConfirmed) {
          email.target.value = '';
        }
      });
    }
  }

}
