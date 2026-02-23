import { Injectable, NgZone } from '@angular/core';

declare var luxon: any;

import { getDatabase, ref, child, update, get, serverTimestamp } from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class FechaService {
  handle: any;
  fecha: any;
  bustedDate: any;
  fechacompare: any;
  bustedDatecompare: any;

  constructor(public zone: NgZone) {}

  async serverHour() {
    this.bustedDate = new Date();
    const yyyy = this.bustedDate.getFullYear();
    let mm: any = this.bustedDate.getMonth() + 1; // Months start at 0!
    let dd: any = this.bustedDate.getDate();

    let hr: any = this.bustedDate.getHours();
    let min: any = this.bustedDate.getMinutes();
    let sec: any = this.bustedDate.getSeconds();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    if (sec < 10) sec = '0' + sec;
    if (min < 10) min = '0' + min;
    if (hr < 10) hr = '0' + hr;

    const formattedToday = yyyy + '-' + mm + '-' + dd;
    const formattedhora = hr + ':' + min + ':' + sec;
    this.bustedDate = formattedToday + ' & ' + formattedhora;

    console.log(this.bustedDate);

    this.bustedDatecompare = this.bustedDate.substring(0, this.bustedDate.length - 4);

    try {
      const db = getDatabase();
      const keyTemporal = localStorage.getItem('KeyTemporal') || '';
      const userUID = localStorage.getItem('UID') || '';
      const userIP = localStorage.getItem('IP') || '';

      const refDateService = ref(db, `DateService/${keyTemporal}`);

      // Actualizamos con serverTimestamp usando update
      await update(refDateService, {
        User: userUID,
        Ts: serverTimestamp(),
        IP: userIP,
      });

      const snapshot = await get(refDateService);
      const res = snapshot.val();
      console.log(res);

      if (res && res.Ts) {
        const timestamp = res.Ts;
        localStorage.setItem('TIMESTAMP', timestamp.toString());

        this.fecha = new Date(timestamp);
        let yyyyF = this.fecha.getFullYear();
        let mmF: any = this.fecha.getMonth() + 1;
        let ddF: any = this.fecha.getDate();

        let hrF: any = this.fecha.getHours();
        let minF: any = this.fecha.getMinutes();
        let secF: any = this.fecha.getSeconds();

        if (ddF < 10) ddF = '0' + ddF;
        if (mmF < 10) mmF = '0' + mmF;
        if (secF < 10) secF = '0' + secF;
        if (minF < 10) minF = '0' + minF;
        if (hrF < 10) hrF = '0' + hrF;

        console.log(this.fecha);
        const formattedTodayF = yyyyF + '-' + mmF + '-' + ddF;
        const formattedhoraF = hrF + ':' + minF + ':' + secF;
        this.fecha = formattedTodayF + ' & ' + formattedhoraF;

        this.fechacompare = this.fecha.substring(0, this.fecha.length - 4);
        console.log(this.fechacompare);

        if (this.fechacompare === this.bustedDatecompare) {
          console.log('Time is normal');
        } else {
          console.log('Problems with the time');
        }
      }
    } catch (err) {
      console.error(err);
    }

    return this.fecha;
  }

  getDateMexico() {
    const luxontime = luxon.DateTime.now().setZone("America/Monterrey");
    console.log(luxontime.toFormat("y-MM-dd"));
    const luxonTimeFinal = luxontime.toFormat("y-MM-dd").toString();

    console.log("serverTimestamp is not used here but original code logged:", serverTimestamp());

    return luxonTimeFinal;
  }

  getHoraMexico() {
    const luxontime = luxon.DateTime.now().setZone("America/Monterrey");
    const luxonTimeFinal = luxontime.toFormat("HH:mm").toString();
    console.log(luxonTimeFinal);

    return luxonTimeFinal;
  }
}
