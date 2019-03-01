import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Banco } from './../../banco/models/banco';
import { FornecedorContaCorrente, Fornecedor, ContaCorrente } from './../models/pessoa';
import { PessoaService } from './../pessoa.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { PessoaComponent } from '../pessoa.component';
import { ListaFornecedorcontacorrenteComponent } from '../lista-fornecedorcontacorrente/lista-fornecedorcontacorrente.component';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-editar-fornecedorcontacorrente',
  templateUrl: './editar-fornecedorcontacorrente.component.html',
  styleUrls: ['./editar-fornecedorcontacorrente.component.css']
})
export class EditarFornecedorcontacorrenteComponent implements OnInit, AfterViewInit {
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
  public bancos : Banco[];


  public fornecedorContaCorrente: FornecedorContaCorrente;
  public contaCorrente: ContaCorrente;
  public fornecedorContaCorrenteArray = [];
  public fornecedorContaCorrenteForm: FormGroup;
  public pessoaId = 0;

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent,
    private listafornecedorContaCorrenteComponent: ListaFornecedorcontacorrenteComponent
  ) {
    this.validationMessages = {
      bancoId :{
          required: 'Banco e Requerido!'
        },
        contaCorrenteNumero:{
          required: 'Conta Corrente e Requerido!'
        },
        agenciaNumero:{
          required: 'Agência e Requerido!'
        }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.fornecedorContaCorrente = new FornecedorContaCorrente();
    this.contaCorrente = new ContaCorrente();
    this.swal = new SweetAlertAdviceService();
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      Observable.merge(this.fornecedorContaCorrenteForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.fornecedorContaCorrenteForm);
      });
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined)
      this.pessoaId = 0;
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.fornecedorContaCorrenteForm = this.fb.group({
      id: 0, 
      bancoId: ['', [Validators.required]],
      numeroAgencia: ['',[Validators.required]],
      digitoAgencia: '',
      conta: ['',[Validators.required]],
      digito: '',
      excluido: 'N'
    });

    this.preencherfornecedorContaCorrente(this.pessoaComponent.FornecedorContaCorrente.contaCorrente);
  }

  preencherfornecedorContaCorrente(contaCorrente: ContaCorrente) {

    this.fornecedorContaCorrenteForm.patchValue({

      id: contaCorrente.id,
      bancoId: contaCorrente.bancoId,
      numeroAgencia: contaCorrente.numeroAgencia,
      digitoAgencia: contaCorrente.digitoAgencia,
      conta: contaCorrente.conta,
      digito: contaCorrente.digito,
      excluido: contaCorrente.excluido

    });

    this.pessoaService.obterTodosBanco()
    .subscribe(resultado => {
        this.bancos = resultado;
     });
  }

  editarFornecedorContaCorrente() {

    this.fornecedorContaCorrenteArray = this.pessoaComponent.Fornecedor.fornecedorContaCorrente;

    if (this.fornecedorContaCorrenteForm.dirty && this.fornecedorContaCorrenteForm.valid) {
      const p = Object.assign({}, this.contaCorrente, this.fornecedorContaCorrenteForm.getRawValue());

      this.pessoaComponent.dirty = true;

      if (this.pessoaId > 0) {
        
        p.banco = null;
        
        this.pessoaService.atualizarContaCorrente(p)
          .subscribe(
            result => {
              if (result) {
                
                for (let i = 0; this.bancos.length > i; i++) {
                  if (p.bancoId == this.bancos[i].id) {
                    p.banco = this.bancos[i];
                  }
                }
                
                for(let i = 0; i < this.pessoaComponent.fornecedor.fornecedorContaCorrente.length; i++){

                    if(this.pessoaComponent.fornecedor.fornecedorContaCorrente[i].id == this.pessoaComponent.fornecedorContaCorrente.id){

                        this.pessoaComponent.fornecedor.fornecedorContaCorrente[i].contaCorrente = p;

                    }
                }

                this.swal.showSwalSuccess('Forncedor conta corrente, Editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            error => {
              this.errors;
            });

      } else {
       
        this.contaCorrente = p;

        for(let i = 0; i < this.bancos.length; i++){

            if(this.contaCorrente.bancoId == this.bancos[i].id){

                this.contaCorrente.banco = this.bancos[i];
                break;
            }

        }

        for(let i = 0; i < this.pessoaComponent.fornecedor.fornecedorContaCorrente.length; i++){

              if(this.pessoaComponent.fornecedor.fornecedorContaCorrente[i].id == this.pessoaComponent.fornecedorContaCorrente.id){
                
                    this.pessoaComponent.fornecedor.fornecedorContaCorrente[i].contaCorrente = this.contaCorrente;
                    break;
              }

        }

        this.listafornecedorContaCorrenteComponent.fornecedorContaCorrenteGravado('Forncedor Conta Corrente, editado com sucesso!');
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