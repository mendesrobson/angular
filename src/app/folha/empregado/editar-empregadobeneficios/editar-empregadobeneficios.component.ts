import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';  
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { UtilService } from '../../../services/util.service';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { Empregado} from '../models/empregado';

@Component({
  selector: 'app-editar-empregadobeneficios',
  templateUrl: './editar-empregadobeneficios.component.html',
  styleUrls: ['./editar-empregadobeneficios.component.css']
})
export class EditarEmpregadobeneficiosComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;

  public errors: any[] = [];

  public empregado: Empregado;
  public empregadoId = 0;
  public beneficiosForm: FormGroup;
  public tipoContatos: TipoContato[];

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private _utilService: UtilService) { 

      this.validationMessages = {};

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
    this.beneficiosForm = this.fb.group({
      valeTransporte: 'N'
    });

    this.preencherEmpregadoBeneficios(this.empregadoComponent.empregado);

  }

  preencherEmpregadoBeneficios(empregado: Empregado){

    this.empregado = empregado;

    this.beneficiosForm.patchValue({
      valeTransporte: this.empregado.valeTransporte
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.beneficiosForm);
    });
  }

  public editarBeneficios(){

    if (this.beneficiosForm.dirty && this.beneficiosForm.valid) {
      let p = Object.assign({}, this.empregado, this.beneficiosForm.getRawValue());
    
        this.empregadoComponent.empregado.valeTransporte = p.valeTransporte;
       
        if(this.empregadoId > 0){

          if(this.empregadoComponent.empregado.pessoa.pessoaContato != null){
            for(let i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++){
              this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContato = null;
            }
          }
  
          this.empregadoService.atualizarEmpregado(this.empregadoComponent.empregado)
        .subscribe(
          result => {
            if (result) {} 
            else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          error => {
            console.error(error);
          });
  
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
