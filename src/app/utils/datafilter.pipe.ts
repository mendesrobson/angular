import * as _ from "lodash";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

    newArray = [];

    transform(array: any[], query: string): any {
        if (query) {
            this.newArray = [];
            for (var i = 0; i < array.length; i++) {
                var campo;
                for (var key in array[i]) {
                    campo = key;
                    if (array[i][campo] == null) {

                    }
                    else
                    {
                        if (array[i][campo].toString().toLowerCase().indexOf(query.toLowerCase()) != -1) {
                            if (this.newArray.indexOf(array[i]) == -1)
                                this.newArray.push(array[i]);
                        }
                    }
                }
            }
            array = this.newArray;
        }
        

        return array;
    }
}