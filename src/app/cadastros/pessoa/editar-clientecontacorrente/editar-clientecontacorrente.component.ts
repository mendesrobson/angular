import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Banco } from './../../banco/models/banco';
import { ClienteContaCorrente, ContaCorrente } from './../models/pessoa';
import { PessoaService } from './../pessoa.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { PessoaComponent } from '../pessoa.component';
import { ListaClientecontacorrenteComponent } from '../lista-clientecontacorrente/lista-clientecontacorrente.component';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-editar-clientecontacorrente',
  templateUrl: './editar-clientecontacorrente.component.html',
  styleUrls: ['./editar-clientecontacorrente.component.css']
})
export class EditarClientecontacorrenteComponent implements OnInit, AfterViewInit {

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


  public clienteContaCorrente: ClienteContaCorrente;
  public contaCorrente: ContaCorrente;
  public clienteContaCorrenteForm: FormGroup;
  public pessoaId = 0;

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent,
    private listaClienteContaCorrenteComponent: ListaClientecontacorrenteComponent) { 

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
      this.clienteContaCorrente = new ClienteContaCorrente();
      this.contaCorrente = new ContaCorrente();
      this.swal = new SweetAlertAdviceService();

    }

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
          .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
        Observable.merge(this.clienteContaCorrenteForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(value => {
          this.displayMessage = this.genericValidator.processMessages(this.clienteContaCorrenteForm);
        });
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined)
      this.pessoaId = 0;
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.clienteContaCorrenteForm = this.fb.group({
      id: 0, 
      bancoId: ['', [Validators.required]],
      numeroAgencia: ['',[Validators.required]],
      digitoAgencia: '',
      conta: ['',[Validators.required]],
      digito: '',
      excluido: 'N'
    });

    this.preencherClienteContaCorrente(this.pessoaComponent.clienteContaCorrente.contaCorrente);

  }

  preencherClienteContaCorrente(contaCorrente: ContaCorrente) {

    this.clienteContaCorrenteForm.patchValue({

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

  editarClienteContaCorrente() {

    if (this.clienteContaCorrenteForm.dirty && this.clienteContaCorrenteForm.valid) {
      const p = Object.assign({}, this.contaCorrente, this.clienteContaCorrenteForm.getRawValue());

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

                for(let i = 0; i < this.pessoaComponent.cliente.clienteContaCorrente.length; i++){

                    if(this.pessoaComponent.cliente.clienteContaCorrente[i].id == this.pessoaComponent.clienteContaCorrente.id){

                        this.pessoaComponent.cliente.clienteContaCorrente[i].contaCorrente = p;

                    }
                }

                this.swal.showSwalSuccess('Conta corrente editada com sucesso!');
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

        for(let i = 0; i < this.pessoaComponent.cliente.clienteContaCorrente.length; i++){

              if(this.pessoaComponent.cliente.clienteContaCorrente[i].id == this.pessoaComponent.clienteContaCorrente.id){
                
                    this.pessoaComponent.cliente.clienteContaCorrente[i].contaCorrente = this.contaCorrente;
                    break;
              }

        }

        this.listaClienteContaCorrenteComponent.clienteContaCorrenteGravado('Conta Corrente editada com sucesso!');
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
