import React, { FC } from 'react';
import './IsoBrick.scss';
import { BrickDimension } from '../../common/types/brick-dimension';

const ANGLE_RADIANS = 30 / 180 * Math.PI;

class IsoLine {
  x: number = 0;
  y: number = 0;

  constructor(hyp: number) {
    this.x = hyp * Math.cos(ANGLE_RADIANS);
    this.y = hyp * Math.sin(ANGLE_RADIANS);
  }
}

class Point {
  readonly x: number;
  readonly y: number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

interface LineAttributes {
  [index: string]: string;
}

const lineAttrs = (points: Point[]): LineAttributes => {
  const attrs: LineAttributes = {};
  return points.reduce((acc:LineAttributes, p:Point, idx:number) => {
    const n:number = idx + 1;
    acc[`x${n}`] = String(p.x);
    acc[`y${n}`] = String(p.y);
    return acc;
  }, attrs);
};

interface IsoBrickProps {
  brick: BrickDimension;
};
export const IsoBrick: FC<IsoBrickProps> = ({ brick }) => {
  const { width, height, length } = brick;
  console.log('width:', width, 'height:', height, 'length:', length);
  if (width === 0 || height === 0 || length === 0) {
    return (null);
  }

  // Calculate outline
  const wd = new IsoLine(width);
  const ld = new IsoLine(length);

  const totalY = wd.y + height + ld.y;
  const totalX = wd.x + ld.x;

  const viewBoxX = Math.ceil(totalX);
  const viewBoxY = Math.ceil(totalY);

  const outline = [
    new Point(ld.x, 0),
    new Point(totalX, wd.y),
    new Point(totalX, wd.y + height),
    new Point(wd.x, totalY),
    new Point(0, ld.y + height),
    new Point(0, ld.y),
  ];
  const line1 = lineAttrs([
    new Point(wd.x, totalY),
    new Point(wd.x, totalY - height),
  ]);
  const line2 = lineAttrs([
    new Point(wd.x, totalY - height),
    new Point(0, ld.y),
  ]);
  const line3 = lineAttrs([
    new Point(wd.x, totalY - height),
    new Point(totalX, wd.y),
  ]);

  const outlineStr:string = outline.reduce((acc:string, p:Point): string => {
    return `${acc}${p.x},${p.y} `;
  }, '');

  return (
    <svg className="iso-brick" viewBox={`0 0 ${viewBoxX} ${viewBoxY}`}>
      <polygon points={outlineStr} fill="none" stroke="black" />
      <line {...line1} stroke="black" />
      <line {...line2} stroke="black" />
      <line {...line3} stroke="black" />
    </svg>
  );
}

export default IsoBrick;


