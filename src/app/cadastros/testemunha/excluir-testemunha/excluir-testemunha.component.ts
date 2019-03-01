import { Component, OnInit, ViewChildren, ElementRef , AfterViewInit} from '@angular/core';
import { FormControlName, FormBuilder } from '@angular/forms';
import { Testemunha, Uf } from '../models/testemunha';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TestemunhaService } from '../testemunha.service';
import { MaskService } from '../../../services/mask.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup } from '@angular/forms/src/model';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';


@Component({
  selector: 'app-excluir-testemunha',
  templateUrl: './excluir-testemunha.component.html',
  styleUrls: []
})
export class ExcluirTestemunhaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public testemunha: Testemunha;
  swal: SweetAlertAdviceService;
  public testemunhaForm: FormGroup;
  public sub: Subscription;

  cpfMask = this._maskService.Cpf();
  rgMask = this._maskService.Rg();

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public testemunhaId: string = "";

  public ufs: Uf[];
  public empresas: Empresa[];
  public grupoEmpresas: GrupoEmpresa[];

  public errors: any[] = [];


  constructor(
    private testemunhaService: TestemunhaService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute,
    ) {

    this.testemunha = new Testemunha();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.testemunhaForm = this.fb.group({
      codigo: [''],
      nome: [''],
      cpf: [''],
      rg: [''],
      orgaoEmissor: [''],
      empresaId: [''],
      grupoEmpresaId: [''],
      ufId: ['']
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.testemunhaId = params['id'];
        this.obterTestemunha(this.testemunhaId);
      });

    this.testemunhaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);

    this.testemunhaService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
      error => this.errors);

    this.testemunhaService.obterTodosUf()
      .subscribe(ufs => {
        this.ufs = ufs
      },
      error => this.errors);
  }

  ngAfterViewInit(): void {
    // let controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTestemunha();
      }
      else {
        self.cancelar();
      }
    });
  }


  obterTestemunha(id: string) {
    this.testemunhaService.obterTestemunha(id)
      .subscribe(
      testemunha => this.preencherFormTestemunha(testemunha),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormTestemunha(testemunha: Testemunha): void {

    this.testemunha = testemunha;

    this.reativarVisivel = this.testemunha.excluido === 'S';
    this.removerVisivel = this.testemunha.excluido === 'N';

    this.testemunhaForm.controls['codigo'].disable();

    this.testemunhaForm.patchValue({
      codigo: this.testemunha.codigo,
      nome: this.testemunha.nome,
      cpf: this.testemunha.cpf,
      rg: this.testemunha.rg,
      orgaoEmissor: this.testemunha.orgaoEmissor,
      empresaId: this.testemunha.empresaId,
      grupoEmpresaId: this.testemunha.grupoEmpresaId,
      ufId: this.testemunha.ufId
    });
  }

  removerTestemunha() {
    this.testemunhaService.removerTestemunha(this.testemunha)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Testemunha Removida com Sucesso');
        this.router.navigate(['testemunha/lista']);
      },
      error => {
        this.errors;
      });
  }

  cancelar() {
    this.router.navigate(['testemunha/editar/' + this.testemunhaId]);
  }

}
