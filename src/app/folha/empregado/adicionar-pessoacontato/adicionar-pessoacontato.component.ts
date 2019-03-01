import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';

import { EmpregadoPessoaContato, Empregado } from '../models/empregado';
import { EmpregadoComponent } from '../empregado.component';
import { EmpregadoService } from '../empregado.service'
import { PessoaContato, Departamento, Cargo, TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { ListaPessoacontatoComponent } from '../lista-pessoacontato/lista-pessoacontato.component';

@Component({
  selector: 'app-adicionar-pessoacontato',
  templateUrl: './adicionar-pessoacontato.component.html',
  styleUrls: ['./adicionar-pessoacontato.component.css']
})
export class AdicionarPessoacontatoComponent implements OnInit {
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

  public pessoaContatoTel: PessoaContato;
  public pessoaContatoCel: PessoaContato;
  public pessoaContatoMail: PessoaContato;
  public pessoaContatoGeral: PessoaContato;

  public empregadoPessoaContato: EmpregadoPessoaContato;
  public empregado: Empregado;
  public pessoaContatos: PessoaContato[];
  public tipoContatos: TipoContato[];
  public pessoaContatoForm: FormGroup;
  public empregadoId = 0;

  public departamentos: Departamento[];
  public cargos: Cargo[];

  constructor(private empregadoService: EmpregadoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private empregadoComponent: EmpregadoComponent,
    private listaempregadoContato: ListaPessoacontatoComponent) { 

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregado = new Empregado();
      this.pessoaContatoGeral = new PessoaContato();
      this.pessoaContatoTel = new PessoaContato();
      this.pessoaContatoCel = new PessoaContato();
      this.pessoaContatoMail = new PessoaContato();
      this.pessoaContatos = new Array();
      this.swal = new SweetAlertAdviceService();
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined){
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];

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
      nome: '',
      descricaoTel: '',
      descricaoCel: '',
      descricaoMail: '',
      observacao: ''
    });

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

    this.empregadoService.obterTodosTipoContato()
      .subscribe(tipoContatos => {
        this.tipoContatos = tipoContatos;
      },
      error => this.errors);

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

  async adicionarPessoaContato(): Promise<void> {

    if (this.pessoaContatoForm.dirty && this.pessoaContatoForm.valid) {
      const p = Object.assign({}, this.empregadoPessoaContato, this.pessoaContatoForm.getRawValue());

        this.pessoaContatoGeral.cargoId = p.cargoId;
        this.pessoaContatoGeral.departamentoId = p.departamentoId;
        this.pessoaContatoGeral.nome = p.nome;
        this.pessoaContatoGeral.observacao = p.observacao;
        this.pessoaContatoGeral.excluido = 'N';

        this.empregadoComponent.dirty = true;
      
       if (this.empregadoId > 0) {

        p.pessoaId = this.empregadoComponent.empregado.pessoaId;

        this.pessoaContatoGeral.pessoaId = p.pessoaId;
        
        // Adiciona o pessoaContato TipoContato TELEFONE ################################################################
        if(p.descricaoTel.trim() != '' && p.descricaoTel.trim() != null){

            this.pessoaContatoGeral.tipoContatoId = 1;
            this.pessoaContatoGeral.descricao = p.descricaoTel;

            await this.empregadoService.adicionarContato(this.pessoaContatoGeral);
          }

         // Adiciona o pessoaContato TipoContato CEL ################################################################
         if(p.descricaoCel.trim() != '' && p.descricaoCel.trim() != null){

          this.pessoaContatoGeral.tipoContatoId = 41;
          this.pessoaContatoGeral.descricao = p.descricaoCel;

          await this.empregadoService.adicionarContato(this.pessoaContatoGeral);
          }

        // Adiciona o pessoaContato TipoContato EMAIL ################################################################
        if(p.descricaoMail.trim() != '' && p.descricaoMail.trim() != null){

          this.pessoaContatoGeral.tipoContatoId = 21;
          this.pessoaContatoGeral.descricao = p.descricaoMail;

          await this.empregadoService.adicionarContato(this.pessoaContatoGeral);
          } 
        
        if(this.empregadoComponent.empregado.pessoa.pessoaContato == null){
          this.empregadoComponent.empregado.pessoa.pessoaContato = new Array();
        }

        this.empregadoService.obterTodosContatoPorPessoaId(this.empregadoComponent.empregado.pessoaId.toString())
        .subscribe(result => { this.pessoaContatos =  result;

          if(this.pessoaContatos != null){

            for(let i = 0; i < this.pessoaContatos.length; i++){
              
              for(let y = 0; y < this.tipoContatos.length; y++){

                if(this.pessoaContatos[i].tipoContatoId == this.tipoContatos[y].id){

                  this.pessoaContatos[i].tipoContato = this.tipoContatos[y];
                }

              }
            }

            this.empregadoComponent.empregado.pessoa.pessoaContato = this.pessoaContatos;
            
          }

          

        });
        
        this.listaempregadoContato.pessoaContatoGravado('Contato gravado com sucesso!');
        this.close();
  } else {

        p.id = 0;

        if(this.empregadoComponent.empregado.pessoa.pessoaContato == null){
          this.empregadoComponent.empregado.pessoa.pessoaContato = new Array();
        }

        if(p.descricaoTel.trim() != '' && p.descricaoTel != null){

          this.pessoaContatoTel.id = 0;
          this.pessoaContatoTel.cargoId = p.cargoId;
          this.pessoaContatoTel.departamentoId = p.departamentoId;
          this.pessoaContatoTel.nome = p.nome;
          this.pessoaContatoTel.observacao = p.observacao;
          this.pessoaContatoTel.excluido = 'N';
          this.pessoaContatoTel.tipoContatoId = 1;
          this.pessoaContatoTel.descricao = p.descricaoTel;

          if(this.empregadoComponent.empregado.pessoa.pessoaContato.length > 0)
          this.pessoaContatoTel.id = this.empregadoComponent.empregado.pessoa.pessoaContato.length + 1;
          else
          this.pessoaContatoTel.id = this.pessoaContatoTel.id + 1;

          for(let i = 0; i < this.tipoContatos.length; i++){

            if(this.tipoContatos[i].id == this.pessoaContatoTel.tipoContatoId){
  
              this.pessoaContatoTel.tipoContato = this.tipoContatos[i];
            }
          }

           this.empregadoComponent.empregado.pessoa.pessoaContato.push(this.pessoaContatoTel);

        }
        
        if(p.descricaoCel.trim() != '' && p.descricaoCel != null){

          this.pessoaContatoCel.id = 0;
          this.pessoaContatoCel.cargoId = p.cargoId;
          this.pessoaContatoCel.departamentoId = p.departamentoId;
          this.pessoaContatoCel.nome = p.nome;
          this.pessoaContatoCel.observacao = p.observacao;
          this.pessoaContatoCel.excluido = 'N';
          this.pessoaContatoCel.tipoContatoId = 41;
          this.pessoaContatoCel.descricao = p.descricaoCel;

          if(this.empregadoComponent.empregado.pessoa.pessoaContato.length > 0)
          this.pessoaContatoCel.id = this.empregadoComponent.empregado.pessoa.pessoaContato.length + 1;
          else
          this.pessoaContatoCel.id = this.pessoaContatoCel.id + 1;

          for(let i = 0; i < this.tipoContatos.length; i++){

            if(this.tipoContatos[i].id == this.pessoaContatoCel.tipoContatoId){
  
              this.pessoaContatoCel.tipoContato = this.tipoContatos[i];
            }
          }

         this.empregadoComponent.empregado.pessoa.pessoaContato.push(this.pessoaContatoCel);
        }

        if(p.descricaoMail.trim() != '' && p.descricaoMail != null){

          this.pessoaContatoMail.id = 0;
          this.pessoaContatoMail.cargoId = p.cargoId;
          this.pessoaContatoMail.departamentoId = p.departamentoId;
          this.pessoaContatoMail.nome = p.nome;
          this.pessoaContatoMail.observacao = p.observacao;
          this.pessoaContatoMail.excluido = 'N';
          this.pessoaContatoMail.tipoContatoId = 21;
          this.pessoaContatoMail.descricao = p.descricaoMail;

          if(this.empregadoComponent.empregado.pessoa.pessoaContato.length > 0)
          this.pessoaContatoMail.id = this.empregadoComponent.empregado.pessoa.pessoaContato.length + 1;
          else
          this.pessoaContatoMail.id = this.pessoaContatoMail.id + 1;

          for(let i = 0; i < this.tipoContatos.length; i++){

            if(this.tipoContatos[i].id == this.pessoaContatoMail.tipoContatoId){
  
              this.pessoaContatoMail.tipoContato = this.tipoContatos[i];
            }
          }

          this.empregadoComponent.empregado.pessoa.pessoaContato.push(this.pessoaContatoMail);
        }

        this.listaempregadoContato.pessoaContatoGravado('Contato gravado com sucesso!');
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
