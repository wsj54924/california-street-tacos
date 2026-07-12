export interface MenuItem {
  id: string;
  name: string;
  category: 'tacos' | 'burritos' | 'mains' | 'drinks';
  price: number;
  description: string;
  image: string;
  customizable: boolean;
  defaultOptions?: {
    meats?: string[];
    styles?: string[];
  };
}

export interface CustomizationOptions {
  selectedMeat?: string;
  selectedStyle?: string;
  extras: {
    guacamole: boolean;
    sourCream: boolean;
    extraCheese: boolean;
    grilledJalapeno: boolean;
  };
  specialInstructions: string;
}

export interface CartItem {
  id: string; // unique cart item id (combines menu item + options)
  menuItem: MenuItem;
  customization: CustomizationOptions;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'received' | 'preparing' | 'cooking' | 'ready' | 'completed';
  customerName: string;
  customerPhone: string;
  serviceType: 'pickup' | 'delivery';
  address?: string;
  createdAt: string;
}
