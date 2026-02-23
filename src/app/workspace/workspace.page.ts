import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';

type EventType = 'Class'|'Exam'|'Assignment'|'Meeting';

interface PlannerEvent {
  id: string;
  title: string;
  type: EventType;
  start: Date;
  end: Date;
  colorKey?: string;
  dayIndex?: number; // 0..6
  conflict?: boolean;
}
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.page.html',
  styleUrls: ['./workspace.page.scss'],
})
export class WorkspacePage implements OnInit {
 viewMode: 'week'|'month' = 'week';
  weekStart: Date;
  weekDays: { date: Date, label: string }[] = [];
  weekLabel = '';

  hours: string[] = [];
  events: PlannerEvent[] = [];
  filters = { showClasses:true, showExams:true, showAssignments:true };
  visibleEvents: PlannerEvent[] = [];

  constructor(private alertCtrl: AlertController,private menu: MenuController,) {
    this.weekStart = this.getStartOfWeek(new Date());
  }

  ngOnInit(): void {
    // hours labels (24h)
     this.menu.enable(false);
    for (let h=0; h<24; h++){
      const hh = (h % 24).toString().padStart(2,'0') + ':00';
      this.hours.push(hh);
    }
    this.buildWeek();
    this.seedDemo();
    this.recompute();
  }

