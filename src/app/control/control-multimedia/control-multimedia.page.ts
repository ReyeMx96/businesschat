import { Component, OnInit } from '@angular/core';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import { getDownloadURL, getStorage, uploadBytes, ref as storageRef } from 'firebase/storage';

@Component({
  selector: 'app-control-multimedia',
  templateUrl: './control-multimedia.page.html',
  styleUrls: ['./control-multimedia.page.scss'],
})
export class ControlMultimediaPage implements OnInit {
menuType: string = "";
selectedFile: File | null = null;
previewImg: any = null;
  constructor() { }

  ngOnInit() {
  }
  onFileSelected(event: any) {
  const file = event.target.files[0];

  if (!file) {
    this.selectedFile = null;
    this.previewImg = null;
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("El archivo debe ser una imagen.");
    return;
  }

  this.selectedFile = file;

  const reader = new FileReader();
  reader.onload = () => {
    this.previewImg = reader.result;
  };
  reader.readAsDataURL(file);
}

  async uploadImageToStorage(file: File, type: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const storage = getStorage();
      const path = `Menus/${type}_${Date.now()}.jpg`;

      const imgRef = storageRef(storage, path);

      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);

      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
}


  async guardarMenu() {
  if (!this.menuType || !this.selectedFile) {
    alert("Faltan datos");
    return;
  }

  try {
    // ✅ 1) Subir la imagen a Firebase Storage
    const imgUrl = await this.uploadImageToStorage(this.selectedFile, this.menuType);

    // ✅ 2) Preparar datos para la base de datos
    const menuData = {
      Type: this.menuType,
      ImgUrl: imgUrl,
      Active: true
    };

    // ✅ 3) Guardar en RTDB
    const result = await this.saveMenuItemToRTDB(menuData);

    if (!result.ok) {
      alert(result.msg);
      return;
    }

    alert("Menú guardado correctamente ✅");
    console.log(result);

  } catch (error) {
    console.error(error);
    alert("Error al subir o guardar 😕");
  }
}


async saveMenuItemToRTDB(menu: any) {
  const db = getDatabase();
  const path = `ruta/5218333861194/Menus`;

  // Primero revisamos si ya existe uno con ese Type
  const snapshot = await get(ref(db, path));

  if (snapshot.exists()) {
    let exists = false;

    snapshot.forEach((childSnap) => {
      const data = childSnap.val();

      if (data.Type === menu.Type) {
        exists = true;
      }
    });

    if (exists) {
      return { ok: false, msg: "Ya existe un menú con ese tipo" };
    }
  }

  // ✅ Si no existe, lo guardamos
  const newRef = push(ref(db, path));
  await set(newRef, menu);

  return { ok: true, msg: "Menú guardado", id: newRef.key };
}

}
