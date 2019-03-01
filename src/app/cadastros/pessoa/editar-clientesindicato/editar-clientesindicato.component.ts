import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { PessoaService } from '../pessoa.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { PessoaComponent } from '../pessoa.component';
import { ListaClientesindicatoComponent } from './../lista-clientesindicato/lista-clientesindicato.component';
import { Observable } from '../../../../../node_modules/rxjs';
import { ClienteSindicato, Sindicato, SindicatoConvencao } from '../../cliente/models/cliente';
import { Convencao } from './../../../folha/sindicato/models/sindicato';

@Component({
  selector: 'app-editar-clientesindicato',
  templateUrl: './editar-clientesindicato.component.html',
  styleUrls: ['./editar-clientesindicato.component.css']
})
export class EditarClientesindicatoComponent implements OnInit, AfterViewInit {
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
  public convencoes : Convencao[];
  public sindicatos : Sindicato[];


  public clienteSindicato: ClienteSindicato;
  public clienteSindicatoArray = [];
  public clienteSindicatoForm: FormGroup;
  public pessoaId = 0;

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    private pessoaComponent: PessoaComponent,
    private listaClientesindicatoComponent: ListaClientesindicatoComponent
  ) {
    this.validationMessages = {
      convencaoId :{
          required: 'Convenção é Requerido!'
        },
        sindicatoId:{
          required: 'Sindicato é Requerido!'
        }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.clienteSindicato = new ClienteSindicato();
    this.swal = new SweetAlertAdviceService();
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

      Observable.merge(this.clienteSindicatoForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.clienteSindicatoForm);
      });
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined)
      this.pessoaId = 0;
    else
      this.pessoaId = this.route.snapshot.params['id'];

    this.clienteSindicatoForm = this.fb.group({
      id: 0, 
      sindicatoConvencaoId: [''],
      convencaoId: ['', [Validators.required]],
      sindicatoId: ['',[Validators.required]],
      clienteId: '',
      excluido: 'N'
    });

     this.pessoaService.obterTodosSindicato()
    .subscribe(resultado => {
        this.sindicatos = resultado;
     });

    this.preencherclienteSindicato(this.pessoaComponent.ClienteSindicato);
  }

  preencherclienteSindicato(model: ClienteSindicato) {

    this.clienteSindicatoForm.patchValue({

      id: model.id,
      clienteId: model.clienteId,
      sindicatoId: model.sindicatoConvencao.sindicatoId,
      convencaoId: model.sindicatoConvencao.convencaoId,
      sindicatoConvencaoId: model.sindicatoConvencaoId,
      excluido: model.excluido
    });
  }

  editarClienteSindicato() {

    this.clienteSindicatoArray = this.pessoaComponent.Cliente.clienteSindicato;

    if (this.clienteSindicatoForm.dirty && this.clienteSindicatoForm.valid) {
      const p = Object.assign({}, this.clienteSindicato, this.clienteSindicatoForm.getRawValue());

      this.pessoaComponent.dirty = true;

      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;
       console.log(this.clienteSindicatoArray);

        this.pessoaService.AtualizarClienteSindicato(p)
          .subscribe(
            result => {
              if (result) {
            
                for (let i = 0; this.sindicatos.length > i; i++) {
                  if (result.sindicatoConvencao.sindicatoId == this.sindicatos[i].id) {
                    result.sindicatoConvencao.sindicato = this.sindicatos[i];
                  }
                }

                for (let i = 0; this.pessoaComponent.Cliente.clienteSindicato.length > i; i++) {
                    if (result.id == this.pessoaComponent.Cliente.clienteSindicato[i].id) {
                      this.pessoaComponent.Cliente.clienteSindicato[i] = result;
                     }
                }
                this.swal.showSwalSuccess('Cliente Sindicato, Editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            error => {
              this.errors;
            });

      } else {

        this.clienteSindicato = p;

        for (let i = 0; this.pessoaComponent.Cliente.clienteSindicato.length > i; i++) {
          if (this.clienteSindicato.id == this.pessoaComponent.Cliente.clienteSindicato[i].id) {
            this.pessoaComponent.Cliente.clienteSindicato[i] = this.clienteSindicato;
          }
        }

        this.listaClientesindicatoComponent.clienteSindicatoGravado('Cliente Sindicato, editado com sucesso!');
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

  consultaSindicatoConvencao(idSindicato) {
    this.convencoes = [];
    this.pessoaService.obterTodosPorConvencaoId(idSindicato)
      .subscribe(resultado => {
        this.convencoes = resultado;
        console.log(resultado);
      },
        () => { });
  }
}