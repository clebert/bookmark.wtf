import {JSX} from 'preact';

export type EventHandler<
  TEvent extends JSX.TargetedEvent<EventTarget, Event>
> = (event: TEvent) => void;

export function preventDefault<
  TEvent extends JSX.TargetedEvent<EventTarget, Event>
>(eventHandler?: EventHandler<TEvent>): EventHandler<TEvent> {
  return (event) => {
    event.preventDefault();
    eventHandler?.(event);
  };
}