  // ---------- week helpers ----------
  getStartOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1 - day); // monday start
    date.setDate(date.getDate() + diff);
    date.setHours(0,0,0,0);
    return date;
  }

  buildWeek(){
    const arr = [];
    for (let i=0;i<7;i++){
      const dt = new Date(this.weekStart);
      dt.setDate(this.weekStart.getDate() + i);
      arr.push({ date: dt, label: dt.toLocaleDateString(undefined, { weekday: 'short' }) });
    }
    this.weekDays = arr;
    const end = new Date(this.weekStart);
    end.setDate(this.weekStart.getDate() + 6);
    this.weekLabel = `${this.weekStart.toLocaleDateString()} — ${end.toLocaleDateString()}`;
  }

  prevWeek(){ this.weekStart.setDate(this.weekStart.getDate() - 7); this.weekStart = new Date(this.weekStart); this.buildWeek(); this.recompute(); }
  nextWeek(){ this.weekStart.setDate(this.weekStart.getDate() + 7); this.weekStart = new Date(this.weekStart); this.buildWeek(); this.recompute(); }

  // ---------- demo data ----------
  seedDemo(){
    const mk = (title:string, dayOffset:number, sh:number, eh:number, type:EventType) => {
      const s = new Date(this.weekStart); s.setDate(s.getDate() + dayOffset); s.setHours(sh,0,0,0);
      const e = new Date(this.weekStart); e.setDate(e.getDate() + dayOffset); e.setHours(eh,0,0,0);
      return {
        id: Math.random().toString(36).slice(2,9),
        title, type, start: s, end: e, colorKey: type
      } as PlannerEvent;
    };
    this.events = [
      mk('Math Exam', 0, 8, 10, 'Exam'),
      mk('Programming Class', 1, 10, 13, 'Class'),
      mk('Project Review', 2, 9, 11, 'Assignment'),
      mk('Team Meeting', 4, 14, 16, 'Meeting'),
      mk('English Class', 3, 8, 9, 'Class'),
      mk('Midterm', 2, 10, 12, 'Exam'),
    ];
  }

  // ---------- filtering & conflict detection ----------
  recompute(){
    // apply week / filters then detect conflicts
    // assign dayIndex
    this.events.forEach(ev => {
      const di = Math.floor((ev.start.getTime() - this.weekStart.getTime()) / (1000*60*60*24));
      ev.dayIndex = Math.max(0, Math.min(6, di));
      ev.conflict = false;
    });

    // filter by user selection
    this.visibleEvents = this.events.filter(ev => {
      if (ev.type === 'Class' && !this.filters.showClasses) return false;
      if (ev.type === 'Exam' && !this.filters.showExams) return false;
      if (ev.type === 'Assignment' && !this.filters.showAssignments) return false;
      return true;
    });

    // detect conflicts per day (overlap)
    const byDay: {[k:number]: PlannerEvent[]} = {};
    this.visibleEvents.forEach(ev => {
      byDay[ev.dayIndex!] = byDay[ev.dayIndex!] || [];
      byDay[ev.dayIndex!].push(ev);
    });

    Object.keys(byDay).forEach(k => {
      const list = byDay[+k];
      list.sort((a,b) => a.start.getTime() - b.start.getTime());
      for (let i=0;i<list.length;i++){
        for (let j=i+1;j<list.length;j++){
          const a = list[i], b = list[j];
          if (a.end > b.start && a.start < b.end) {
            a.conflict = true; b.conflict = true;
          }
        }
      }
    });
  }

  // ---------- positioning helpers (for CSS inline styles) ----------
  // left percent of the event column (0..100)
  getEventColumnLeft(ev: PlannerEvent) {
    const colWidth = 100 / 7;
    return (ev.dayIndex! * colWidth) +  (colWidth * 0.02); // small left padding inside column
  }
  getColWidth() {
    return (100 / 7) - (100 / 7) * 0.04; // small gap between columns
  }

  // top percent inside timeline (0..100) based on start hour / 24
  getEventTop(ev: PlannerEvent) {
    const startHour = ev.start.getHours() + ev.start.getMinutes() / 60;
    const pct = (startHour / 24) * 100;
    return pct;
  }
  getEventHeight(ev: PlannerEvent) {
    const start = ev.start.getHours() + ev.start.getMinutes() / 60;
    const end = ev.end.getHours() + ev.end.getMinutes() / 60;
    const dur = Math.max(0.25, end - start); // min show 15 min
    const pct = (dur / 24) * 100;
    return pct;
  }

  getEventBg(ev: PlannerEvent) {
    // pastel mapping
    switch(ev.type) {
      case 'Class': return 'linear-gradient(180deg,#fff1ef,#fffefc)';
      case 'Exam': return 'linear-gradient(180deg,#e6fdff,#f9ffff)';
      case 'Assignment': return 'linear-gradient(180deg,#f6f3ff,#fffbff)';
      case 'Meeting': return 'linear-gradient(180deg,#eafff0,#f9fff8)';
      default: return '#ffffff';
    }
  }

  // ---------- Add / Edit via Ion Alert (simple) ----------
  async openAddEventAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Add Event',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Title' },
        { name: 'type', type: 'text', placeholder: 'Type (Class/Exam/Assignment/Meeting)', value: 'Class' },
        { name: 'date', type: 'date', value: this.weekStart.toISOString().slice(0,10) },
        { name: 'start', type: 'time', value: '09:00' },
        { name: 'end', type: 'time', value: '10:00' },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Save', handler: (res) => {
            if (!res.title || !res.date || !res.start || !res.end) return ;
            const s = new Date(res.date + 'T' + res.start);
            const e = new Date(res.date + 'T' + res.end);
            if (e <= s) return ;
            const di = Math.floor((s.getTime() - this.weekStart.getTime())/(1000*60*60*24));
            const ev: PlannerEvent = {
              id: Math.random().toString(36).slice(2,9),
              title: res.title,
              type: (res.type as EventType) || 'Class',
              start: s, end: e, colorKey: res.type
            };
            this.events.push(ev);
            this.recompute();
          }
        }
      ]
    });
    await alert.present();
  }

  async openEditAlert(ev: PlannerEvent) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Event',
      inputs: [
        { name: 'title', type: 'text', value: ev.title },
        { name: 'type', type: 'text', value: ev.type },
        { name: 'date', type: 'date', value: ev.start.toISOString().slice(0,10) },
        { name: 'start', type: 'time', value: ev.start.toTimeString().slice(0,5) },
        { name: 'end', type: 'time', value: ev.end.toTimeString().slice(0,5) },
      ],
      buttons: [
        { text:'Delete', role:'destructive', handler: () => {
            this.events = this.events.filter(x => x.id !== ev.id);
            this.recompute();
          }
        },
        { text:'Cancel', role:'cancel' },
        { text:'Save', handler: (res) => {
            if (!res.title || !res.date || !res.start || !res.end) return ;
            const s = new Date(res.date + 'T' + res.start);
            const e = new Date(res.date + 'T' + res.end);
            if (e <= s) return;
            ev.title = res.title;
            ev.type = res.type;
            ev.start = s; ev.end = e;
            this.recompute();
          }
        }
      ]
    });
    await alert.present();
  }
}