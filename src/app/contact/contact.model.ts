interface IContact {
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    editing?: boolean;
}
export class Contact {
  editing: boolean;
  firstName: string;
  lastName: string;
  id: any;

    constructor(contact: IContact) {
        contact.editing = this.setState(contact);
        Object.assign(this, contact);
    }

    setState(contact:IContact) {

        if(contact == null || Object.keys(contact).length == 0){
            return true;
        }
        let editing = false;
        Object.keys(contact).forEach((key) => {
            console.log('from setState...',contact [key]);
            if(contact [key] == null) {
                editing = true;
            }
        });
        return editing;
    }
}