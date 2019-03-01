import { Component, OnInit, ViewChildren, ElementRef, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { PessoaService } from '../pessoa.service';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { ListaClientesindicatoComponent } from '../lista-clientesindicato/lista-clientesindicato.component';
import { PessoaComponent } from '../pessoa.component';
import { Observable } from '../../../../../node_modules/rxjs';
import { ClienteSindicato, Sindicato, Convencao, SindicatoConvencao } from '../../cliente/models/cliente';
import { id } from '@swimlane/ngx-datatable/release/utils';

@Component({
  selector: 'app-adicionar-clientesindicato',
  templateUrl: './adicionar-clientesindicato.component.html',
  styleUrls: ['./adicionar-clientesindicato.component.css']
})
export class AdicionarClientesindicatoComponent implements OnInit, AfterViewInit {
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

  public clienteSindicato: ClienteSindicato;
  public fornecedorContaCorrenteArray = [];
  public clienteSindicatoForm: FormGroup;
  public pessoaId = 0;
  public convencoes: Convencao[];
  public sindicatos: Sindicato[];
  public sindicatoConvencao: SindicatoConvencao[];

  constructor(
    private pessoaService: PessoaService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute, private pessoaComponent: PessoaComponent,
    private listaclienteSindicato: ListaClientesindicatoComponent) {

    this.validationMessages = {
      sindicatoId: {
        required: 'Sindicato é Requerido!'
      },
      convencaoId: {
        required: 'Convenção é Requerido!'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.clienteSindicato = new ClienteSindicato();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.pessoaId = 0;
    } else {
      this.pessoaId = this.route.snapshot.params['id'];
    }

    this.clienteSindicatoForm = this.fb.group({
      id: 0,
      clienteId: 0,
      sindicatoConvencaoId: 0,
      sindicatoId: ['', [Validators.required]],
      convencaoId: ['', [Validators.required]],
      excluido: 'N'
    });

    this.pessoaService.obterTodosSindicato().subscribe(
      result => {
        this.sindicatos = result;
      });

    this.pessoaService.obterTodosSindicatoConvencao().subscribe(
      result => {
        this.sindicatoConvencao = result;
      });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.clienteSindicatoForm);
    });
  }

  adicionarClienteSindicato() {

    if (this.clienteSindicatoForm.dirty && this.clienteSindicatoForm.valid) {

      const p = Object.assign({}, this.clienteSindicato, this.clienteSindicatoForm.getRawValue());

      this.pessoaComponent.dirty = true;

      p.sindicatoConvencao = this.sindicatoConvencao;

      if (this.pessoaId > 0) {

        p.pessoaId = this.pessoaId;

        p.clienteId = this.pessoaComponent.Cliente.id;


        this.sindicatoConvencao.forEach(e => {
          if (e.convencaoId == p.convencaoId) {
            p.sindicatoConvencaoId = e.id;
          }
        });

        if (p.sindicatoConvencaoId > 0) {
          p.sindicatoConvencao = null;
          this.pessoaService.AdicionarClienteSindicato(p)
            .subscribe(
              result => {
                if (result) {
                  if (this.pessoaComponent.cliente.clienteSindicato == null) {
                    this.pessoaComponent.cliente.clienteSindicato = new Array();
                  }

                  for (let i = 0; this.sindicatoConvencao.length > i; i++) {
                    result.sindicatoConvencao = this.sindicatoConvencao[i];
                  }

                  if (result.sindicatoConvencao != null) {

                    for (let i = 0; this.convencoes.length > i; i++) {
                      if (p.convencaoId == this.convencoes[i].id) {
                        result.sindicatoConvencao.convencao = this.convencoes[i];
                      }
                    }

                    for (let i = 0; this.sindicatos.length > i; i++) {
                      if (p.sindicatoId == this.sindicatos[i].id) {
                        result.sindicatoConvencao.sindicato = this.sindicatos[i];
                      }
                    }
                  }

                  this.pessoaComponent.Cliente.clienteSindicato.push(result);
                  this.swal.showSwalSuccess('Cliente Sindicato, adicionado com Sucesso!');
                  this.close();
                } else {
                  this.swal.showSwalErro('Ocorreu um erro ao gravar!');
                }
              },
              () => {
                this.errors;
              });
        } else {
          this.swal.showSwalErro('Ocorreu um erro, Cliente Sindicato não cadastrado!');
        }
      } else {
        p.id = 0;
        if (this.pessoaComponent.Cliente.clienteSindicato.length > 0) {
          p.id = this.pessoaComponent.Cliente.clienteSindicato.length + 1;
        }
        for (let i = 0; this.convencoes.length > i; i++) {
          if (p.convencaoId == this.convencoes[i].id) {
            p.sindicatoConvencao.convencao = this.convencoes[i];
          }
        }
        for (let i = 0; this.sindicatos.length > i; i++) {
          if (p.sindicatoId == this.sindicatos[i].id) {
            p.sindicatoConvencao.sindicato = this.sindicatos[i];
          }
        }
        if (this.pessoaComponent.Cliente.clienteSindicato == null) {
          this.pessoaComponent.Cliente.clienteSindicato = new Array();
        }
        
        for (var i = 0; p.sindicatoConvencao.length > i; i++) {
          if (p.convencaoId == p.sindicatoConvencao[i].convencaoId) {
            p.sindicatoConvencaoId = p.sindicatoConvencao[i].id;
          }
        }

        this.pessoaComponent.Cliente.clienteSindicato.push(p);
        this.listaclienteSindicato.clienteSindicatoGravado('Cliente Sindicato, adicionado com sucesso!');
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
    //this.clienteSindicatoForm.controls["convencaoId"].reset();
    if (this.sindicatoConvencao != null) {
      this.sindicatoConvencao.forEach(element => {
        this.convencoes = [];
        this.clienteSindicatoForm.controls["convencaoId"].reset();
        if (element.sindicatoId == idSindicato) {
          this.pessoaService.obterTodosPorConvencaoId(element.convencaoId.toString())
            .subscribe(resultado => {
              this.convencoes = resultado;
            },
              () => { });
        }
      });
    }

  }
}