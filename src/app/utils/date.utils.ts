import { IMyOptions } from "mydatepicker";

export class DateUtils {

    public static convertUTCDateToLocalDate(date): Date {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();

        newDate.setHours(hours - offset);

        return newDate;
    }

    public static setMyDatePickerDate(myDate: any): Object {
        if (myDate != null) {
            let pickerDate = new Date(myDate);

            return { date: { year: pickerDate.getFullYear(), month: pickerDate.getMonth() + 1, day: pickerDate.getDate() } };
        }
    }

    public static getMyDatePickerDate(myDate: any): Date {
        return new Date(myDate.date.year, myDate.date.month - 1, myDate.date.day);
    }

    public static getMyDatePickerDefaultOptions(): IMyOptions {
        let dateNow = this.convertUTCDateToLocalDate(new Date());
        let myDatePickerOptions: IMyOptions = {
            selectionTxtFontSize: '16px',
            dateFormat: 'dd/mm/yyyy',
            dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
            monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
            showTodayBtn: false,
            firstDayOfWeek: "mo",
            markCurrentDay: true,
            //minYear: dateNow.getFullYear(),
            //maxYear: dateNow.getFullYear() + 3,
            //disableUntil: { year: dateNow.getFullYear(), month: dateNow.getUTCMonth() + 1, day: dateNow.getDate() - 1 },
            height: '38px',
            width: '100%'
        };

        return myDatePickerOptions;
    }

    public static getMyDatePickerOptions(): IMyOptions {
        let dateNow = this.convertUTCDateToLocalDate(new Date());
        let myDatePickerOptions: IMyOptions = {
            selectionTxtFontSize: '16px',
            dateFormat: 'dd/mm/yyyy',
            dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
            monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
            showTodayBtn: false,
            firstDayOfWeek: "mo",
            markCurrentDay: true,
            minYear: dateNow.getFullYear(),
            maxYear: dateNow.getFullYear() + 3,
            disableUntil: { year: dateNow.getFullYear(), month: dateNow.getUTCMonth() + 1, day: dateNow.getDate() - 1 },
            height: '38px',
            width: '100%'
        };

        return myDatePickerOptions;
    }

    public static getMyMonthPickerOptions(): IMyOptions {
        let dateNow = this.convertUTCDateToLocalDate(new Date());
        let myDatePickerOptions: IMyOptions = {
            selectionTxtFontSize: '16px',
            dateFormat: 'mm/yyyy',
            dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
            monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
            showTodayBtn: false,
            firstDayOfWeek: "mo",
            markCurrentDay: true,
            minYear: dateNow.getFullYear(),
            maxYear: dateNow.getFullYear() + 3,
            disableUntil: { year: dateNow.getFullYear(), month: dateNow.getUTCMonth() + 1, day: dateNow.getDate() - 1 },
            height: '38px',
            width: '130px'
        };

        return myDatePickerOptions;
    }

    public static getMyDatePickerDisableOptions(myDate: any): IMyOptions {
        let dateNow;
        let dataUntil
        if (myDate == "") {
            dateNow = this.convertUTCDateToLocalDate(new Date());
            dataUntil = this.convertUTCDateToLocalDate(new Date());
        }
        else {
            dateNow = this.convertUTCDateToLocalDate(new Date(myDate));
            dataUntil = this.convertUTCDateToLocalDate(new Date(myDate));
        }


        dateNow.setDate(dateNow.getDate() + 31);


        let myDatePickerOptions: IMyOptions = {
            selectionTxtFontSize: '16px',
            dateFormat: 'dd/mm/yyyy',
            dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
            monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
            showTodayBtn: false,
            firstDayOfWeek: "mo",
            markCurrentDay: true,
            disableUntil: { year: dataUntil.getFullYear(), month: dataUntil.getMonth() + 1, day: dataUntil.getDate() },
            disableSince: { year: dateNow.getFullYear(), month: dateNow.getUTCMonth() + 1, day: dateNow.getDate() + 1 },
            height: '38px',
            //width: '100px'

        };

        return myDatePickerOptions;

    }

    public static getMyDatePickerOptionsEnabled(): IMyOptions {
        let dateNow = this.convertUTCDateToLocalDate(new Date());
        let myDatePickerOptions: IMyOptions = {
            selectionTxtFontSize: '16px',
            dateFormat: 'dd/mm/yyyy',
            dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
            monthLabels: { 1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr', 5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez' },
            showTodayBtn: true,
            firstDayOfWeek: "mo",
            markCurrentDay: true,          
            maxYear: dateNow.getFullYear() + 3,          
            height: '38px',
            width: '130px'
        };

        return myDatePickerOptions;
    }
}
