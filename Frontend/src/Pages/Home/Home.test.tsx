// Home.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Home } from './Home'; // Update the path according to your structure
import HomePage from "../../Component/HomePage/HomePage";

// Mock the HomePage component since it’s a child component
vi.mock('../../Component/HomePage/HomePage', () => ({
  __esModule: true,
  default: () => <div>HomePage Component</div>,
}));

describe('Home Component', () => {
  it('renders the HomePage component', () => {
    render(<Home />);

    // Check if the HomePage component is rendered
    expect(screen.getByText('HomePage Component')).toBeInTheDocument();
  });

});
