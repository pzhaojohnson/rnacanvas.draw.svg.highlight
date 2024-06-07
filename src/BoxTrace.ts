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
 * Currently has the appearance of a blue and aqua dashed line drawn around a specified box.
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

  private blueDashing: SVGPathElement;
  private aquaDashing: SVGPathElement;

  constructor() {
    this.domNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    this.blueDashing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.aquaDashing = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // aqua dashing on top of blue dashing
    this.domNode.append(this.blueDashing, this.aquaDashing);

    this.domNode.style.pointerEvents = 'none';

    this.blueDashing.setAttribute('stroke', 'blue');
    this.aquaDashing.setAttribute('stroke', 'aqua');

    // note that it is also possible to simply have a solid blue trace underneath the aqua dashing
    // (however this could inadvertently result in the aqua dashing appearing as a solid line for boxes with zero width or zero height)
    this.blueDashing.setAttribute('stroke-dasharray', '0.75 0.75');
    this.aquaDashing.setAttribute('stroke-dasharray', '0.75 0.75');

    // so that the dashes don't overlap
    this.aquaDashing.setAttribute('stroke-dashoffset', '0.75');

    this.blueDashing.setAttribute('stroke-width', '0.75');
    this.aquaDashing.setAttribute('stroke-width', '0.75');

    this.blueDashing.setAttribute('fill', 'none');
    this.aquaDashing.setAttribute('fill', 'none');
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

    this.blueDashing.setAttribute('d', d);
    this.aquaDashing.setAttribute('d', d);
  }

  /**
   * Sets the thickness of the box trace (in pixels).
   */
  setThickness(thickness: number): void {
    this.blueDashing.setAttribute('stroke-width', `${thickness}`);
    this.aquaDashing.setAttribute('stroke-width', `${thickness}`);
  }

  setOpacity(opacity: number): void {
    this.domNode.setAttribute('opacity', `${opacity}`);
  }
}
