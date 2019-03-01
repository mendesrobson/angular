import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { MaskService } from '../../../services/mask.service';

import { UtilService } from '../../../services/util.service';
import { Empregado, EmpregadoDependente, Parentesco, Nacionalidade, Uf, Localidade} from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-editar-empregadodependente',
  templateUrl: './editar-empregadodependente.component.html',
  styleUrls: ['./editar-empregadodependente.component.css']
})
export class EditarEmpregadodependenteComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  now = Date.now();
  
  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  cpfMask = this._maskService.Cpf();
  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public empregadoDependente: EmpregadoDependente;
  public parentescos: Parentesco[];
  public nacionalidades: Nacionalidade[];
  public ufs: Uf[];
  public localidades: Localidade[];
  public empregadoId = 0;
  public empregadoDependenteForm: FormGroup;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private _maskService: MaskService,
    private _utilService: UtilService) { 

      this.validationMessages = {
        cpf:{
          required: 'Cpf requerido!'
        },
        nomeDependente:{
          required: 'Nome do dependente requerido!'
        },
        parentescoId:{
          required: 'Parentesco requerido!'
        },
        dataNascimento:{
          required: 'Data de nascimento requerido!'
        }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregadoDependente = new EmpregadoDependente();
      this.swal = new SweetAlertAdviceService();

    }

  async ngOnInit(): Promise<void> {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }

    this.empregadoDependenteForm = this.fb.group({
      id: 0,
      cpf: ['', [Validators.required]],
      nomeDependente: ['', [Validators.required]],
      parentescoId: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      invalido: 'N',
      dependenteIrrf: 'N',
      dependenteSalarioFamilia: 'N',
      nacionalidadeId: null,
      ufNascimentoId: null,
      localidadeId: null,
      certidaoNascimento: '',
      livro: '',
      folha: '',
      dataEntrega: '',
      cartorio: '',
      excluido: 'N'
    });

    await this.empregadoService.obterTodosParentescos()
    .subscribe(result => { this.parentescos = result;});

    await this.empregadoService.obterTodosNacionalidade()
    .subscribe(result => { this.nacionalidades = result;});

    await this.empregadoService.obterTodosUf()
    .subscribe(result => { this.ufs = result });

    await this.empregadoService.obterTodosLocalidadeEndereco()
    .subscribe(result => { this.localidades = result });

    await this.preencherEmpregadoDependente(this.empregadoComponent.empregadoDependente);
  }

  preencherEmpregadoDependente(empregadoDependente: EmpregadoDependente) : void {

    this.empregadoDependente = empregadoDependente;

    this.empregadoDependenteForm.patchValue({
      cpf: this.empregadoDependente.cpf,
      nomeDependente: this.empregadoDependente.nomeDependente,
      parentescoId: this.empregadoDependente.parentescoId,
      dataNascimento: this.empregadoDependente.dataNascimento != null && this.empregadoDependente.dataNascimento != '' ? this._utilService.ToDate(this.empregadoDependente.dataNascimento) : '',
      invalido: this.empregadoDependente.invalido,
      dependenteIrrf: this.empregadoDependente.dependenteIrrf,
      dependenteSalarioFamilia: this.empregadoDependente.dependenteSalarioFamilia,
      nacionalidadeId: this.empregadoDependente.nacionalidadeId,
      ufNascimentoId: this.empregadoDependente.ufNascimentoId,
      localidadeId: this.empregadoDependente.localidadeId,
      certidaoNascimento: this.empregadoDependente.certidaoNascimento,
      livro: this.empregadoDependente.livro,
      folha: this.empregadoDependente.folha,
      dataEntrega: this.empregadoDependente.dataEntrega != null && this.empregadoDependente.dataEntrega != '' ? this._utilService.ToDate(this.empregadoDependente.dataEntrega) : '',
      cartorio: this.empregadoDependente.cartorio
    });
 }

 ngAfterViewInit(): void {
  const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  Observable.merge(...controlBlurs).subscribe(() => {
    this.displayMessage = this.genericValidator.processMessages(this.empregadoDependenteForm);
  });
}

editarEmpregadoDependente() {

  if (this.empregadoDependenteForm.dirty && this.empregadoDependenteForm.valid) {
    let p = Object.assign({}, this.empregadoDependente, this.empregadoDependenteForm.getRawValue());

    p.id = this.empregadoComponent.empregadoDependente.id;

    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      p.empregadoId = this.empregadoId;
      p.parentesco = null;

      this.empregadoService.atualizarEmpregadoDependente(p)
        .subscribe(
          result => {
            if (result) {

              for(let i = 0; i < this.parentescos.length; i++){

                  if(p.parentescoId == this.parentescos[i].id){

                      p.parentesco = this.parentescos[i];

                  }

              }

              for (let i = 0; this.empregadoComponent.empregado.empregadoDependente.length > i; i++) {
                  if (p.id === this.empregadoComponent.empregado.empregadoDependente[i].id) {
                    this.empregadoComponent.empregado.empregadoDependente[i] = p;
                  }
              } 
              
              this.swal.showSwalSuccess('Dependente editado com sucesso!');
              this.close();
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

          },
          (erro) => {
            this.errors = erro;
          });

    } else {

      for(let i = 0; i < this.parentescos.length; i++){

        if(p.parentescoId == this.parentescos[i].id){

            p.parentesco = this.parentescos[i];
        }

      }

      for (let i = 0; this.empregadoComponent.empregado.empregadoDependente.length > i; i++) {
          if (p.id === this.empregadoComponent.empregado.empregadoDependente[i].id) {
            this.empregadoComponent.empregado.empregadoDependente[i] = p;
          }
      } 
      
      this.swal.showSwalSuccess('Dependente editado com sucesso!');
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

ConsultaLocalidades(id){

  this.empregadoService.obterLocalidadePorUf(id)
  .subscribe(result => { this.localidades = result });

  this.empregadoService.obterUfId
  
}

}
