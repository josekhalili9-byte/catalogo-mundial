export interface Jersey {
  id: string;
  team: string;
  type: 'Local' | 'Visitante' | 'Alternativa';
  price: number;
  imageUrl: string;
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
