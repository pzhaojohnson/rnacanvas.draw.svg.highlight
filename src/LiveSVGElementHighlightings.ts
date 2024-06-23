import { BoxHighlighting } from './BoxHighlighting';

import { CoordinateSystem as SVGDocCoordinateSystem } from '@rnacanvas/draw.svg';

/**
 * A set that can be listened to for when it changes.
 */
interface LiveSet<T> extends Iterable<T> {
  /**
   * Should call the provided listener whenever the composition of items in the set changes.
   */
  addEventListener(name: 'change', listener: () => void): void;
}

/**
 * A live collection of SVG element highlightings.
 *
 * The highlightings will auto-update in response to any changes in the set of target SVG elements
 * or in the parent SVG document that the target SVG elements are contained in.
 *
 * The underlying DOM nodes that make up SVG element highlightings are not meant to be directly edited
 * by outside code.
 */
export class LiveSVGElementHighlightings {
  /**
   * The actual DOM node that contains all of the underlying DOM nodes that make up the SVG element highlightings.
   */
  private domNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  /**
   * Use box highlightings to highlight the bounding boxes of the target SVG elements.
   */
  private boxHighlightings: BoxHighlighting[] = [];

  private parentSVGDocCoordinateSystem: SVGDocCoordinateSystem;

  /**
   * The target SVG elements must all have a bounding box.
   *
   * (SVG graphics elements are the only kind of element that a user would usually interact with anyways.)
   *
   * @param targetSVGElements The SVG elements to highlight.
   * @param parentSVGDoc The SVG document that the target SVG elements are contained in.
   */
  constructor(private targetSVGElements: LiveSet<SVGGraphicsElement>, parentSVGDoc: SVGSVGElement) {
    this.parentSVGDocCoordinateSystem = new SVGDocCoordinateSystem(parentSVGDoc);

    targetSVGElements.addEventListener('change', () => this.refresh());

    let parentSVGDocObserver = new MutationObserver(() => this.refresh());

    // refresh whenever the parent SVG document (and anything in it) changes
    parentSVGDocObserver.observe(parentSVGDoc, { attributes: true, childList: true, characterData: true, subtree: true });
  }

  /**
   * Appends the SVG element highlightings to the provided container node
   * (such as another SVG document that has been overlaid over the parent SVG document
   * that the target SVG elements are contained in).
   */
  appendTo(container: Node): void {
    container.appendChild(this.domNode);
  }

  /**
   * Removes the SVG element highlightings from whatever parent container node that they are in.
   *
   * Has no effect if the SVG element highlightings did not have a parent container node to begin with.
   */
  remove(): void {
    this.domNode.remove();
  }

  private refresh(): void {
    let targetSVGElements = [...this.targetSVGElements];

    // create any additional box highlightings that are needed (one for each target SVG element)
    targetSVGElements.slice(this.boxHighlightings.length).forEach(() => {
      let boxHighlighting = new BoxHighlighting();
      boxHighlighting.appendTo(this.domNode);
      this.boxHighlightings.push(boxHighlighting);
    });

    // adjust line thickness according to the scaling of the parent SVG document
    let scaling = this.parentSVGDocCoordinateSystem.horizontalScaling;
    let lineThickness = 0.75 / scaling;

    // highlight the target SVG elements and update line thicknesses and opacities
    // (also enclose array indexing in a try...catch statement just to be safe)
    targetSVGElements.forEach((ele, i) => {
      try {
        let boxHighlighting = this.boxHighlightings[i];
        boxHighlighting.highlight(ele.getBBox());
        boxHighlighting.lineThickness = lineThickness;
        boxHighlighting.setOpacity(1);
      } catch (error: unknown) {
        console.error(error);
      }
    });

    // make any extra box traces invisible
    this.boxHighlightings
      .slice(targetSVGElements.length)
      .forEach(boxHighlighting => boxHighlighting.setOpacity(0));
  }
}
