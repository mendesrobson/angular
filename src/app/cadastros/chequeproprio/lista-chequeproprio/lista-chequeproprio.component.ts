import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ToastsManager } from 'ng2-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ChequeProprioService } from '../chequeproprio.service';
import { ChequeTalao } from '../models/chequeproprio';
import { ChequeproprioComponent } from '../chequeproprio.component';
import { ReportService } from '../../../utils/report.service';

@Component({
  selector: 'app-lista-chequeproprio',
  templateUrl: './lista-chequeproprio.component.html',
  styleUrls: []
})
export class ListaChequeproprioComponent implements OnInit {

  public chequeTalao: ChequeTalao[];
  public chequeTalaoId = 0;
  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public chequeProprioService: ChequeProprioService,
    private router: Router,
    private route: ActivatedRoute,
    private report: ReportService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit(): void {

    if (this.route.snapshot.params['id'] == undefined)
      this.chequeTalaoId = 0
    else
      this.chequeTalaoId = this.route.snapshot.params['id'];

    this.chequeProprioService.ObterTodosChequeTalao()
      .subscribe(chequeTalao => {
        this.chequeTalao = chequeTalao
        this.data = this.chequeTalao
      },
        () => this.errors);

  }

  editarChequeTalao(id) {
    this.router.navigate(['chequeproprio/editar/' + id]);
  }


  cadastrarChequeTalao() {
    this.router.navigate(['chequeproprio/adicionar']);
  }

  public showModal(modal: string): void {
    if (modal == 'modalEditar') {
      this.modalEditVisible = true;
      this.modalAddVisible = false;
    }
    else if (modal == 'modalAdicionar') {
      this.modalEditVisible = false;
      this.modalAddVisible = true;
    }

  }

  // inativarChequeTalao(chequeTalao) {
  //   var self = this;
  //   this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
  //     if (isConfirmed) {
  //       self.removerChequeTalao(chequeTalao);
  //     }
  //     else {
  //     }
  //   });
  // }


  // removerChequeTalao(chequeTalao) {
  //   if (this.chequeTalaoId > 0) {
  //     this.chequeProprioService.RemoverChequeTalao(chequeTalao)
  //       .subscribe(
  //       result => {
  //         for (var i = 0; i < this.chequeProprioComponent.ChequeTalao.pessoaContato.length; i++) {
  //           if (pessoaContato.id == this.pessoaComponent.Pessoa.pessoaContato[i].id) {
  //             this.pessoaComponent.Pessoa.pessoaContato.splice(i, 1);
  //           }
  //         }
  //       },
  //       error => {
  //         this.errors;
  //       });
  //   } else {
  //     for (var i = 0; i < this.pessoaComponent.Pessoa.pessoaContato.length; i++) {
  //       if (pessoaContato.id == this.pessoaComponent.Pessoa.pessoaContato[i].id) {
  //         this.pessoaComponent.Pessoa.pessoaContato.splice(i, 1);
  //       }
  //     }
  //   }
  // }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public chequeTalaoGravado(msg) {
    this.toastr.success(msg, 'Sucesso', '');
  }

  public chequeTalaoErro(msg) {
    this.toastr.error(msg, 'Falha', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }
  
    gerarExcel(model,id?)  {
    if (!this.report.gerarExcel(model, "Cheque Próprio",id))
      this.toastr.error("Não Possui Informações");
  }

  gerarPDF(model: string) {
    this.report.pdfFile(model, "Cheque Próprio");
  }
}
