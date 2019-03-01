import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { LeiauteArquivoBancario, Banco } from '../models/leiautearquivobancario';
import { LeiauteArquivoBancarioService } from '../leiautearquivobancario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Observable } from 'rxjs/Observable';
import { LeiauteArquivoBancarioComponent } from '../leiautearquivobancario.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-excluir-leiautearquivobancario',
    templateUrl: './excluir-leiautearquivobancario.component.html',
    styleUrls: []
})
export class ExcluirLeiauteArquivoBancarioComponent implements OnInit {
   // [x: string]: any;
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    leiauteArquivoBancarioForm: FormGroup;
    leiauteArquivoBancario: LeiauteArquivoBancario;

    leiauteArquivoBancarioId: string = "";

    public sub: Subscription;


    swal: SweetAlertAdviceService;
    displayMessage: { [key: string]: string } = {};

    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public bancos: Banco[];

    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    public errors: any[] = [];

    constructor(
        private leiauteArquivoBancarioService: LeiauteArquivoBancarioService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private leiauteArquivoBancarioComponent: LeiauteArquivoBancarioComponent) {

        this.validationMessages = {
            grupoEmpresaId: {
                required: 'Grupo requirido'
            },
            empresaId: {
                required: 'Empresa requirido'
            },
            bancoId: {
                required: 'Banco requirido'
            },
            codigo: {
                required: 'Código requirido',
                minlength: 'O Código precisa ter no mínimo 3 caracteres',
                maxlength: 'O Código precisa ter no máximo 20 caracteres'
            },
            descricao: {
                //  required : 'Código requirido',
                //  minlength: 'O Código precisa ter no mínimo 3 caracteres',
                maxlength: 'A descrição precisa ter no máximo 100 caracteres'
            },
            nomeArquivo: {
                required: 'Nome do Arquivo requirido',
                minlength: 'O Nome do Arquivo precisa ter no mínimo 3 caracteres',
                maxlength: 'A Nome do Arquivo precisa ter no máximo 100 caracteres'
            },
            tipoArquivo: {
                maxlength: 'O Tipo de Arquivo precisa ter no máximo 100 caracteres'
            }


        }

        this.genericValidator = new GenericValidator(this.validationMessages);
        this.leiauteArquivoBancario = new LeiauteArquivoBancario();
        this.swal = new SweetAlertAdviceService();


    }


    ngOnInit(): void {
        this.leiauteArquivoBancarioForm = this.fb.group({
            id: 0,
            grupoEmpresaId: ['', [Validators.required]],
            empresaId: ['', [Validators.required]],
            codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            descricao: ['', [Validators.maxLength(100)]],
            nomeArquivo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            tipoArquivo: ['', [Validators.maxLength(3)]],
            bancoId: ['', [Validators.required]],
            excluido: 'N'


        });

        this.sub = this.route.params.subscribe(
            params => {
                this.leiauteArquivoBancarioId = params['id'];
                this.obterLeiauteArquivoBancario(this.leiauteArquivoBancarioId);
            }
        )

        this.leiauteArquivoBancarioService.obterTodosGrupoEmpresa()
            .subscribe(grupoEmpresas => {
                this.grupoEmpresas = grupoEmpresas
            },
                error => this.errors);

        this.leiauteArquivoBancarioService.obterTodosBanco()
            .subscribe(bancos => {
                this.bancos = bancos
            },
                error => this.errors);


    }

    ngAfterViewInit(): void {
        let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
        var self = this;
        this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
          if (isConfirmed) {
            self.removerLeiauteArquivoBancario();
          }
          else {
            self.cancelar();
          }
        });
    }


    obterLeiauteArquivoBancario(id: string) {
        this.leiauteArquivoBancarioService.obterLeiauteArquivoBancarioPorId(id)
            .subscribe(
                leiauteArquivoBancario => this.preencherFormLeiauteArquivoBancario(leiauteArquivoBancario),
                response => {
                    if (response.status == 404) {
                        this.router.navigate(['404']);
                    }
                });
    }

    preencherFormLeiauteArquivoBancario(leiauteArquivoBancario: LeiauteArquivoBancario): void {
        this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario = leiauteArquivoBancario;
        this.leiauteArquivoBancarioComponent.LeiauteArquivoBancario.regLeiauteArquivoBancario = leiauteArquivoBancario.regLeiauteArquivoBancario;

        this.leiauteArquivoBancarioForm.controls['codigo'].disable();

        this.leiauteArquivoBancario = leiauteArquivoBancario;

      //  this.reativarVisivel = this.leiauteArquivoBancario.excluido === 'S';
    //    this.removerVisivel = this.leiauteArquivoBancario.excluido === 'N';

        this.leiauteArquivoBancarioForm.patchValue({
            id: this.leiauteArquivoBancario.id,
            grupoEmpresaId: this.leiauteArquivoBancario.grupoEmpresaId,
            empresaId: this.leiauteArquivoBancario.empresaId,
            codigo: this.leiauteArquivoBancario.codigo,
            descricao: this.leiauteArquivoBancario.descricao,
            nomeArquivo: this.leiauteArquivoBancario.nomeArquivo,
            tipoArquivo: this.leiauteArquivoBancario.tipoArquivo,
            bancoId: this.leiauteArquivoBancario.bancoId,
            excluido: this.leiauteArquivoBancario.excluido

        })

    }

    removerLeiauteArquivoBancario() {
        this.leiauteArquivoBancarioService.removerLeiauteArquivoBancario(this.leiauteArquivoBancario)
          .subscribe(
          result => {
            this.swal.showSwalSuccess('Leiaute removido com Sucesso');
            this.router.navigate(['leiautearquivobancario/lista']);
          },
          error => {
            error => this.errors;
          });
      }
    
      onError(error) {
        this.errors = JSON.parse(error._body).errors;
      }
    
      cancelar() {
        this.router.navigate(['leiautearquivobancario/editar/' + this.leiauteArquivoBancarioId]);
      }

      ConsultaEmpresa(idGrupo) {
        this.empresas = [];
        this.leiauteArquivoBancarioService.obterTodosEmpresaPorGrupo(idGrupo)
            .subscribe(empresas => {
                this.empresas = empresas
            },
                () => this.errors);
    }
}