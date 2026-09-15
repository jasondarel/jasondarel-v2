'use client';

import React, { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

export type ButtonVariant = 'default' | 'accent' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode | boolean;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonAsButtonProps = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonAsAnchorProps = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    target?: string;
    rel?: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

const SIZE_STYLES: Record<ButtonSize, { container: string; icon: string; rightIcon: string; text: string }> = {
  xs: {
    container: 'px-2.5 py-1 text-[10px] gap-1.5',
    icon: 'w-2.5 h-2.5',
    rightIcon: 'w-2.5 h-2.5',
    text: 'text-[10px] font-semibold tracking-tight',
  },
  sm: {
    container: 'px-3 py-1.5 text-xs gap-2',
    icon: 'w-3.5 h-3.5',
    rightIcon: 'w-3 h-3',
    text: 'text-xs font-medium tracking-tight',
  },
  md: {
    container: 'px-4 py-2.5 sm:px-5 sm:py-3 text-sm gap-2.5',
    icon: 'w-4 h-4 sm:w-5 sm:h-5',
    rightIcon: 'w-3.5 h-3.5',
    text: 'text-sm font-medium tracking-tight',
  },
  lg: {
    container: 'px-6 py-3.5 sm:px-7 sm:py-4 text-base gap-3',
    icon: 'w-5 h-5 sm:w-6 sm:h-6',
    rightIcon: 'w-4 h-4',
    text: 'text-base font-semibold tracking-tight',
  },
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default:
    'bg-surface-1 border-border text-foreground hover:bg-surface-2 hover:border-accent hover:text-accent active:bg-surface-3 active:scale-[0.97] active:translate-y-0',
  accent:
    'bg-surface-2 border-accent text-accent hover:bg-surface-3 hover:border-accent active:bg-surface-1 active:scale-[0.97] active:translate-y-0 shadow-xs',
  ghost:
    'bg-transparent border-transparent text-foreground hover:bg-surface-1 hover:border-border hover:text-accent active:bg-surface-2 active:scale-[0.97] active:translate-y-0',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const sizeConfig = SIZE_STYLES[size];
    const variantConfig = VARIANT_STYLES[variant];

    // Determine right icon element
    let renderedRightIcon: React.ReactNode = null;
    if (rightIcon === true) {
      renderedRightIcon = (
        <ArrowUpRight
          className={`${sizeConfig.rightIcon} transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-70 group-hover:opacity-100`}
          aria-hidden="true"
        />
      );
    } else if (rightIcon) {
      renderedRightIcon = rightIcon;
    }

    const baseClasses = `
      group inline-flex items-center justify-center rounded-full border transition-all duration-200 ease-out
      hover:-translate-y-0.5 cursor-pointer select-none no-underline
      disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
      ${variantConfig} ${sizeConfig.container} ${className}
    `.trim();

    const innerContent = (
      <>
        {leftIcon && (
          <span className="inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-110 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        {children && <span className={`${sizeConfig.text} flex-shrink-0`}>{children}</span>}
        {renderedRightIcon && (
          <span className="inline-flex items-center justify-center flex-shrink-0">{renderedRightIcon}</span>
        )}
      </>
    );

    if ('href' in props && props.href !== undefined) {
      const { href, target = '_blank', rel = 'noopener noreferrer', onClick, style, ...anchorProps } = props as ButtonAsAnchorProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={target === '_blank' ? rel : undefined}
          className={baseClasses}
          style={style}
          onClick={onClick}
          {...anchorProps}
        >
          {innerContent}
        </a>
      );
    }

    const { type = 'button', onClick, disabled, style, ...buttonProps } = props as ButtonAsButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={baseClasses}
        style={style}
        onClick={onClick}
        {...buttonProps}
      >
        {innerContent}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
