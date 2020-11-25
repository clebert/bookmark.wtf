import React from 'react';

export interface BulmaModalCardProps {
  readonly children: React.ReactNode;
  readonly title: React.ReactNode;
  readonly header?: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly onBackgroundClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * https://bulma.io/documentation/components/modal/
 */
export function BulmaModalCard(props: BulmaModalCardProps): JSX.Element {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={props.onBackgroundClick} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          {props.header}
        </header>

        <section className="modal-card-body">{props.children}</section>
        <footer className="modal-card-foot">{props.footer}</footer>
      </div>
    </div>
  );
}
