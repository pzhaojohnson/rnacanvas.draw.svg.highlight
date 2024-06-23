import { Box } from '@rnacanvas/boxes';

/**
 * Corresponds with the box interface returned by methods such as `getBBox`.
 */
interface BoxLike {
  /**
   * The minimum X coordinate of the box.
   */
  x: number;

  /**
   * The minimum Y coordinate of the box.
   */
  y: number;

  width: number;
  height: number;
}

type Point = {
  x: number;
  y: number;
};

/**
 * Represents an SVG element that can be added to an SVG document (or an overlaid SVG document)
 * to highlight a specified box (such as the bounding box of another SVG element).
 *
 * The underlying DOM nodes that make up a box highlighting are not meant to be directly edited by outside code
 * but rather only edited through the interface provided by this class.
 */
export class BoxHighlighting {
  /**
   * The actual DOM node that is the box trace.
   *
   * Contains all the elements of the box trace.
   */
  private domNode: SVGGElement;

  /**
   * Traces the highlighted box.
   */
  private boxTrace: SVGPathElement;

  private topLeftCornerBox: SVGPathElement;
  private topRightCornerBox: SVGPathElement;
  private bottomRightCornerBox: SVGPathElement;
  private bottomLeftCornerBox: SVGPathElement;

  #lineThickness = 0.5;

  /**
   * The currently highlighted box.
   */
  private highlightedBox: Box | undefined;

  constructor() {
    this.domNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    this.boxTrace = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    this.topLeftCornerBox = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.topRightCornerBox = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.bottomRightCornerBox = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.bottomLeftCornerBox = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    this.domNode.append(this.boxTrace, ...this.cornerBoxes);

    this.domNode.style.pointerEvents = 'none';

    this.boxTrace.setAttribute('stroke', 'blue');
    this.boxTrace.setAttribute('stroke-width', `${this.#lineThickness}`);
    this.boxTrace.setAttribute('fill', 'none');

    this.cornerBoxes.forEach(cornerBox => {
      cornerBox.setAttribute('stroke', 'blue');
      cornerBox.setAttribute('stroke-width', `${this.#lineThickness}`);
      cornerBox.setAttribute('fill', 'white');
    });
  }

  private get cornerBoxes() {
    return [
      this.topLeftCornerBox,
      this.topRightCornerBox,
      this.bottomRightCornerBox,
      this.bottomLeftCornerBox,
    ];
  }

  /**
   * Appends the box highlighting to the given container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the box highlighting from any container node that it is in.
   *
   * Has no effect if the box highlighting had no parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  /**
   * Returns what the path `d` attribute should be for a corner box centered on the given point
   * and taking into account the line thickness of the box highlighting.
   */
  private cornerBoxD({ centerPoint }: { centerPoint: Point }): string {
    return (
      `M ${centerPoint.x - (2 * this.#lineThickness**0.5)} ${centerPoint.y - (2 * this.#lineThickness**0.5)}`
      + ` h ${2 * this.#lineThickness**0.5}`
      + ` v ${2 * this.#lineThickness**0.5}`
      + ` h ${-2 * (this.#lineThickness**0.5)}`
      + ' z'
    );
  }

  /**
   * Repositions and resizes the box highlighting to highlight the specified box.
   */
  highlight(boxLike: BoxLike): void {
    let box = Box.matching(boxLike);

    this.boxTrace.setAttribute('d', `M ${box.x} ${box.y} h ${box.width} v ${box.height} h ${-box.width} z`);

    this.topLeftCornerBox.setAttribute('d', this.cornerBoxD({ centerPoint: { x: box.minX, y: box.minY } }));
    this.topRightCornerBox.setAttribute('d', this.cornerBoxD({ centerPoint: { x: box.maxX, y: box.minY } }));
    this.bottomRightCornerBox.setAttribute('d', this.cornerBoxD({ centerPoint: { x: box.maxX, y: box.maxY } }));
    this.bottomLeftCornerBox.setAttribute('d', this.cornerBoxD({ centerPoint: { x: box.minX, y: box.maxY } }));

    this.highlightedBox = box;
  }

  /**
   * Line thickness is specified in pixels.
   *
   * Setting this also affects the sizing of the corner boxes of the box highlighting.
   */
  get lineThickness() {
    return this.#lineThickness;
  }

  set lineThickness(lineThickness) {
    this.#lineThickness = lineThickness;

    [this.boxTrace, ...this.cornerBoxes].forEach(ele => {
      ele.setAttribute('stroke-width', `${lineThickness}`);
    });

    this.highlightedBox ? this.highlight(this.highlightedBox) : {};
  }

  setOpacity(opacity: number): void {
    this.domNode.setAttribute('opacity', `${opacity}`);
  }
}
