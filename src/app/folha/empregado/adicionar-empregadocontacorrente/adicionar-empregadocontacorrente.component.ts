import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { Empregado, Banco } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-adicionar-empregadocontacorrente',
  templateUrl: './adicionar-empregadocontacorrente.component.html',
  styleUrls: ['./adicionar-empregadocontacorrente.component.css']
})
export class AdicionarEmpregadocontacorrenteComponent implements OnInit, AfterViewInit  {
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

  public empregado: Empregado;
  public bancos: Banco[];
  public tipoContatos: TipoContato[];
  public empregadoId = 0;
  public empregadoContaCorrenteForm: FormGroup;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent) {

      this.validationMessages = {
        bancoId:{
            required: 'Banco Requerido!'
          },
        agenciaNumero:{
            required: 'Número da agência requerido!'
          },
        contaCorrenteNumero:{
            required: 'Número da conta corrente requerido!'
          },
        contaCorrenteDigito:{
            required: 'Dígito da conta corrente requerido!'
          }
        
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregado = new Empregado();
      this.swal = new SweetAlertAdviceService();

     }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }
    this.empregadoContaCorrenteForm = this.fb.group({
      bancoId: ['', [Validators.required]],
      agenciaNumero: ['', [Validators.required]],
      agenciaDigito: [''],
      contaCorrenteNumero: ['', [Validators.required]],
      contaCorrenteDigito: ['', [Validators.required]]
    });

    this.empregadoService.obterTodosBanco()
    .subscribe(result => { this.bancos = result }, error => this.errors);

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.empregadoContaCorrenteForm);
    });
  }

  adicionarContaCorrente(){

    if (this.empregadoContaCorrenteForm.dirty && this.empregadoContaCorrenteForm.valid) {
      const p = Object.assign({}, this.empregado, this.empregadoContaCorrenteForm.getRawValue());

      if(this.empregadoId > 0){
        
        this.empregado = this.empregadoComponent.empregado;
        
        if(this.empregado != null){

          if(this.empregado.pessoa.pessoaContato != null){
            for(let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++){
              this.empregado.pessoa.pessoaContato[i].tipoContato = null;
            }
          }

          this.empregado.bancoId = p.bancoId;
          this.empregado.agenciaDigito = p.agenciaDigito;
          this.empregado.agenciaNumero = p.agenciaNumero;
          this.empregado.contaCorrenteDigito = p.contaCorrenteDigito;
          this.empregado.contaCorrenteNumero = p.contaCorrenteNumero;

          this.empregadoService.atualizarEmpregado(this.empregado)
          .subscribe(result => {

            for(let i = 0; i < this.bancos.length; i++){

              if(this.empregado.bancoId == this.bancos[i].id){
                this.empregado.banco = this.bancos[i];
              }

            }
            
            //this.swal.showSwalSuccess('Dados bancários salvos com sucesso!');

          }, error => this.errors);

        }

      }else{

        this.empregadoComponent.empregado.bancoId = p.bancoId;
        this.empregadoComponent.empregado.agenciaDigito = p.agenciaDigito;
        this.empregadoComponent.empregado.agenciaNumero = p.agenciaNumero;
        this.empregadoComponent.empregado.contaCorrenteDigito = p.contaCorrenteDigito;
        this.empregadoComponent.empregado.contaCorrenteNumero = p.contaCorrenteNumero;

        for(let i = 0; i < this.bancos.length; i++){

          if(this.empregadoComponent.empregado.bancoId == this.bancos[i].id){
            this.empregadoComponent.empregado.banco = this.bancos[i];
          }

        }

    } 

    if(this.empregadoComponent.empregado.pessoa.pessoaContato != null){

        this.empregadoService.obterTodosTipoContato()
        .subscribe(tipoContatos => {
          this.tipoContatos = tipoContatos;

          for(let i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++){
          
            for(let y = 0; y < this.tipoContatos.length; y++){

              if(this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id){

                this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
              }

            }
          }
        },
        error => this.errors);
    }

    this.close();
    
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


