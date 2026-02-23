import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-show-img',
  templateUrl: './show-img.page.html',
  styleUrls: ['./show-img.page.scss'],
})
export class ShowImgPage implements OnInit {

   showToolbar: boolean = true;
   numberCache:any
  imagenes: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/simulador-futbol.appspot.com/o/Ob7MOnwhX0TWRujhStvoI5G3nds2%2Fkgrtc0svvta20wc8etapuIMG_20240320_141903.jpg?alt=media&token=833e5a05-c3e5-46fa-bded-9f4bef4b35e7',
  ];


  zoomed: boolean = false;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.numberCache = this.route.snapshot.paramMap.get('number')!.toLowerCase();
    this.imagenes = [
      localStorage.getItem('url')!,
    ];
    setTimeout(() => {
      this.showToolbar = false;
    }, 5000);
  }
  showToolbarx(){
    this.showToolbar = true
    setTimeout(() => {
      this.showToolbar = false;
    }, 5000);
  }
  hideToolbar() {
    this.showToolbar = false;
   // Mostrar la barra de herramientas nuevamente después de 5 segundos
  }
  toggleZoom() {
    this.zoomed = !this.zoomed;
    this.hideToolbar();
  }
}
