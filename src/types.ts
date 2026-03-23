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
  department: string;
  number: string;
  playerName: string;
  status: 'Pendiente' | 'Entregado';
  createdAt: number;
}
