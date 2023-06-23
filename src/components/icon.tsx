import {joinClassNames} from '../utils/join-class-names.js';
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CheckIcon,
  ComputerDesktopIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  EyeSlashIcon,
  LinkIcon,
  LockClosedIcon,
  MoonIcon,
  PencilSquareIcon,
  Square2StackIcon,
  Squares2X2Icon,
  SquaresPlusIcon,
  SunIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import * as React from 'react';

export interface IconProps {
  type: keyof typeof pathByType;
  standalone?: boolean;
}

const iconHeightWidth = `h-4 w-4`;

const pathByType = {
  arrowLeftOnRectangle: <ArrowLeftOnRectangleIcon className={iconHeightWidth} />,
  arrowRightOnRectangle: <ArrowRightOnRectangleIcon className={iconHeightWidth} />,
  arrowTopRightOnSquare: <ArrowTopRightOnSquareIcon className={iconHeightWidth} />,
  barsArrowDown: <BarsArrowDownIcon className={iconHeightWidth} />,
  barsArrowUp: <BarsArrowUpIcon className={iconHeightWidth} />,
  check: <CheckIcon className={iconHeightWidth} />,
  computerDesktop: <ComputerDesktopIcon className={iconHeightWidth} />,
  cursorArrowRays: <CursorArrowRaysIcon className={iconHeightWidth} />,
  eye: <EyeIcon className={iconHeightWidth} />,
  eyeSlash: <EyeSlashIcon className={iconHeightWidth} />,
  link: <LinkIcon className={iconHeightWidth} />,
  lockClosed: <LockClosedIcon className={iconHeightWidth} />,
  moon: <MoonIcon className={iconHeightWidth} />,
  pencilSquare: <PencilSquareIcon className={iconHeightWidth} />,
  square2Stack: <Square2StackIcon className={iconHeightWidth} />,
  squares2X2: <Squares2X2Icon className={iconHeightWidth} />,
  squaresPlus: <SquaresPlusIcon className={iconHeightWidth} />,
  sun: <SunIcon className={iconHeightWidth} />,
  trash: <TrashIcon className={iconHeightWidth} />,
  xMark: <XMarkIcon className={iconHeightWidth} />,
};

export function Icon({type, standalone}: IconProps): JSX.Element {
  return (
    <div className={joinClassNames(`inline-flex h-5 align-middle`, !standalone && `mr-1`)}>
      {pathByType[type]}
    </div>
  );
}
