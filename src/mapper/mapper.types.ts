export class Categorey {

    constructor(country, id, name, position, parent_id?) {
        this.country = country;
        this.id = id;
        this.name = name;
        this.position = position;
        if (parent_id) {
            this.parent_id = parent_id;
        }
    }

    country: string;
    id: string;
    parent_id?: string = "root";
    name: string;
    isEmpty: boolean = false;
    showInMenu: boolean = true;
    position: number;
    
}