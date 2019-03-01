import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { Empregado } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-adicionar-empregadodesconto',
  templateUrl: './adicionar-empregadodesconto.component.html',
  styleUrls: ['./adicionar-empregadodesconto.component.css']
})
export class AdicionarEmpregadodescontoComponent implements OnInit, AfterViewInit {
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
  public empregadoId = 0;
  public empregadoDescontoForm: FormGroup;
  public tipoContatos: TipoContato[];

  constructor(
    private empregadoService: EmpregadoService,  private fb: FormBuilder,
    private route: ActivatedRoute, private empregadoComponent: EmpregadoComponent) {

      this.validationMessages = { };

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

    this.empregadoDescontoForm = this.fb.group({
      sindicalizado: 'N',
      descontaMensalidadeSindical: 'N',
      pagouContribuicaoSindical: 'N'
    });

    // this.empregadoDescontoForm = new FormGroup(
    //   {
    //     sindicalizado: new FormControl('N'),
    //     descontaMensalidadeSindical: new FormControl('N'),
    //     pagouContribuicaoSindical: new FormControl('N')
    //   }
    // );
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.empregadoDescontoForm);
    });
  }

  adicionarDesconto(){

    if (this.empregadoDescontoForm.dirty && this.empregadoDescontoForm.valid) {
      let p = Object.assign({}, this.empregado, this.empregadoDescontoForm.getRawValue());

      this.empregadoComponent.empregado.sindicalizado = p.sindicalizado;
      this.empregadoComponent.empregado.descontaMensalidadeSindical = p.descontaMensalidadeSindical;
      this.empregadoComponent.empregado.pagouContribuicaoSindical = p.pagouContribuicaoSindical;

      if (this.empregadoId > 0) {

        if (this.empregadoComponent.empregado.pessoa.pessoaContato != null) {
          for (let i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++) {
            this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContato = null;
          }
        }

        this.empregadoService.atualizarEmpregado(this.empregadoComponent.empregado)
          .subscribe(
            result => {
              if (result) { }
              else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
           (error) => {  console.error(error); });

        if (this.empregadoComponent.empregado.pessoa.pessoaContato != null) {

          this.empregadoService.obterTodosTipoContato()
            .subscribe(tipoContatos => {
              this.tipoContatos = tipoContatos;

              for (let i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++) {

                for (let y = 0; y < this.tipoContatos.length; y++) {

                  if (this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id) {

                    this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
                  }
                }
              }
            }, () => { });
        }
      }
    }

    this.close();
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
