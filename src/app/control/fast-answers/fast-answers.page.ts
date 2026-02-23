import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fast-answers',
  templateUrl: './fast-answers.page.html',
  styleUrls: ['./fast-answers.page.scss'],
})
export class FastAnswersPage implements OnInit {
  listAns = [
    {Cmd:"pasos", Src:"Hola siga los pasos del bot para obtener descuentos", Type:"Txt"},
  ]
  constructor() { }

  ngOnInit() {
  }

}

 
