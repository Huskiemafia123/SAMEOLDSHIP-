export type Page = 'home' | 'services' | 'book' | 'gallery' | 'contact' | 'profile' | 'my-boats';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'engine' | 'electrical' | 'seasonal' | 'trailer';
  image?: string;
  tags?: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'outboard',
    title: 'Outboard Maintenance',
    description: 'Full-service diagnostic and repair for major outboard brands. From 20-hour checks to complete powerhead rebuilds.',
    icon: 'Settings',
    category: 'engine',
    image: 'https://images.unsplash.com/photo-1599256629751-4d7764392661?q=80&w=800&auto=format&fit=crop',
    tags: ['Yamaha', 'Mercury', 'Honda', 'Suzuki']
  },
  {
    id: 'diesel',
    title: 'Diesel Engine Repair',
    description: 'Expert diesel mechanics for propulsion and generators. Fuel system cleaning, cooling system service, and valve adjustments.',
    icon: 'Wrench',
    category: 'engine',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
    tags: ['Inboard Specialty']
  },
  {
    id: 'battery',
    title: 'Battery & Power Systems',
    description: 'Battery bank optimization, smart charger installations, and shore power configurations.',
    icon: 'BatteryCharging',
    category: 'electrical',
    tags: ['Authorized Dealer']
  },
  {
    id: 'nav',
    title: 'Nav Systems & Sonar',
    description: 'Installation and calibration of Garmin, Simrad, and Lowrance systems including NMEA 2000 networking.',
    icon: 'Navigation',
    category: 'electrical',
    tags: ['Calibration Experts']
  },
  {
    id: 'winterization',
    title: 'Winterization',
    description: 'Full protection package: Shrink wrap, oil change, and engine fogging.',
    icon: 'Snowflake',
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'spring',
    title: 'Spring Startup',
    description: 'Complete fluid checks, system testing, and hull detailing for launch day.',
    icon: 'Sun',
    category: 'seasonal',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop'
  }
];
