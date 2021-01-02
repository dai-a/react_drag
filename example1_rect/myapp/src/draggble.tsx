import React from "react";
import { render } from "react-dom";

interface Props {
  rect: { x: number; y: number };
  dragOffset: { x: number; y: number };
}

export default class Rect extends React.Component<{}, Props> {
  private svg: SVGSVGElement | undefined;
  private svgRectElem: SVGRectElement | undefined;
  constructor(props: Props) {
    super(props);
    this.state = { rect: { x: 0, y: 0 }, dragOffset: { x: 0, y: 0 } };
  }

  render() {
    return (
      <div>
        <svg
          viewBox="0 0 100 100"
          ref={(svg: SVGSVGElement) => (this.svg = svg)}
        >
          <rect
            x={this.state.rect.x}
            y={this.state.rect.y}
            width="20"
            height="20"
            ref={(e) => (this.svgRectElem = e ? e : undefined)}
            onMouseDown={(e) => this.startDrag(e, this.svgRectElem)}
          />
        </svg>
        Position: <br />
        X: {this.state.rect.x}
        <br />
        Y: {this.state.rect.y}
      </div>
    );
  }

  startDrag(event: React.MouseEvent, draggedElem: SVGRectElement | undefined) {
    event.preventDefault();
    if (this.svg === undefined) return;
    let point = this.svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    point = point.matrixTransform(this.svg.getScreenCTM()?.inverse());
    this.setState({
      dragOffset: {
        x: point.x - this.state.rect.x,
        y: point.y - this.state.rect.y,
      },
    });

    const mousemove = (event: MouseEvent) => {
      event.preventDefault();
      point.x = event.clientX;
      point.y = event.clientY;
      let cursor = point.matrixTransform(this.svg?.getScreenCTM()?.inverse());
      this.setState({
        rect: {
          x: cursor.x - this.state.dragOffset.x,
          y: cursor.y - this.state.dragOffset.y,
        },
      });
    };

    const mouseup = (event: MouseEvent) => {
      document.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
  }
}
