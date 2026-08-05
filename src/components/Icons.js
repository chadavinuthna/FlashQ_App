import React from 'react';
import Svg, { Path, Rect, Circle, Line, Polygon } from 'react-native-svg';

export default function Icon({ name, size = 20, color = 'currentColor' }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (name) {
    case 'home':
      return (
        <Svg {...props}>
          <Path d="M4 11.5 12 4l8 7.5" />
          <Path d="M6 10v9h12v-9" />
          <Path d="M10 19v-5h4v5" />
        </Svg>
      );
    case 'orders':
      return (
        <Svg {...props}>
          <Rect x="5" y="4" width="14" height="17" rx="2" />
          <Path d="M9 9h6M9 13h6M9 17h4" />
        </Svg>
      );
    case 'print':
      return (
        <Svg {...props}>
          <Rect x="6" y="9" width="12" height="7" rx="1" />
          <Path d="M8 9V4h8v5" />
          <Path d="M8 17v3h8v-3" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...props}>
          <Path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
          <Path d="M10 18a2 2 0 0 0 4 0" />
        </Svg>
      );
    case 'user':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="8" r="3.5" />
          <Path d="M5 20c0-4 3-6 7-6s7 2 7 6" />
        </Svg>
      );
    case 'cart':
      return (
        <Svg {...props}>
          <Circle cx="9" cy="20" r="1.4" />
          <Circle cx="17" cy="20" r="1.4" />
          <Path d="M3 4h2l2.2 11h10l2-8H6.5" />
        </Svg>
      );
    case 'back':
      return (
        <Svg {...props}>
          <Path d="M15 5 8 12l7 7" />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...props}>
          <Circle cx="11" cy="11" r="6.5" />
          <Path d="M20 20l-4.3-4.3" />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...props}>
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      );
    case 'dashboard':
      return (
        <Svg {...props}>
          <Rect x="4" y="4" width="7" height="7" rx="1.5" />
          <Rect x="13" y="4" width="7" height="7" rx="1.5" />
          <Rect x="4" y="13" width="7" height="7" rx="1.5" />
          <Rect x="13" y="13" width="7" height="7" rx="1.5" />
        </Svg>
      );
    case 'box':
      return (
        <Svg {...props}>
          <Path d="M3.5 8 12 4l8.5 4-8.5 4-8.5-4Z" />
          <Path d="M3.5 8v9L12 21l8.5-4V8" />
          <Path d="M12 12v9" />
        </Svg>
      );
    case 'stats':
      return (
        <Svg {...props}>
          <Path d="M4 20V10M11 20V4M18 20v-7" />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...props}>
          <Rect x="4" y="5" width="16" height="15" rx="2" />
          <Path d="M4 10h16M8 3v4M16 3v4" />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...props}>
          <Path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20l1.4-6.3-4.8-4.3 6.4-.6L12 3Z" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg {...props}>
          <Path d="M12 20.5s-7.5-4.6-9.7-9.1C.8 8 2.4 4.6 5.9 4c2.1-.4 4 .6 6.1 2.9C14.1 4.6 16 3.6 18.1 4c3.5.6 5.1 4 3.6 7.4C19.5 15.9 12 20.5 12 20.5Z" />
        </Svg>
      );
    default:
      return null;
  }
}
