import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'full-layout',
    templateUrl: './full.component.html',
    styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

    constructor(public router: Router) { }

    ngOnInit() {
         if (this.router.url === './') {
             this.router.navigate(['/dashboard/dashboard1']); ///this.router.navigate(['/dashboard/dashboard1']);/dashboard/lista
        }
        //console.log(this.router.url);
    }

}
