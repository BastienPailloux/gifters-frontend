// src/components/dashboard/__tests__/DashboardChatInput.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DashboardChatInput from '../DashboardChatInput';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardChatInput', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders an input and submit button', () => {
    render(<MemoryRouter><DashboardChatInput /></MemoryRouter>);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('disables submit when input is empty', () => {
    render(<MemoryRouter><DashboardChatInput /></MemoryRouter>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('navigates to /chat with initialMessage on submit', async () => {
    render(<MemoryRouter><DashboardChatInput /></MemoryRouter>);
    await userEvent.type(screen.getByRole('textbox'), 'Quels sont mes cadeaux ?');
    await userEvent.click(screen.getByRole('button'));
    expect(mockNavigate).toHaveBeenCalledWith('/chat', {
      state: { initialMessage: 'Quels sont mes cadeaux ?' },
    });
  });

  it('does not navigate with empty input', async () => {
    render(<MemoryRouter><DashboardChatInput /></MemoryRouter>);
    await userEvent.click(screen.getByRole('button'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
