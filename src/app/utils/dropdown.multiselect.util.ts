import { IMultiSelectSettings, IMultiSelectTexts } from "angular-2-dropdown-multiselect";

export class DropDownMultiSelect {

    public static getMySettings(): IMultiSelectSettings {
        let mySettings: IMultiSelectSettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'fontawesome',
            buttonClasses: 'btn btn-default btn-secondary',
            containerClasses: 'dropdown-inline',
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 1,
            displayAllSelectedText: true
        }
        return mySettings;
    };

    public static getMyTexts(): IMultiSelectTexts {
        let myTexts: IMultiSelectTexts = {
            checkAll: 'Marcar todos',
            uncheckAll: 'Desmarcar todos',
            checked: 'selecionado',
            checkedPlural: 'selecionados',
            searchPlaceholder: 'Pesquisar',
            searchEmptyResult: 'Pesquisando...',
            searchNoRenderText: 'Não encontrado',
            defaultTitle: 'Selecione',
            allSelected: 'Todos'
        }
        return myTexts;
    };
}