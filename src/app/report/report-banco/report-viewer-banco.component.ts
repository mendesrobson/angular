import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import * as ko from "knockout";
import { Html } from "devexpress-reporting/dx-web-document-viewer";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'report-viewer-banco',
  templateUrl: './report-viewer-banco.component.html',
  styleUrls: ['./report-viewer-banco.component.css']
})

export class ReportViewerBancoComponent implements AfterViewInit {
  @ViewChild('scripts')
  scripts: ElementRef;

  @ViewChild("control")
  control: ElementRef

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    const reportUrl = "Bancos",
      host = `${environment.url_reportView}`,
      container = this.renderer.createElement("div");

    container.innerHTML = Html;
    this.renderer.appendChild(this.scripts.nativeElement, container);
    ko.applyBindings({
      reportUrl, // The URL of a report that is opened in the Document Viewer when the application starts.  
      requestOptions: { // Options for processing requests from the Web Document Viewer.  
        host, // URI of your backend project.  
        invokeAction: "/WebDocumentViewer/Invoke" // The URI path of the controller action that processes requests.  
      }
    }, this.control.nativeElement);
  }
}