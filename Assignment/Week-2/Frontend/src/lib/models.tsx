export interface Book {
  id: number;
  title: string;
  author: string;
  details: string;
  synopsis: string;
  category: string;
  year: number;
  is_published: boolean;
}

export interface Coffee {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface Order {
  id: number;
  coffee_id: number;
  quantity: number;
  status: string;
  notes: string;
  coffee_name: string;
}
