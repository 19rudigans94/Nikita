export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  pricePerDay: number;
  platform: GamePlatform;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalOrder {
  id?: string;
  name: string;
  phone: string;
  games: Game[];
  duration: number;
  status?: RentalStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type GamePlatform = 'PS5' | 'Xbox Series X' | 'Nintendo Switch';

export type RentalStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface AuthState {
  isAdmin: boolean;
  loading: boolean;
  login: (password: string, isInitialSetup?: boolean) => Promise<void>;
  logout: () => void;
  checkInitialSetup: () => Promise<boolean>;
}