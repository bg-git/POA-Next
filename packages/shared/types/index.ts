// Shared types for POA monorepo

export interface Location {
  _id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  google_calendar_id?: string;
  apple_calendar_url?: string;
  default_duration: number;
  default_buffer: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Customer {
  _id: string;
  id: string; // Shopify customer ID
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: {
    country?: string;
    state?: string;
    city?: string;
    street?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

export interface Appointment {
  _id: string;
  dateTime: Date;
  start_time: string; // formatted as 'YYYY-MM-DD hh:mm A'
  end_time: string;
  customerId: string;
  locationId: string;
  orderId: string;
  orderNumber: string;
  qty: number;
  price: string;
  customer?: Customer;
  location?: Location;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Availability {
  _id: string;
  locationId: string;
  dow: string; // day of week or date string for overrides
  order: number;
  type: 'dow' | 'date';
  available: boolean;
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  slots: number;
}

export interface Settings {
  _id: string;
  locationId: string;
  duration: number; // minutes
  buffer: number; // minutes
}

export interface BookingSlot {
  start_time: string;
  end_time: string;
  slots: number;
}

export interface AvailabilityResponse {
  date: string;
  available: boolean;
  spots: BookingSlot[];
  disabled: boolean[];
  disabledDates: string[];
  days: string[];
}
