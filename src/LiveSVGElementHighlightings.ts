import { BoxTrace } from './BoxTrace';

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
   * Use box traces to highlight the bounding boxes of the target SVG elements.
   */
  private boxTraces: BoxTrace[] = [];

  /**
   * The target SVG elements must all have a bounding box.
   *
   * (SVG graphics elements are the only kind of element that a user would usually interact with anyways.)
   *
   * @param targetSVGElements The SVG elements to highlight.
   * @param parentSVGDoc The SVG document that the target SVG elements are contained in.
   */
  constructor(private targetSVGElements: LiveSet<SVGGraphicsElement>, parentSVGDoc: SVGSVGElement) {
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

    // create any additional box traces that are needed (one for each target SVG element)
    targetSVGElements.slice(this.boxTraces.length).forEach(() => {
      let boxTrace = new BoxTrace();
      boxTrace.appendTo(this.domNode);
      this.boxTraces.push(boxTrace);
    });

    // trace the target SVG elements
    // (also enclose array indexing in a try...catch statement just to be safe)
    targetSVGElements.forEach((ele, i) => {
      try {
        let boxTrace = this.boxTraces[i];
        boxTrace.trace(ele.getBBox());
        boxTrace.setOpacity(1);
      } catch (error: unknown) {
        console.error(error);
      }
    });

    // make any extra box traces invisible
    this.boxTraces.slice(targetSVGElements.length).forEach(trace => trace.setOpacity(0));
  }
}
