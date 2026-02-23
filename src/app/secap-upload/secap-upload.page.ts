import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, uploadBytesResumable, ref as storageRef, } from 'firebase/storage';

@Component({
  selector: 'app-secap-upload',
  templateUrl: './secap-upload.page.html',
  styleUrls: ['./secap-upload.page.scss'],
})
export class SecapUploadPage implements OnInit {
 form: FormGroup;
  file: File | null = null;
  progress = 0;
  fileName = '';

  private storage = getStorage();
  private db = getFirestore();

  constructor(
    private fb: FormBuilder,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      studentName: ['', [Validators.required]],
      studentId: ['', [Validators.required]],
      course: ['', [Validators.required]],
      issuedDate: [new Date().toISOString().substring(0,10), [Validators.required]],
      notes: ['']
    });
  }
  ngOnInit(): void {
  }
  clickDoc(){
    document.getElementById('file')!.click()
  }
ionViewWillEnter() {
    // Desactiva el menú al entrar
    this.menuCtrl.enable(false);
  }
  onFileChange(event: any) {
    const f: File = event.target.files && event.target.files[0];
    if (!f) {
      this.file = null;
      this.fileName = '';
      return;
    }
    if (f.type !== 'application/pdf') {
      this.presentAlert('Por favor selecciona un archivo PDF.');
      this.file = null;
      this.fileName = '';
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (f.size > maxSize) {
      this.presentAlert('El PDF excede el tamaño máximo de 10 MB.');
      this.file = null;
      this.fileName = '';
      return;
    }
    this.file = f;
    this.fileName = f.name;
  }

  async submit() {
    if (!this.form.valid) {
      this.presentAlert('Completa todos los campos requeridos.');
      return;
    }
    if (!this.file) {
      this.presentAlert('Selecciona un archivo PDF.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Subiendo certificado...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // 1. Subir archivo
      const path = `certificados/${this.form.value.studentId}`;
      const timestamp = Date.now();
      const name = `${timestamp}_${this.file.name}`;
      const sRef = storageRef(this.storage, `${path}/${name}`);
      const uploadTask = uploadBytesResumable(sRef, this.file);

      const url: string = await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          snap => {
            this.progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          },
          err => reject(err),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });

      // 2. Guardar metadatos en Firestore
      const col = collection(this.db, 'certificados');
      const metadata = {
        studentName: this.form.value.studentName,
        studentId: this.form.value.studentId,
        course: this.form.value.course,
        issuedDate: this.form.value.issuedDate,
        notes: this.form.value.notes,
        fileUrl: url,
        fileName: this.file.name,
        fileSize: this.file.size,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(col, metadata);

      await loading.dismiss();
      this.presentAlert('Subida completa. ID: ' + docRef.id);

      this.form.reset({ issuedDate: new Date().toISOString().substring(0,10) });
      this.file = null;
      this.fileName = '';
      this.progress = 0;
    } catch (err: any) {
      await loading.dismiss();
      console.error(err);
      this.presentAlert('Error al subir: ' + (err?.message || err));
    }
  }

  async presentAlert(message: string) {
    const a = await this.alertCtrl.create({ header: 'Aviso', message, buttons: ['OK'] });
    await a.present();
  }
}