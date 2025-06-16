import { render, screen } from '@testing-library/react';
import App from '../App';
import { UserProvider } from '../context/UserContext';
import { AssessmentYearProvider } from '../context/AssessmentYearContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <AssessmentYearProvider>{children}</AssessmentYearProvider>
    </UserProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe('App', () => {
  it('renders the dashboard page on the default route', () => {
    customRender(<App />);
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
  });
}); 