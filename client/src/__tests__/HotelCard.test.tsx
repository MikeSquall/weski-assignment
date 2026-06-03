import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HotelCard } from '../components/HotelCard';
import { useSearchStore } from '../store/searchStore';
import { Hotel } from '../types/hotel';

const hotel: Hotel = {
  hotelCode: 'TEST001',
  hotelName: 'Chalet Test',
  mainImage: 'https://example.com/img.jpg',
  images: ['https://example.com/img.jpg'],
  rating: 4,
  beds: 3,
  skiLiftDistance: '250m',
  cityCenterDistance: '100m',
  priceAfterTax: 350,
  priceBeforeTax: 315,
  groupSize: 2,
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

  it('renders price after tax', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText(/£350/)).toBeInTheDocument();
  });

  it('renders per person label', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText('per person')).toBeInTheDocument();
  });

  it('renders beds and group size info', () => {
    render(<HotelCard hotel={hotel} />);
    expect(screen.getByText(/3 beds/)).toBeInTheDocument();
    expect(screen.getByText(/room for 2/)).toBeInTheDocument();
  });

  it('shows image skeleton while image is loading', () => {
    render(<HotelCard hotel={hotel} />);
    // Image src is set but onLoad hasn't fired in jsdom → skeleton visible
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows no-image placeholder when mainImage is empty', () => {
    render(<HotelCard hotel={{ ...hotel, mainImage: '' }} />);
    expect(screen.getByText('No image')).toBeInTheDocument();
  });
});
