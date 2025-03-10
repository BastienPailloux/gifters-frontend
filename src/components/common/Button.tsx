import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;

  /* Taille */
  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.sm};
        `;
      case 'large':
        return css`
          padding: ${theme.spacing[3]} ${theme.spacing[6]};
          font-size: ${theme.typography.fontSize.lg};
        `;
      default: // medium
        return css`
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.typography.fontSize.base};
        `;
    }
  }}

  /* Largeur */
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  /* Variantes */
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary.main};
          color: ${theme.colors.secondary.contrastText};
          border: none;

          &:hover, &:focus {
            background-color: ${theme.colors.secondary.dark};
          }

          &:disabled {
            background-color: ${theme.colors.secondary.light};
            opacity: 0.7;
            cursor: not-allowed;
          }
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          border: 1px solid ${theme.colors.primary.main};

          &:hover, &:focus {
            background-color: ${theme.colors.primary.light}20;
          }

          &:disabled {
            color: ${theme.colors.text.disabled};
            border-color: ${theme.colors.text.disabled};
            cursor: not-allowed;
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary.main};
          border: none;
          padding-left: ${theme.spacing[2]};
          padding-right: ${theme.spacing[2]};

          &:hover, &:focus {
            background-color: ${theme.colors.primary.light}10;
          }

          &:disabled {
            color: ${theme.colors.text.disabled};
            cursor: not-allowed;
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.primary.contrastText};
          border: none;

          &:hover, &:focus {
            background-color: ${theme.colors.primary.dark};
          }

          &:disabled {
            background-color: ${theme.colors.primary.light};
            opacity: 0.7;
            cursor: not-allowed;
          }
        `;
    }
  }}

  /* État de chargement */
  ${({ isLoading }) => isLoading && css`
    pointer-events: none;
    opacity: 0.7;

    &::after {
      content: '';
      position: absolute;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-right-color: transparent;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  isLoading = false,
  disabled,
  ...rest
}) => {
  return (
    <ButtonBase
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      disabled={disabled || isLoading}
      {...rest}
    >
      {startIcon && !isLoading && <span className="start-icon">{startIcon}</span>}
      {isLoading ? <span className="sr-only">Chargement...</span> : children}
      {endIcon && !isLoading && <span className="end-icon">{endIcon}</span>}
    </ButtonBase>
  );
};

export default Button;
