import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Path, Polygon } from 'react-native-svg';
import Button from '../components/Button';
import { COLORS } from '../theme/theme';

const ONBOARD_SLIDES = [
  {
    illo: 'notebook',
    title: 'Pre-order Stationery',
    desc: 'Check live stock and reserve notebooks, pens & supplies before you even leave class.'
  },
  {
    illo: 'printer',
    title: 'Upload Documents & Print',
    desc: 'Send your PDFs straight to the store, choose your print options, and see the cost instantly.'
  },
  {
    illo: 'paper',
    title: 'Skip the Queue',
    desc: 'Pick a pickup slot that suits you and walk in only when your order is ready.'
  }
];

function RenderIllo({ name, size = 140 }) {
  if (name === 'notebook') {
    return (
      <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <Rect x="40" y="30" width="110" height="150" rx="10" fill={COLORS.card} stroke={COLORS.primary} strokeWidth="4" />
        <Line x1="40" y1="55" x2="150" y2="55" stroke={COLORS.line} strokeWidth="3" />
        <Line x1="60" y1="80" x2="130" y2="80" stroke={COLORS.line} strokeWidth="3" />
        <Line x1="60" y1="100" x2="130" y2="100" stroke={COLORS.line} strokeWidth="3" />
        <Line x1="60" y1="120" x2="110" y2="120" stroke={COLORS.line} strokeWidth="3" />
        {[45, 60, 75, 90, 105, 120, 135, 150, 165].map(y => (
          <Circle key={y} cx="40" cy={y} r="3" fill={COLORS.card} stroke={COLORS.primary} strokeWidth="2" />
        ))}
        <Polygon points="145,20 155,20 150,5" fill={COLORS.text} />
      </Svg>
    );
  }
  if (name === 'printer') {
    return (
      <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
        <Rect x="45" y="70" width="110" height="60" rx="8" fill={COLORS.primary} />
        <Rect x="60" y="40" width="80" height="40" rx="4" fill={COLORS.card} stroke={COLORS.primary} strokeWidth="4" />
        <Rect x="65" y="120" width="70" height="55" rx="3" fill={COLORS.card} stroke={COLORS.line} strokeWidth="3" />
        <Line x1="75" y1="135" x2="125" y2="135" stroke={COLORS.line} strokeWidth="3" />
        <Line x1="75" y1="148" x2="125" y2="148" stroke={COLORS.line} strokeWidth="3" />
        <Line x1="75" y1="161" x2="110" y2="161" stroke={COLORS.line} strokeWidth="3" />
        <Circle cx="135" cy="90" r="5" fill={COLORS.accent} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Rect x="60" y="45" width="90" height="115" rx="6" fill={COLORS.card} stroke={COLORS.primary} strokeWidth="4" />
      <Line x1="75" y1="70" x2="135" y2="70" stroke={COLORS.line} strokeWidth="3" />
      <Line x1="75" y1="90" x2="135" y2="90" stroke={COLORS.line} strokeWidth="3" />
      <Line x1="75" y1="110" x2="120" y2="110" stroke={COLORS.line} strokeWidth="3" />
      <Circle cx="140" cy="140" r="22" fill={COLORS.accent} />
      <Path d="M132 140l6 6 12-12" stroke="#FFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default function OnboardingScreen({ onFinish }) {
  const [slideIndex, setSlideIndex] = useState(0);

  const slide = ONBOARD_SLIDES[slideIndex];
  const isLast = slideIndex === ONBOARD_SLIDES.length - 1;

  const nextSlide = () => {
    if (isLast) {
      onFinish();
    } else {
      setSlideIndex(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipWrap}>
        <TouchableOpacity onPress={onFinish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentWrap}>
        <RenderIllo name={slide.illo} size={140} />
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      <View style={styles.dotsWrap}>
        {ONBOARD_SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === slideIndex ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>

      <Button
        title={isLast ? 'Get Started' : 'Next'}
        onPress={nextSlide}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 26,
    paddingVertical: 28,
  },
  skipWrap: {
    alignItems: 'flex-end',
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  contentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 20,
  },
  desc: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 280,
  },
  dotsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 22,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 22,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: COLORS.line,
  }
});
