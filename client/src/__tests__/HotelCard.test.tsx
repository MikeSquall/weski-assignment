import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HotelCard } from '../components/HotelCard';
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
  it('renders the hotel name', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText('Chalet Test')).toBeInTheDocument();
  });

  it('renders exactly 5 star characters', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getAllByText('★')).toHaveLength(5);
  });

  it('renders the resort name from the skiSite prop', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText('La Plagne')).toBeInTheDocument();
  });

  it('renders a different resort when skiSite changes', () => {
    render(<HotelCard hotel={hotel} skiSite={1} />);
    expect(screen.getByText('Val Thorens')).toBeInTheDocument();
  });

  it('renders ski lift distance', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText(/250m to ski lift/)).toBeInTheDocument();
  });

  it('renders city center distance', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText(/100m to center/)).toBeInTheDocument();
  });

  it('renders a pill for each room option', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText(/up to 2 people/)).toBeInTheDocument();
    expect(screen.getByText(/up to 3 people/)).toBeInTheDocument();
    expect(screen.getByText(/up to 4 people/)).toBeInTheDocument();
  });

  it('renders the price for each option', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getAllByText(/€300/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/€350/)).toBeInTheDocument();
    expect(screen.getByText(/€400/)).toBeInTheDocument();
  });

  it('renders the lowest price as the summary price with a "from" label', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText('from')).toBeInTheDocument();
    expect(screen.getAllByText(/€300/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders per person label', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(screen.getByText('per person')).toBeInTheDocument();
  });

  it('shows image skeleton while image is loading', () => {
    render(<HotelCard hotel={hotel} skiSite={4} />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows no-image placeholder when mainImage is empty', () => {
    render(<HotelCard hotel={{ ...hotel, mainImage: '' }} skiSite={4} />);
    expect(screen.getByText('No image')).toBeInTheDocument();
  });
});
