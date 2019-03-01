import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';
import { Titulo, Parcela, ContaCorrente } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
//import { ToastsManager } from 'ng2-toastr';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-lista-tituloparcela',
  templateUrl: './lista-tituloparcela.component.html',
  styleUrls: []
})
export class ListaTituloparcelaComponent implements OnInit, AfterViewInit {

  @Output() atualizaValorDesconto: EventEmitter<number> = new EventEmitter<number>();

  public tituloId = 0;
  index: number = 0;

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public parcela: Parcela;
  public parcelas: Parcela[];
  public contaCorrentes: ContaCorrente[];

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "descricao";
  public sortOrder = "asc";

  public errors: any[] = [];
  public data: any[];
  swal: SweetAlertAdviceService;

  constructor(public tituloService: TituloService,
    private router: Router,
    private route: ActivatedRoute,
    //private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private tituloComponent: TituloComponent) {

    //this.toastr.setRootViewContainerRef(vcr);
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.tituloId = 0
    else
      this.tituloId = this.route.snapshot.params['id'];

    //this.parcelas = JSON.parse(localStorage.getItem("tituloParcela"));
    this.parcelas = this.tituloComponent.Titulo.parcela;

    this.tituloService.obterTodosContaCorrentePorEmpresa(this.tituloComponent.titulo.empresaId)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes

        if (this.parcelas != null) {
          for (let i = 0; i < this.parcelas.length; i++) {

            for (let y = 0; y < this.contaCorrentes.length; y++) {

              if (this.parcelas[i].contaCorrenteId == this.contaCorrentes[y].id) {
                this.parcelas[i].descricaoContaCorrente = this.contaCorrentes[y].descricao;
              }

            }

          }
        }

      },
      error => this.errors);

    this.data = this.parcelas;

  }

  ngAfterViewInit(): void {
    //this.parcelas = JSON.parse(localStorage.getItem("tituloParcela"));
    this.parcelas = this.tituloComponent.Titulo.parcela;

    this.tituloService.obterTodosContaCorrentePorEmpresa(this.tituloComponent.titulo.empresaId)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
        for (let i = 0; i < this.parcelas.length; i++) {

          for (let y = 0; y < this.contaCorrentes.length; y++) {

            if (this.parcelas[i].contaCorrenteId == this.contaCorrentes[y].id) {
              this.parcelas[i].descricaoContaCorrente = this.contaCorrentes[y].descricao;
            }

          }

        }
      },
      error => this.errors);

    this.data = this.parcelas;

  }

  atualizaStorage() {
    //this.parcelas = JSON.parse(localStorage.getItem("tituloParcela"));
    this.parcelas = this.tituloComponent.Titulo.parcela;

    this.tituloService.obterTodosContaCorrentePorEmpresa(this.tituloComponent.titulo.empresaId)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
        for (let i = 0; i < this.parcelas.length; i++) {

          for (let y = 0; y < this.contaCorrentes.length; y++) {

            if (this.parcelas[i].contaCorrenteId == this.contaCorrentes[y].id) {
              this.parcelas[i].descricaoContaCorrente = this.contaCorrentes[y].descricao;
            }

          }

        }
      },
      error => this.errors);

    //this.data = this.parcelas;
    this.tituloComponent.Titulo.parcela = this.parcelas;

  }



  cadastrarParcela() {
    this.router.navigate(['titulo/adicionarParcela']);
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

  editarParcela(parcela) {
    //localStorage.setItem("tituloParcelaEdit", JSON.stringify(parcela));
    this.tituloComponent.Parcela = parcela;
    this.showModal('modalEditar');
  }

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public parcelaGravado(msg) {
    //this.toastr.success(msg, 'Sucesso', '');
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }


  onChange_Parcela(i): void {
    this.index = i;
  }

  excluirValorParcelaDesconto(event) {
    console.log("lista-tituloparcela: " + event);
    this.atualizaValorDesconto.emit(event);
  }


}
