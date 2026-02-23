import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { doc, setDoc, getDoc, onSnapshot, getFirestore } from '@angular/fire/firestore';

export interface FlowNode {
  id: string;
  title: string;
  subtitle?: string;
  color?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface FlowData {
  nodes: FlowNode[];
  links: { from: string; to: string }[];
}

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
})
export class FlowComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;

  businessId = "toyama";       // <-- dinámico si quieres
  flowId = "default";          // <-- documento fijo
  flowDocRef: any;

  nodes: FlowNode[] = [];
  links: { from: string; to: string }[] = [];

  selectedNodeId: string | null = null;
  dragNodeId: string | null = null;
  dragOffset = { x: 0, y: 0 };

  showNodeMenu = false;
  menuPos = { x: 0, y: 0 };

  connectOrigin: FlowNode | null = null;

  constructor(
    private alertCtrl: AlertController,
  ) {}

  // -----------------------------------------------------
  // INIT – Firestore listener realtime
  // -----------------------------------------------------
  async doMenuAction(action: string, node: FlowNode) {
  switch (action) {

    case 'rename':
      await this.editNode(node);
      break;

    case 'duplicate':
      this.duplicateNode(node);
      break;

    case 'copy':
      this.copyNode(node);
      break;

    case 'delete':
      this.deleteNode(node);
      break;

    case 'connect':
      this.prepareConnection(node);
      break;

    case 'add-step':
      this.nodes.push({
        id: this.genId(),
        title: 'New Step',
        subtitle: '',
        color: '#2dd36f',
        x: node.x + 260,
        y: node.y,
        width: 220,
        height: 56
      });
      this.saveToFirestore();
      break;

    case 'parallel-flow':
      this.nodes.push({
        id: this.genId(),
        title: 'Parallel Flow',
        subtitle: '',
        color: '#5856d6',
        x: node.x,
        y: node.y + 120,
        width: 240,
        height: 56
      });
      this.saveToFirestore();
      break;

    case 'go-to':
      alert('Go To action');
      break;

    case 'merge-flow':
      alert('Merge Flow action');
      break;
  }

  this.hideNodeMenu();
}
 firestore: any =  getFirestore()
  ngOnInit() {
    this.flowDocRef = doc(this.firestore, `flows/${this.businessId}/flowData/${this.flowId}`);

    onSnapshot(this.flowDocRef, (snap:any) => {
      if (snap.exists()) {
        const data = snap.data() as FlowData;
        this.nodes = data.nodes ?? [];
        this.links = data.links ?? [];
      } else {
        this.loadDefaultFlow();
      }
    });
  }

  // -----------------------------------------------------
  // DEFAULT LOCAL FLOW
  // -----------------------------------------------------

  getConnectionPoint(from: FlowNode, to: FlowNode) {
  const fx = from.x;
  const fy = from.y;
  const fw = from.width!;
  const fh = from.height!;

  const tx = to.x;
  const ty = to.y;
  const tw = to.width!;
  const th = to.height!;

  const fromCenter = { x: fx + fw / 2, y: fy + fh / 2 };
  const toCenter = { x: tx + tw / 2, y: ty + th / 2 };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  // Decidir si conectar por lados o por arriba/abajo
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let start = { x: 0, y: 0 };
  let end = { x: 0, y: 0 };

  // Conectar horizontalmente (izquierda/derecha)
  if (absDx > absDy) {
    if (dx > 0) {
      // conectar lado derecho del FROM
      start = { x: fx + fw, y: fromCenter.y };
      // conectar lado izquierdo del TO
      end = { x: tx, y: toCenter.y };
    } else {
      // conectar lado izquierdo del FROM
      start = { x: fx, y: fromCenter.y };
      // conectar lado derecho del TO
      end = { x: tx + tw, y: toCenter.y };
    }
  } 
  // Conectar verticalmente (arriba/abajo)
  else {
    if (dy > 0) {
      // from bottom → to top
      start = { x: fromCenter.x, y: fy + fh };
      end = { x: toCenter.x, y: ty };
    } else {
      // from top → to bottom
      start = { x: fromCenter.x, y: fy };
      end = { x: toCenter.x, y: ty + th };
    }
  }

  return { start, end };
}


  loadDefaultFlow() {
    this.nodes = [
      { id: this.genId(), title: 'Start Flow', subtitle: '', color: '#7f5af0', x: 380, y: 20, width: 160, height: 48 },
      { id: this.genId(), title: 'Instance', subtitle: 'AB2 Instance', color: '#ff3b30', x: 360, y: 110, width: 220, height: 56 },
      { id: this.genId(), title: 'Review Case', subtitle: 'Assigned to Requester\'s manager', color: '#ffcc00', x: 340, y: 200, width: 320, height: 56 },
      { id: this.genId(), title: 'Step', subtitle: 'An example action', color: '#2dd36f', x: 60, y: 360, width: 220, height: 56 },
      { id: this.genId(), title: 'Approved Status', subtitle: 'Email Requesters', color: '#007aff', x: 520, y: 360, width: 280, height: 56 }
    ];
    this.links = [];
    this.saveToFirestore();
  }

  // -----------------------------------------------------
  // SAVE TO FIRESTORE
  // -----------------------------------------------------
  async saveToFirestore() {
    await setDoc(this.flowDocRef, {
      nodes: this.nodes,
      links: this.links
    } as FlowData);
  }

  // -----------------------------------------------------
  // UTILS
  // -----------------------------------------------------
  genId() {
    return Math.random().toString(36).substring(2, 10);
  }

  get selectedNode(): FlowNode | null {
    return this.nodes.find(n => n.id === this.selectedNodeId) ?? null;
  }

  // -----------------------------------------------------
  // DRAGGING
  // -----------------------------------------------------
  onNodeMouseDown(e: MouseEvent, node: FlowNode) {
    e.stopPropagation();
    this.dragNodeId = node.id;

    this.dragOffset.x = e.clientX - node.x;
    this.dragOffset.y = e.clientY - node.y;

    window.addEventListener('mousemove', this.windowMouseMove);
    window.addEventListener('mouseup', this.windowMouseUp);
  }

  windowMouseMove = (ev: MouseEvent) => {
    if (!this.dragNodeId) return;

    const node = this.nodes.find(n => n.id === this.dragNodeId);
    if (!node) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();

    node.x = ev.clientX - rect.left - this.dragOffset.x;
    node.y = ev.clientY - rect.top - this.dragOffset.y;

    node.x = Math.max(0, node.x);
    node.y = Math.max(0, node.y);
  };

  windowMouseUp = () => {
    if (this.dragNodeId) this.saveToFirestore();
    this.dragNodeId = null;

    window.removeEventListener('mousemove', this.windowMouseMove);
    window.removeEventListener('mouseup', this.windowMouseUp);
  };

  // -----------------------------------------------------
  // CRUD Nodes
  // -----------------------------------------------------
  async addNodeAt(pos?: { x: number; y: number }) {
    const alert = await this.alertCtrl.create({
      header: 'Agregar nodo',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título', value: 'Nuevo Nodo' },
        { name: 'subtitle', type: 'text', placeholder: 'Subtítulo', value: '' },
        { name: 'color', type: 'text', placeholder: 'Color hex', value: '#8e8e93' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: (data) => {
            this.nodes.push({
              id: this.genId(),
              title: data.title,
              subtitle: data.subtitle,
              color: data.color,
              x: pos?.x ?? 120,
              y: pos?.y ?? 120,
              width: 220,
              height: 56,
            });
            this.saveToFirestore();
          }
        }
      ]
    });

    await alert.present();
  }

  async editNode(node: FlowNode) {
    const alert = await this.alertCtrl.create({
      header: 'Editar nodo',
      inputs: [
        { name: 'title', type: 'text', value: node.title },
        { name: 'subtitle', type: 'text', value: node.subtitle },
        { name: 'color', type: 'text', value: node.color }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            node.title = data.title;
            node.subtitle = data.subtitle;
            node.color = data.color;
            this.saveToFirestore();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteNode(node: FlowNode) {
    this.nodes = this.nodes.filter(n => n.id !== node.id);
    this.links = this.links.filter(l => l.from !== node.id && l.to !== node.id);
    this.saveToFirestore();
  }

  duplicateNode(node: FlowNode) {
    this.nodes.push({
      ...node,
      id: this.genId(),
      x: node.x + 40,
      y: node.y + 40,
      title: node.title + ' (copy)'
    });
    this.saveToFirestore();
  }

  copyNode(node: FlowNode) {
    navigator.clipboard?.writeText(JSON.stringify(node));
  }

  // -----------------------------------------------------
  // MENU + CONNECTIONS
  // -----------------------------------------------------
  onNodeClick(e: MouseEvent, node: FlowNode) {
    e.stopPropagation();

    if (this.connectOrigin && this.connectOrigin.id !== node.id) {
      this.links.push({ from: this.connectOrigin.id, to: node.id });
      this.connectOrigin = null;
      this.saveToFirestore();
      return;
    }

    this.selectedNodeId = node.id;
    this.menuPos = { x: e.clientX, y: e.clientY };
    this.showNodeMenu = true;
  }

  hideNodeMenu() {
    this.showNodeMenu = false;
  }

  prepareConnection(node: FlowNode) {
    this.connectOrigin = node;
    alert('Ahora haz click en el nodo destino para conectar');
  }

  // -----------------------------------------------------
  // CANVAS EVENTS
  // -----------------------------------------------------
  onCanvasClick() {
    this.selectedNodeId = null;
    this.showNodeMenu = false;
  }

  onCanvasDblClick(e: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.addNodeAt({
      x: e.clientX - rect.left - 120,
      y: e.clientY - rect.top - 28
    });
  }

  // -----------------------------------------------------
  // GEOMETRY HELPERS
  // -----------------------------------------------------
  getNodeById(id: string) {
    return this.nodes.find(n => n.id === id)!;
  }

  getNodeCenter(id: string) {
    const n = this.getNodeById(id);
    return { x: n.x + n.width! / 2, y: n.y + n.height! / 2 };
  }

  getNodeTop(id: string) {
    const n = this.getNodeById(id);
    return { x: n.x + n.width! / 2, y: n.y };
  }

  getNodeBottom(id: string) {
    const n = this.getNodeById(id);
    return { x: n.x + n.width! / 2, y: n.y + n.height! };
  }
}
