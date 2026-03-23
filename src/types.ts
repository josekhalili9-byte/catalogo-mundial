export interface Jersey {
  id: string;
  team: string;
  type: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export interface Order {
  id: string;
  jerseyId: string;
  team: string;
  type: string;
  price: number;
  customerName: string;
  phone: string;
  department?: string;
  gender: 'Hombre' | 'Mujer' | 'Niño';
  size: string;
  number: string;
  playerName: string;
  isSigned?: boolean;
  signedPlayer?: string;
  status: 'Pendiente' | 'Entregado';
  createdAt: number;
}

export interface AppSettings {
  showSelecciones: boolean;
  showClubes: boolean;
  showEdicionesEspeciales: boolean;
}
