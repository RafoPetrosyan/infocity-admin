'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  const resolvedColor = color === 'light' ? 'var(--mui-palette-common-white)' : 'var(--mui-palette-text-primary)';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: resolvedColor,
        fontWeight: 800,
        letterSpacing: '0.3px',
        lineHeight: 1,
        fontSize: `${height}px`,
        // width kept to preserve layout spacing where previous image width was used
        minWidth: width,
      }}
    >
      Infocity admin
    </Box>
  );
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
