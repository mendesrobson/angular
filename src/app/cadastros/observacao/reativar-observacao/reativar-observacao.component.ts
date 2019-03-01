import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observacao } from '../models/observacao';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription } from 'rxjs';
import { ObservacaoService } from '../observacao.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-reativar-observacao',
  templateUrl: './reativar-observacao.component.html',
  styleUrls: []
})
export class ReativarObservacaoComponent implements OnInit, AfterViewInit {
  
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    
    empresas: Empresa[];
    grupoEmpresas: GrupoEmpresa[];
    swal: SweetAlertAdviceService;
    
    private sub: Subscription;
    public observacao: Observacao;
    private observacaoId: string;
    public errors: any[] = [];
    public observacaoForm: FormGroup;
  
    constructor(
      private observacaoService: ObservacaoService,
      private route: ActivatedRoute,
      private router: Router,
      private fb: FormBuilder) { 
      this.swal = new SweetAlertAdviceService();
      this.observacao = new Observacao();
    }
  
    ngOnInit() {
      this.observacaoForm = this.fb.group({
        codigo: '',
        descricao: '',
        observacaoComplementar : '',  
        empresaId: '',
        grupoEmpresaId: '' });
  
      this.sub = this.route.params.subscribe(
        params => {
          this.observacaoId = params['id'];
          this.obterObservacao(this.observacaoId);
        });
  
      this.observacaoService.obterTodosGrupoEmpresa()
        .subscribe(grupoEmpresas => {
            this.grupoEmpresas = grupoEmpresas
            }, 
         error => this.errors);
    }
  
    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
      
      var self = this;
      this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
          self.reativarObservacao();
          }
      else {
          self.cancelar();
        }});  
    }
  
    obterObservacao(id: string) {
      this.observacaoService.obterObservacao(id)
        .subscribe(            
          observacao => this.preencherFormObservacao(observacao),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
    }
  
    preencherFormObservacao(observacao: Observacao): void {
      this.observacao = observacao;

      this.observacaoForm.controls['codigo'].disable();
  
      this.observacaoForm.patchValue({
        codigo: this.observacao.codigo,
        descricao: this.observacao.descricao,
        observacaoComplementar: this.observacao.observacaoComplementar,
        empresaId: this.observacao.empresaId,
        grupoEmpresaId: this.observacao.grupoEmpresaId,
      });
    }
  
    cancelar(){
      this.router.navigate(['observacao/editar/'+ this.observacaoId]);
    }
  
    reativarObservacao() {
      this.observacaoService.reativarObservacao(this.observacao)
      .subscribe(
      result => { this.swal.showSwalSuccess('Observação Reativada com Sucesso')
      this.router.navigate(['observacao/lista']);
    },
    error => { 
          this.errors;
    });
 }  

 ConsultaEmpresa(idGrupo){

  this.empresas = [];
  this.observacaoService.obterTodosEmpresaPorGrupo(idGrupo)
      .subscribe(empresas => {
          this.empresas = empresas
      },
          () => this.errors);
}
  
  }
  