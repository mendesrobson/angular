import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa } from '../models/empresa';
import { Subscription } from 'rxjs';
import { EmpresaService } from '../empresa.service';
import { Router, ActivatedRoute } from '@angular/router';

import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reativar-empresa',
  templateUrl: './reativar-empresa.component.html',
  styleUrls: []
})
export class ReativarEmpresaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
    public empresa: Empresa;
    public empresaForm: FormGroup;
    public empresaId: string = "";
    public sub: Subscription;
  
    public errors: any[] = [];
  
    swal: SweetAlertAdviceService;
  
    constructor(private empresaService: EmpresaService,
      private fb: FormBuilder,
      // private _maskService: MaskService,
      private router: Router,
      private route: ActivatedRoute
      ) {
  
      //this.genericValidator = new GenericValidator(this.validationMessages);
      this.empresa = new Empresa();
      this.swal = new SweetAlertAdviceService();
  
    }
  
    ngOnInit(): void {
  
      this.empresaForm = this.fb.group({
        grupoEmpresaId: null,
        excluido: 'N',
        codigo: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
        cnpj: ['', [Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14)]],
        nome: ['', [Validators.required]],
        fantasia: ''
      });
  
      this.sub = this.route.params.subscribe(
        params => {
          this.empresaId = params['id'];
          this.obterEmpresa(this.empresaId);
        });
  
  
    }
  
    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      var self = this;
      this.swal.showSwalConfirm('Reativar', function (isConfirmed) {
        if (isConfirmed) {
          self.reativarEmpresa();
        }
        else {
          self.cancelar();
        }
      });
    }
  
  
    obterEmpresa(id: string) {
      this.empresaService.obterEmpresa(id)
        .subscribe(
        empresa => this.preencherFormEmpresa(empresa),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
    }
  
  
    preencherFormEmpresa(empresa: Empresa): void {
      this.empresa = empresa;
  
      //this.reativarVisivel = this.empresa.excluido === 'S';
      //this.removerVisivel = this.empresa.excluido === 'N';
  
      this.empresaForm.patchValue({
        grupoEmpresaId: this.empresa.grupoEmpresaId,
        excluido: this.empresa.excluido,
        codigo: this.empresa.pessoa.codigo,
        cnpj: this.empresa.pessoa.cnpj,
        nome: this.empresa.pessoa.nome,
        fantasia: this.empresa.pessoa.fantasia
      })
  
  
    }
  
    cancelar() {
      this.router.navigate(['empresa/editar/' + this.empresaId]);
    }
  
    reativarEmpresa() {
      this.empresaService.reativarEmpresa(this.empresa)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Empresa Reativada com Sucesso');
          this.router.navigate(['empresa/lista']);
        },
        error => {
          error => this.errors;
        });
    }
  
  
  }
  