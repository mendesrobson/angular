import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { PessoaComponent } from '../pessoa.component';
import { ClienteContaCorrente, ContaCorrente} from '../models/pessoa';
import { Banco } from '../../banco/models/banco';
import { ListaClientecontacorrenteComponent } from './../lista-clientecontacorrente/lista-clientecontacorrente.component';

@Component({
  selector: 'app-adicionar-clientecontacorrente',
  templateUrl: './adicionar-clientecontacorrente.component.html',
  styleUrls: ['./adicionar-clientecontacorrente.component.css']
})
export class AdicionarClientecontacorrenteComponent implements OnInit, AfterViewInit {

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

  public contaCorrente: ContaCorrente;
  public clienteContaCorrente: ClienteContaCorrente;
  public clienteContaCorrenteForm: FormGroup;
  public pessoaId = 0;
  public bancos : Banco[];

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute, 
    private pessoaComponent: PessoaComponent,
    private listaClienteContaCorrente: ListaClientecontacorrenteComponent) { 

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
      this.contaCorrente = new ContaCorrente();
      this.clienteContaCorrente = new ClienteContaCorrente();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }

    this.clienteContaCorrenteForm = this.fb.group({
      id: 0, 
      bancoId: ['', [Validators.required]],
      numeroAgencia: ['',[Validators.required]],
      digitoAgencia: '',
      conta: ['',[Validators.required]],
      digito: '',
      excluido: 'N'
    });

    this.pessoaService.obterTodosBanco().subscribe(
      result => {
         this.bancos = result;
      });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.clienteContaCorrenteForm);
    });
  }

  adicionarClienteContaCorrente() {

    if (this.clienteContaCorrenteForm.dirty && this.clienteContaCorrenteForm.valid) {
      
      const p = Object.assign({}, this.contaCorrente, this.clienteContaCorrenteForm.getRawValue());

      this.pessoaComponent.dirty = true;

      this.clienteContaCorrente.id = 0;

      this.contaCorrente = p;

      if(this.pessoaComponent.cliente.clienteContaCorrente == null){
        this.pessoaComponent.cliente.clienteContaCorrente = new Array();
      }
      
      if(this.pessoaId > 0){

          this.clienteContaCorrente.clienteId = this.pessoaComponent.cliente.id;
          this.clienteContaCorrente.excluido = 'N';
          this.clienteContaCorrente.contaCorrente = this.contaCorrente;

          this.pessoaService.adicionarClienteContaCorrente(this.clienteContaCorrente)
          .subscribe(result => {
            
                if(result){

                      this.clienteContaCorrente = result;
                      
                      for(let i = 0; i < this.bancos.length; i++){

                            if(this.bancos[i].id == this.clienteContaCorrente.contaCorrente.bancoId){

                                  this.clienteContaCorrente.contaCorrente.banco = this.bancos[i];
                                  break;
                            }
                      }

                      this.pessoaComponent.cliente.clienteContaCorrente.push(this.clienteContaCorrente);
                      this.listaClienteContaCorrente.clienteContaCorrenteGravado('Conta Corrente adicionada com sucesso!');
                      this.close();

                }
                else{
                  this.swal.showSwalErro('Ocorreu um erro ao gravar!');
                }

          },
           () => {              
             this.errors;
           });
       }
       else{

        if(this.pessoaComponent.cliente.clienteContaCorrente.length > 0)
        this.clienteContaCorrente.id = this.pessoaComponent.cliente.clienteContaCorrente.length + 1;
        
        for(let i = 0; i < this.bancos.length; i++){

            if(this.contaCorrente.bancoId == this.bancos[i].id){

                this.contaCorrente.banco = this.bancos[i];
                break;
            }
        }

        this.clienteContaCorrente.excluido = 'N';
        this.clienteContaCorrente.contaCorrente = this.contaCorrente;

        this.pessoaComponent.cliente.clienteContaCorrente.push(this.clienteContaCorrente);
        this.listaClienteContaCorrente.clienteContaCorrenteGravado('Conta Corrente adicionada com sucesso!');
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
