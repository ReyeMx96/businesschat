import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
contact = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

sendContact() {
  console.log(this.contact);

  // Aquí puedes:
  // - Enviar a Firebase
  // - Mandarlo por email
  // - Mandarlo a WhatsApp API
}

}
