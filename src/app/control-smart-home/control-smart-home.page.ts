import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-smart-home',
  templateUrl: './control-smart-home.page.html',
  styleUrls: ['./control-smart-home.page.scss'],
})
export class ControlSmartHomePage implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  
API = "https:/us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk"; // cámbiala
openGarage() {
  this.http.post(`${this.API}/turnOnLight`, {
    deviceId: "ebd7b601a28511ca7ekrja" // cambia al tuyo
  }).subscribe(res => {
    console.log("Garage abierto:", res);
  });
}


closeGarage() {
  this.http.post(`${this.API}/turnOffLight`, {
    deviceId: "ebd7b601a28511ca7ekrja"
  }).subscribe(res => {
    console.log("Garage cerrado:", res);
  });
}
}
