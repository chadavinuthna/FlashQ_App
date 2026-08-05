import React from 'react';
import Svg, { Circle, Line, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function LogoSVG({ size = 60 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#4A6FB5" />
          <Stop offset="1" stopColor="#1F3C88" />
        </LinearGradient>
        <LinearGradient id="boltGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#DDB05C" />
          <Stop offset="1" stopColor="#C6922F" />
        </LinearGradient>
      </Defs>
      <Circle cx="58" cy="52" r="40" fill="none" stroke="url(#ringGrad)" strokeWidth="10" />
      <Line x1="84" y1="78" x2="100" y2="94" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round" />
      <Polygon points="66,14 42,60 56,60 48,98 80,48 64,48" fill="url(#boltGrad)" />
    </Svg>
  );
}
