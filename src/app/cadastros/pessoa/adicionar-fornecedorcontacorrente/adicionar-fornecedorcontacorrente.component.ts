import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PessoaService } from '../pessoa.service';
import { PessoaComponent } from '../pessoa.component';
import { FornecedorContaCorrente, ContaCorrente, Fornecedor } from '../models/pessoa';
import { Banco } from '../../banco/models/banco';
import { ListaFornecedorcontacorrenteComponent } from './../lista-fornecedorcontacorrente/lista-fornecedorcontacorrente.component';
@Component({
  selector: 'app-adicionar-fornecedorcontacorrente',
  templateUrl: './adicionar-fornecedorcontacorrente.component.html',
  styleUrls: ['./adicionar-fornecedorcontacorrente.component.css']
})
export class AdicionarFornecedorcontacorrenteComponent implements OnInit , AfterViewInit {

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
  public fornecedorContaCorrente: FornecedorContaCorrente;
  //public fornecedorContaCorrenteArray = [];
  public fornecedorContaCorrenteForm: FormGroup;
  public pessoaId = 0;
  public bancos : Banco[];

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private pessoaComponent: PessoaComponent,
    private listafornecedorContaCorrente: ListaFornecedorcontacorrenteComponent) { 

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
      this.fornecedorContaCorrente = new FornecedorContaCorrente();
      this.swal = new SweetAlertAdviceService();
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }

    this.fornecedorContaCorrenteForm = this.fb.group({
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
      this.displayMessage = this.genericValidator.processMessages(this.fornecedorContaCorrenteForm);
    });
  }

  adicionarFornecedorContaCorrente() {

    if (this.fornecedorContaCorrenteForm.dirty && this.fornecedorContaCorrenteForm.valid) {
      
      const p = Object.assign({}, this.contaCorrente, this.fornecedorContaCorrenteForm.getRawValue());

      this.pessoaComponent.dirty = true;
      this.fornecedorContaCorrente.id = 0;

      this.contaCorrente = p;

      if(this.pessoaComponent.fornecedor.fornecedorContaCorrente == null){
        this.pessoaComponent.fornecedor.fornecedorContaCorrente = new Array();
      }
      
      if(this.pessoaId > 0){

          this.fornecedorContaCorrente.fornecedorId = this.pessoaComponent.fornecedor.id;
          this.fornecedorContaCorrente.excluido = 'N';
          this.fornecedorContaCorrente.contaCorrente = this.contaCorrente;

          this.pessoaService.AdicionarFornecedorContaCorrente(this.fornecedorContaCorrente)
          .subscribe(result => {
            
                if(result){

                      this.fornecedorContaCorrente = result;
                      
                      for(let i = 0; i < this.bancos.length; i++){

                            if(this.bancos[i].id == this.fornecedorContaCorrente.contaCorrente.bancoId){

                                  this.fornecedorContaCorrente.contaCorrente.banco = this.bancos[i];
                                  break;
                            }
                      }

                      this.pessoaComponent.fornecedor.fornecedorContaCorrente.push(this.fornecedorContaCorrente);
                      this.listafornecedorContaCorrente.fornecedorContaCorrenteGravado('Fornecedor Conta Corrente, adicionado com sucesso!');
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

        if(this.pessoaComponent.fornecedor.fornecedorContaCorrente.length > 0)
        this.fornecedorContaCorrente.id = this.pessoaComponent.fornecedor.fornecedorContaCorrente.length + 1;
        
        for(let i = 0; i < this.bancos.length; i++){

            if(this.contaCorrente.bancoId == this.bancos[i].id){

                this.contaCorrente.banco = this.bancos[i];
                break;
            }
        }

        this.fornecedorContaCorrente.excluido = 'N';
        this.fornecedorContaCorrente.contaCorrente = this.contaCorrente;

        this.pessoaComponent.fornecedor.fornecedorContaCorrente.push(this.fornecedorContaCorrente);
        this.listafornecedorContaCorrente.fornecedorContaCorrenteGravado('Fornecedor Conta Corrente, adicionado com sucesso!');
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
