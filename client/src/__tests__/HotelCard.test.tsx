import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HotelCard } from '../components/HotelCard';
import { useSearchStore } from '../store/searchStore';
import { AggregatedHotel } from '../types/hotel';

const hotel: AggregatedHotel = {
  hotelCode: 'TEST001',
  hotelName: 'Chalet Test',
  mainImage: 'https://example.com/img.jpg',
  images: ['https://example.com/img.jpg'],
  rating: 4,
  skiLiftDistance: '250m',
  cityCenterDistance: '100m',
  lowestPrice: 300,
  options: [
    { groupSize: 2, beds: 2, priceAfterTax: 300, priceBeforeTax: 270 },
    { groupSize: 3, beds: 3, priceAfterTax: 350, priceBeforeTax: 315 },
    { groupSize: 4, beds: 4, priceAfterTax: 400, priceBeforeTax: 360 },
  ],
};

describe('HotelCard', () => {
  beforeEach(() => {
    useSearchStore.setState({ skiSite: 4 }); // La Plagne
  });

  it('renders the hotel name', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText('Chalet Test')).toBeInTheDocument();
  });

  it('renders exactly 5 star characters', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getAllByText('★')).toHaveLength(5);
  });

  it('renders the resort name from store skiSite', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText('La Plagne')).toBeInTheDocument();
  });

  it('renders ski lift distance', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText(/250m to ski lift/)).toBeInTheDocument();
  });

  it('renders city center distance', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText(/100m to center/)).toBeInTheDocument();
  });

  it('renders a pill for each room option', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText('2 people')).toBeInTheDocument();
    expect(screen.getByText('3 people')).toBeInTheDocument();
    expect(screen.getByText('4 people')).toBeInTheDocument();
  });

  it('renders the price for each option', () => {
    render(<HotelCard hotel={hotel} />);
    // €300 appears in both the pill and the summary; €350 and €400 only in pills
    expect(screen.getAllByText('€300').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('€350')).toBeInTheDocument();
    expect(screen.getByText('€400')).toBeInTheDocument();
  });

  it('renders the lowest price as the summary price with a "from" label', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText('from')).toBeInTheDocument();
    expect(screen.getAllByText('€300').length).toBeGreaterThanOrEqual(1);
  });

  it('renders per person label', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText('per person')).toBeInTheDocument();
  });

  it('shows image skeleton while image is loading', () => {
    render(<HotelCard hotel={hotel} />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows no-image placeholder when mainImage is empty', () => {
    render(<HotelCard hotel={{ ...hotel, mainImage: '' }} />);
    expect(screen.getByText('No image')).toBeInTheDocument();
  });
});
