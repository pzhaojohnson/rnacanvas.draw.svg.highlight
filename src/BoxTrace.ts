/**
 * Corresponds with the box interface returned by methods such as `getBBox`.
 */
interface Box {
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

/**
 * Represents an SVG element that can be added to an SVG document (or an overlaid SVG document)
 * to highlight a specified box (such as the bounding box of another SVG element).
 *
 * Currently has the appearance of a light and dark dashed line drawn around a specified box.
 *
 * The underlying DOM nodes that make up a box trace are not meant to be directly edited by outside code
 * but rather only edited through the interface provided by this class.
 */
export class BoxTrace {
  /**
   * The actual DOM node that is the box trace.
   *
   * Contains all the elements of the box trace.
   */
  private domNode: SVGGElement;

  private lightDashing: SVGPathElement;
  private darkDashing: SVGPathElement;

  constructor() {
    this.domNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    this.lightDashing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.darkDashing = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    this.domNode.append(this.lightDashing, this.darkDashing);

    this.domNode.style.pointerEvents = 'none';

    this.lightDashing.setAttribute('stroke', 'powderblue');
    this.darkDashing.setAttribute('stroke', 'blue');

    // note that it is also possible to simply have a solid trace underneath a dashed trace
    // (however this could inadvertently result in the dashed trace appearing as a solid line for boxes with zero width or zero height)
    this.lightDashing.setAttribute('stroke-dasharray', '0 1');
    this.darkDashing.setAttribute('stroke-dasharray', '0 1');

    this.lightDashing.setAttribute('stroke-linecap', 'round');
    this.darkDashing.setAttribute('stroke-linecap', 'round');

    // so that the dashes don't overlap
    this.darkDashing.setAttribute('stroke-dashoffset', '0.5');

    this.lightDashing.setAttribute('stroke-width', '0.4');
    this.darkDashing.setAttribute('stroke-width', '0.4');

    this.lightDashing.setAttribute('fill', 'none');
    this.darkDashing.setAttribute('fill', 'none');
  }

  /**
   * Appends the box trace to the given container node.
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the box trace from any container node that it is in.
   *
   * Has no effect if the box trace has no parent container node.
   */
  remove(): void {
    this.domNode.remove();
  }

  /**
   * Repositions and resizes the box trace so that it traces the specified box.
   */
  trace(box: Box): void {
    let d = `M ${box.x} ${box.y} h ${box.width} v ${box.height} h ${-box.width} z`;

    this.lightDashing.setAttribute('d', d);
    this.darkDashing.setAttribute('d', d);
  }

  /**
   * Sets the thickness of the box trace (in pixels).
   */
  setThickness(thickness: number): void {
    this.lightDashing.setAttribute('stroke-width', `${thickness}`);
    this.darkDashing.setAttribute('stroke-width', `${thickness}`);
  }

  setOpacity(opacity: number): void {
    this.domNode.setAttribute('opacity', `${opacity}`);
  }
}
