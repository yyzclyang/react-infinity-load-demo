import * as React from 'react';
import './box.css';

interface BoxProps {
  callback: () => void;
  style?: React.CSSProperties;
  saveRef: (el: HTMLDivElement) => void;
  children?: React.ReactNode;
}

const Box: React.FC<BoxProps> = (props: BoxProps) => {
  const divEl = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    props.saveRef(divEl.current!);
  }, [divEl]);

  return (
    <div className="box" style={props.style} ref={divEl}>
      {props.children}
    </div>
  );
};
export default Box;
