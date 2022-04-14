import 'styled-components';
import { ThemeObject } from '@paljs/theme';
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeObject {
    name: 'cosmic' | 'corporate' | 'dark' | 'default';
    sidebarHeaderGap: string;
    gridSize: number;
  }
}
