import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input, ViewContainerRef } from '@angular/core';
import { Titulo, TituloDesconto, ParcelaDesconto } from '../models/titulo';
import { TituloService } from '../titulo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
//import { ToastsManager } from 'ng2-toastr';
import { TituloComponent } from '../titulo.component';

@Component({
  selector: 'app-lista-tituloparceladesconto',
  templateUrl: './lista-tituloparceladesconto.component.html',
  styleUrls: []
})
export class ListaTituloparceladescontoComponent implements OnInit, AfterViewInit {

  @Output() atualizaValorParcelaDesconto: EventEmitter<number> = new EventEmitter<number>();

  public tituloId = 0;
  @Input() ind: number = 0;

  showModalEdit = false;
  public modalEditVisible: boolean;
  public modalAddVisible: boolean;

  showDialog = false;

  public parcelaDesconto: ParcelaDesconto;
  public parcelaDescontos: ParcelaDesconto[];

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

    if (this.tituloComponent.Titulo.parcela.length > 0) {
      this.data = this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto;
    }

  }

  ngAfterViewInit(): void {
    if (this.tituloComponent.Titulo.parcela.length > 0) {
      this.data = this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto;
    }
  }

  atualizaStorage() {
    // this.data = JSON.parse(localStorage.getItem("tituloDesconto"));
    //this.data = this.tituloComponent.Titulo.tituloDesconto;
  }

  editarParcelaDesconto(parcelaDesconto) {

    this.tituloComponent.ParcelaDesconto = parcelaDesconto;
    //localStorage.setItem("tituloDescontoEdit", JSON.stringify(desconto));
    this.showModal('modalEditar');
  }

  cadastrarParcelaDesconto() {
    this.router.navigate(['titulo/adicionarParcelaDesconto']);
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

  public hideModal(): void {
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  public descontoGravado(msg) {
   // this.toastr.success(msg, 'Sucesso', '');
  }

  public descontoNaoGravado(msg) {
   // this.toastr.error(msg, 'Falha', '');
  }

  inativarParcelaDesconto(parcelaDesconto) {

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerParcelaDesconto(parcelaDesconto);
      }
      else {
      }
    });

  }


  removerParcelaDesconto(parcelaDesconto) {

    this.atualizaValorParcelaDesconto.emit(parcelaDesconto.valorDesconto);

    if (this.tituloId > 0) {

      //let a = this.tituloService.removerParcelaDesconto(parcelaDesconto);

      this.tituloService.removerParcelaDesconto(parcelaDesconto)
        .subscribe(
        result => {
          let descontos = this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto;

          for (var i = 0; i < descontos.length; i++) {
            if (parcelaDesconto.id == descontos[i].id) {
              descontos.splice(i, 1);
            }
          }

          this.data = descontos;

          this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto = descontos;

          this.tituloComponent.Titulo.parcela[this.ind].valorDesconto -= parcelaDesconto.valorDesconto;
          this.tituloComponent.Titulo.parcela[this.ind].valorLiquido = this.tituloComponent.Titulo.parcela[this.ind].valorBruto - this.tituloComponent.Titulo.parcela[this.ind].valorDesconto;

          this.tituloService.AtualizarParcela(this.tituloComponent.Titulo.parcela[this.ind])
            .subscribe(result => {
              this.tituloComponent.Titulo.parcela = [];
              this.tituloComponent.Titulo.tituloDesconto = [];
              this.tituloComponent.Titulo.tituloCentro = [];

              this.tituloComponent.Titulo.valorDesconto -= parcelaDesconto.valorDesconto;
              this.tituloComponent.Titulo.valorLiquido += parcelaDesconto.valorDesconto;

              this.tituloService.AtualizarTitulo(this.tituloComponent.Titulo)
                .subscribe(result => {

                  this.tituloComponent.Titulo = result;

                  this.descontoGravado('Desconto removido com sucesso!')
                  this.tituloService.obterTituloPorId(this.tituloComponent.Titulo.id)
                    .subscribe(result => {
                      this.tituloComponent.Titulo = result;

                    },
                    error => {
                      this.onError(error)
                    });
                },
                error => {
                  this.onError(error)
                });
            },
            error => {
              this.onError(error)
            });
        },
        error => {
          this.errors;
        });





    } else {
      let descontos = this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto;

      for (var i = 0; i < descontos.length; i++) {
        if (parcelaDesconto.id == descontos[i].id) {
          descontos.splice(i, 1);
        }
      }

      this.data = descontos;

      this.tituloComponent.Titulo.parcela[this.ind].parcelaDesconto = descontos;

      this.tituloComponent.Titulo.parcela[this.ind].valorDesconto -= parcelaDesconto.valorDesconto;
      this.tituloComponent.Titulo.parcela[this.ind].valorLiquido = this.tituloComponent.Titulo.parcela[this.ind].valorBruto - this.tituloComponent.Titulo.parcela[this.ind].valorDesconto;

      this.tituloComponent.Titulo.valorDesconto -= parcelaDesconto.valorDesconto;
      this.tituloComponent.Titulo.valorLiquido += parcelaDesconto.valorDesconto;

      this.descontoGravado('Desconto removido com sucesso!')
    }


  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

}
