import { Component, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {

  @Input() imgUrl!: string;
  @ViewChild('imgEl') imgEl!: ElementRef;
  @ViewChild('imgContainer') container!: ElementRef;

  scale = 1;
  posX = 0;
  posY = 0;

  lastX = 0;
  lastY = 0;

  dragging = false;

  constructor(private modalCtrl: ModalController) {
    const modalState = { modal: true, desc: 'fake state for our modal' };
    history.pushState(modalState, "null");
  }
  @HostListener('window:popstate', ['$event'])
    dismissModal() {
      this.modalCtrl.dismiss();
    }
  close() {
    this.modalCtrl.dismiss();
  }

  // 🔍 Zoom con wheel (PC)
  zoomWheel(ev: WheelEvent) {
    ev.preventDefault();

    if (ev.deltaY < 0) this.scale += 0.1;
    else this.scale = Math.max(1, this.scale - 0.1);
  }
downloadDoc() {
  
  if (!this.imgUrl) return;
  alert("Descargando imagen...");

  // Mensaje para app nativa
  const payload = {
    url: this.imgUrl
  };

    window.AndroidApp.downloadImage(this.imgUrl);

  // iOS WebView (WKScriptMessageHandler)
  if ((window as any).webkit?.messageHandlers?.iosDownloader) {
    (window as any).webkit.messageHandlers.iosDownloader.postMessage(payload);
    return;
  }

  // Si no está dentro de una app nativa → descargar normal en web
  const a = document.createElement("a");
  a.href = this.imgUrl;
  a.download = "image.png";
  a.click();
}

  // 👆 Doble tap
  onDoubleTap(ev: MouseEvent | TouchEvent) {
    this.scale = this.scale === 1 ? 3 : 1;
    this.posX = 0;
    this.posY = 0;
  }

  // 🔎 Botón de lupa
  toggleZoom() {
    this.scale = this.scale === 1 ? 3 : 1;
  }

  // 👆 Drag
  startDrag(ev: PointerEvent) {
    if (this.scale === 1) return;

    this.dragging = true;

    const element = ev.target as HTMLElement;
    element.setPointerCapture(ev.pointerId);

    const startX = ev.clientX;
    const startY = ev.clientY;

    const moveHandler = (moveEv: PointerEvent) => {
      if (!this.dragging) return;

      this.posX = this.lastX + (moveEv.clientX - startX);
      this.posY = this.lastY + (moveEv.clientY - startY);
    };

    const endHandler = () => {
      this.dragging = false;
      this.lastX = this.posX;
      this.lastY = this.posY;

      element.removeEventListener('pointermove', moveHandler);
      element.removeEventListener('pointerup', endHandler);
    };

    element.addEventListener('pointermove', moveHandler);
    element.addEventListener('pointerup', endHandler);
  }
}
