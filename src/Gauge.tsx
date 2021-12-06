import React, { FC, useEffect, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';

import { animated, useSpring } from '@react-spring/native';
import { Point } from './types';
import Arrow from '../assets/arrow.svg';
import Background from '../assets/bg.svg';

const INITIAL_ANGLE = -45;
const MIN_ANGLE = -55;
const MAX_ANGLE = 45;

type Props = {
  size: number;
};

export const GaugeV2: FC<Props> = ({ size }) => {
  const container = useRef<View>(null);
  const [containerPosition, setContainerPosition] = useState<Point>();

  useEffect(() => {
    setTimeout(() => {
      container.current?.measure((x, y, width, height, px, py) => {
        setContainerPosition({ x: px, y: py });
      });
    }, 0.5);
  }, [container]);

  const [props, set] = useSpring(() => ({
    to: { rotate: `${INITIAL_ANGLE}deg` },
    config: { mass: 1, tension: 150, friction: 15 },
  }));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      return true;
    },
    onPanResponderMove: (_, { x0, y0, moveX, moveY }) => {
      if (containerPosition) {
        const centerPoint = {
          x: containerPosition.x + size / 2,
          y: containerPosition.y + size / 2,
        };

        const initialTouchVector = [{ x: x0, y: y0 }, centerPoint];
        const currentTouchVector = [{ x: moveX, y: moveY }, centerPoint];

        let angle =
          getAngleBetweenLines(initialTouchVector, currentTouchVector) +
          INITIAL_ANGLE;

        if (angle < MIN_ANGLE) {
          angle = INITIAL_ANGLE;
        }
        if (angle > MAX_ANGLE) {
          angle = MAX_ANGLE;
        }

        set.update(() => ({ rotate: `${angle}deg` }));
        set.start();
      }
    },
    onPanResponderRelease: () => {
      set.update(() => ({ rotate: `${INITIAL_ANGLE}deg` }));
      set.start();
    },
  });

  return (
    <View
      ref={container}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
      <Background
        width={size / 1.1}
        height={(size / 1.1) * 0.22}
        style={{
          top: (size / 1.1) * 0.12,
          position: 'absolute',
        }}
      />
      <animated.View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: size,
          height: size,
          transform: [{ rotate: props.rotate }],
        }}>
        <Arrow
          {...panResponder.panHandlers}
          height={size / 2}
          width={(size / 2) * 0.28}
          style={{
            position: 'absolute',
            top: 0,
          }}
        />
      </animated.View>
    </View>
  );
};

const getAngleBetweenLines = (v1: Point[], v2: Point[]) => {
  const a0 = Math.atan2(v1[0].y - v1[1].y, v1[0].x - v1[1].x);
  const a1 = Math.atan2(v2[0].y - v2[1].y, v2[0].x - v2[1].x);

  const rad = a1 - a0;
  const degrees = (rad * 180) / Math.PI;

  return degrees;
};
