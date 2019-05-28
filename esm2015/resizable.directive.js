/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Renderer2, ElementRef, Output, Input, EventEmitter, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable, merge, EMPTY } from 'rxjs';
import { map, mergeMap, takeUntil, filter, pairwise, take, share, auditTime, switchMap, startWith } from 'rxjs/operators';
/**
 * @record
 */
function PointerEventCoordinate() { }
if (false) {
    /** @type {?} */
    PointerEventCoordinate.prototype.clientX;
    /** @type {?} */
    PointerEventCoordinate.prototype.clientY;
    /** @type {?} */
    PointerEventCoordinate.prototype.event;
}
/**
 * @record
 */
function Coordinate() { }
if (false) {
    /** @type {?} */
    Coordinate.prototype.x;
    /** @type {?} */
    Coordinate.prototype.y;
}
/**
 * @param {?} value1
 * @param {?} value2
 * @param {?=} precision
 * @return {?}
 */
function isNumberCloseTo(value1, value2, precision = 3) {
    /** @type {?} */
    const diff = Math.abs(value1 - value2);
    return diff < precision;
}
/**
 * @param {?} startingRect
 * @param {?} edges
 * @param {?} clientX
 * @param {?} clientY
 * @return {?}
 */
function getNewBoundingRectangle(startingRect, edges, clientX, clientY) {
    /** @type {?} */
    const newBoundingRect = {
        top: startingRect.top,
        bottom: startingRect.bottom,
        left: startingRect.left,
        right: startingRect.right
    };
    if (edges.top) {
        newBoundingRect.top += clientY;
    }
    if (edges.bottom) {
        newBoundingRect.bottom += clientY;
    }
    if (edges.left) {
        newBoundingRect.left += clientX;
    }
    if (edges.right) {
        newBoundingRect.right += clientX;
    }
    newBoundingRect.height = newBoundingRect.bottom - newBoundingRect.top;
    newBoundingRect.width = newBoundingRect.right - newBoundingRect.left;
    return newBoundingRect;
}
/**
 * @param {?} element
 * @param {?} ghostElementPositioning
 * @return {?}
 */
function getElementRect(element, ghostElementPositioning) {
    /** @type {?} */
    let translateX = 0;
    /** @type {?} */
    let translateY = 0;
    /** @type {?} */
    const style = element.nativeElement.style;
    /** @type {?} */
    const transformProperties = [
        'transform',
        '-ms-transform',
        '-moz-transform',
        '-o-transform'
    ];
    /** @type {?} */
    const transform = transformProperties
        .map(property => style[property])
        .find(value => !!value);
    if (transform && transform.includes('translate3d')) {
        translateX = transform.replace(/.*translate3d\((.*)px, (.*)px, (.*)px\).*/, '$1');
        translateY = transform.replace(/.*translate3d\((.*)px, (.*)px, (.*)px\).*/, '$2');
    }
    else if (transform && transform.includes('translate')) {
        translateX = transform.replace(/.*translate\((.*)px, (.*)px\).*/, '$1');
        translateY = transform.replace(/.*translate\((.*)px, (.*)px\).*/, '$2');
    }
    if (ghostElementPositioning === 'absolute') {
        return {
            height: element.nativeElement.offsetHeight,
            width: element.nativeElement.offsetWidth,
            top: element.nativeElement.offsetTop - translateY,
            bottom: element.nativeElement.offsetHeight +
                element.nativeElement.offsetTop -
                translateY,
            left: element.nativeElement.offsetLeft - translateX,
            right: element.nativeElement.offsetWidth +
                element.nativeElement.offsetLeft -
                translateX
        };
    }
    else {
        /** @type {?} */
        const boundingRect = element.nativeElement.getBoundingClientRect();
        return {
            height: boundingRect.height,
            width: boundingRect.width,
            top: boundingRect.top - translateY,
            bottom: boundingRect.bottom - translateY,
            left: boundingRect.left - translateX,
            right: boundingRect.right - translateX,
            scrollTop: element.nativeElement.scrollTop,
            scrollLeft: element.nativeElement.scrollLeft
        };
    }
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingY({ clientY, rect }) {
    return clientY >= rect.top && clientY <= rect.bottom;
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingX({ clientX, rect }) {
    return clientX >= rect.left && clientX <= rect.right;
}
/**
 * @param {?} __0
 * @return {?}
 */
function getResizeEdges({ clientX, clientY, elm, allowedEdges, cursorPrecision }) {
    /** @type {?} */
    const elmPosition = elm.nativeElement.getBoundingClientRect();
    /** @type {?} */
    const edges = {};
    if (allowedEdges.left &&
        isNumberCloseTo(clientX, elmPosition.left, cursorPrecision) &&
        isWithinBoundingY({ clientY, rect: elmPosition })) {
        edges.left = true;
    }
    if (allowedEdges.right &&
        isNumberCloseTo(clientX, elmPosition.right, cursorPrecision) &&
        isWithinBoundingY({ clientY, rect: elmPosition })) {
        edges.right = true;
    }
    if (allowedEdges.top &&
        isNumberCloseTo(clientY, elmPosition.top, cursorPrecision) &&
        isWithinBoundingX({ clientX, rect: elmPosition })) {
        edges.top = true;
    }
    if (allowedEdges.bottom &&
        isNumberCloseTo(clientY, elmPosition.bottom, cursorPrecision) &&
        isWithinBoundingX({ clientX, rect: elmPosition })) {
        edges.bottom = true;
    }
    return edges;
}
/**
 * @record
 */
export function ResizeCursors() { }
if (false) {
    /** @type {?} */
    ResizeCursors.prototype.topLeft;
    /** @type {?} */
    ResizeCursors.prototype.topRight;
    /** @type {?} */
    ResizeCursors.prototype.bottomLeft;
    /** @type {?} */
    ResizeCursors.prototype.bottomRight;
    /** @type {?} */
    ResizeCursors.prototype.leftOrRight;
    /** @type {?} */
    ResizeCursors.prototype.topOrBottom;
}
/** @type {?} */
const DEFAULT_RESIZE_CURSORS = Object.freeze({
    topLeft: 'nw-resize',
    topRight: 'ne-resize',
    bottomLeft: 'sw-resize',
    bottomRight: 'se-resize',
    leftOrRight: 'col-resize',
    topOrBottom: 'row-resize'
});
/**
 * @param {?} edges
 * @param {?} cursors
 * @return {?}
 */
function getResizeCursor(edges, cursors) {
    if (edges.left && edges.top) {
        return cursors.topLeft;
    }
    else if (edges.right && edges.top) {
        return cursors.topRight;
    }
    else if (edges.left && edges.bottom) {
        return cursors.bottomLeft;
    }
    else if (edges.right && edges.bottom) {
        return cursors.bottomRight;
    }
    else if (edges.left || edges.right) {
        return cursors.leftOrRight;
    }
    else if (edges.top || edges.bottom) {
        return cursors.topOrBottom;
    }
    else {
        return '';
    }
}
/**
 * @param {?} __0
 * @return {?}
 */
function getEdgesDiff({ edges, initialRectangle, newRectangle }) {
    /** @type {?} */
    const edgesDiff = {};
    Object.keys(edges).forEach(edge => {
        edgesDiff[edge] = (newRectangle[edge] || 0) - (initialRectangle[edge] || 0);
    });
    return edgesDiff;
}
/** @type {?} */
const RESIZE_ACTIVE_CLASS = 'resize-active';
/** @type {?} */
const RESIZE_LEFT_HOVER_CLASS = 'resize-left-hover';
/** @type {?} */
const RESIZE_RIGHT_HOVER_CLASS = 'resize-right-hover';
/** @type {?} */
const RESIZE_TOP_HOVER_CLASS = 'resize-top-hover';
/** @type {?} */
const RESIZE_BOTTOM_HOVER_CLASS = 'resize-bottom-hover';
/** @type {?} */
const RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
/** @type {?} */
export const MOUSE_MOVE_THROTTLE_MS = 50;
/**
 * Place this on an element to make it resizable. For example:
 *
 * ```html
 * <div
 *   mwlResizable
 *   [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
 *   [enableGhostResize]="true">
 * </div>
 * ```
 */
export class ResizableDirective {
    /**
     * @hidden
     * @param {?} platformId
     * @param {?} renderer
     * @param {?} elm
     * @param {?} zone
     */
    constructor(platformId, renderer, elm, zone) {
        this.platformId = platformId;
        this.renderer = renderer;
        this.elm = elm;
        this.zone = zone;
        /**
         * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
         * @deprecated use a resize handle instead that positions itself to the side of the element you would like to resize
         */
        this.resizeEdges = {};
        /**
         * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
         */
        this.enableGhostResize = false;
        /**
         * A snap grid that resize events will be locked to.
         *
         * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
         */
        this.resizeSnapGrid = {};
        /**
         * The mouse cursors that will be set on the resize edges
         */
        this.resizeCursors = DEFAULT_RESIZE_CURSORS;
        /**
         * Mouse over thickness to active cursor.
         * @deprecated invalid when you migrate to use resize handles instead of setting resizeEdges on the element
         */
        this.resizeCursorPrecision = 3;
        /**
         * Define the positioning of the ghost element (can be fixed or absolute)
         */
        this.ghostElementPositioning = 'fixed';
        /**
         * Allow elements to be resized to negative dimensions
         */
        this.allowNegativeResizes = false;
        /**
         * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
         */
        this.resizeStart = new EventEmitter();
        /**
         * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
         */
        this.resizing = new EventEmitter();
        /**
         * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
         */
        this.resizeEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.mouseup = new Subject();
        /**
         * @hidden
         */
        this.mousedown = new Subject();
        /**
         * @hidden
         */
        this.mousemove = new Subject();
        this.destroy$ = new Subject();
        this.resizeEdges$ = new Subject();
        this.pointerEventListeners = PointerEventListeners.getInstance(renderer, zone);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        // TODO - use some fancy Observable.merge's for this
        this.pointerEventListeners.pointerDown
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ clientX, clientY }) => {
            this.mousedown.next({ clientX, clientY });
        });
        this.pointerEventListeners.pointerMove
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ clientX, clientY, event }) => {
            this.mousemove.next({ clientX, clientY, event });
        });
        this.pointerEventListeners.pointerUp
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ clientX, clientY }) => {
            this.mouseup.next({ clientX, clientY });
        });
        /** @type {?} */
        let currentResize;
        /** @type {?} */
        const removeGhostElement = () => {
            if (currentResize && currentResize.clonedNode) {
                this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
                this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'inherit');
            }
        };
        /** @type {?} */
        const getResizeCursors = () => {
            return Object.assign({}, DEFAULT_RESIZE_CURSORS, this.resizeCursors);
        };
        /** @type {?} */
        const mouseMove = this.mousemove.pipe(share());
        mouseMove.pipe(filter(() => !!currentResize)).subscribe(({ event }) => {
            event.preventDefault();
        });
        this.resizeEdges$
            .pipe(startWith(this.resizeEdges), map(() => {
            return (this.resizeEdges &&
                Object.keys(this.resizeEdges).some(edge => !!this.resizeEdges[edge]));
        }), switchMap(legacyResizeEdgesEnabled => legacyResizeEdgesEnabled ? mouseMove : EMPTY), auditTime(MOUSE_MOVE_THROTTLE_MS))
            .subscribe(({ clientX, clientY }) => {
            /** @type {?} */
            const resizeEdges = getResizeEdges({
                clientX,
                clientY,
                elm: this.elm,
                allowedEdges: this.resizeEdges,
                cursorPrecision: this.resizeCursorPrecision
            });
            /** @type {?} */
            const resizeCursors = getResizeCursors();
            if (!currentResize) {
                /** @type {?} */
                const cursor = getResizeCursor(resizeEdges, resizeCursors);
                this.renderer.setStyle(this.elm.nativeElement, 'cursor', cursor);
            }
            this.setElementClass(this.elm, RESIZE_LEFT_HOVER_CLASS, resizeEdges.left === true);
            this.setElementClass(this.elm, RESIZE_RIGHT_HOVER_CLASS, resizeEdges.right === true);
            this.setElementClass(this.elm, RESIZE_TOP_HOVER_CLASS, resizeEdges.top === true);
            this.setElementClass(this.elm, RESIZE_BOTTOM_HOVER_CLASS, resizeEdges.bottom === true);
        });
        /** @type {?} */
        const mousedrag = this.mousedown
            .pipe(mergeMap(startCoords => {
            /**
             * @param {?} moveCoords
             * @return {?}
             */
            function getDiff(moveCoords) {
                return {
                    clientX: moveCoords.clientX - startCoords.clientX,
                    clientY: moveCoords.clientY - startCoords.clientY
                };
            }
            /** @type {?} */
            const getSnapGrid = () => {
                /** @type {?} */
                const snapGrid = { x: 1, y: 1 };
                if (currentResize) {
                    if (this.resizeSnapGrid.left && currentResize.edges.left) {
                        snapGrid.x = +this.resizeSnapGrid.left;
                    }
                    else if (this.resizeSnapGrid.right &&
                        currentResize.edges.right) {
                        snapGrid.x = +this.resizeSnapGrid.right;
                    }
                    if (this.resizeSnapGrid.top && currentResize.edges.top) {
                        snapGrid.y = +this.resizeSnapGrid.top;
                    }
                    else if (this.resizeSnapGrid.bottom &&
                        currentResize.edges.bottom) {
                        snapGrid.y = +this.resizeSnapGrid.bottom;
                    }
                }
                return snapGrid;
            };
            /**
             * @param {?} coords
             * @param {?} snapGrid
             * @return {?}
             */
            function getGrid(coords, snapGrid) {
                return {
                    x: Math.ceil(coords.clientX / snapGrid.x),
                    y: Math.ceil(coords.clientY / snapGrid.y)
                };
            }
            return merge(mouseMove.pipe(take(1)).pipe(map(coords => [, coords])), mouseMove.pipe(pairwise()))
                .pipe(map(([previousCoords, newCoords]) => {
                return [
                    previousCoords ? getDiff(previousCoords) : previousCoords,
                    getDiff(newCoords)
                ];
            }))
                .pipe(filter(([previousCoords, newCoords]) => {
                if (!previousCoords) {
                    return true;
                }
                /** @type {?} */
                const snapGrid = getSnapGrid();
                /** @type {?} */
                const previousGrid = getGrid(previousCoords, snapGrid);
                /** @type {?} */
                const newGrid = getGrid(newCoords, snapGrid);
                return (previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y);
            }))
                .pipe(map(([, newCoords]) => {
                /** @type {?} */
                const snapGrid = getSnapGrid();
                return {
                    clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                    clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
                };
            }))
                .pipe(takeUntil(merge(this.mouseup, this.mousedown)));
        }))
            .pipe(filter(() => !!currentResize));
        mousedrag
            .pipe(map(({ clientX, clientY }) => {
            return getNewBoundingRectangle((/** @type {?} */ (currentResize)).startingRect, (/** @type {?} */ (currentResize)).edges, clientX, clientY);
        }))
            .pipe(filter((newBoundingRect) => {
            return (this.allowNegativeResizes ||
                !!(newBoundingRect.height &&
                    newBoundingRect.width &&
                    newBoundingRect.height > 0 &&
                    newBoundingRect.width > 0));
        }))
            .pipe(filter((newBoundingRect) => {
            return this.validateResize
                ? this.validateResize({
                    rectangle: newBoundingRect,
                    edges: getEdgesDiff({
                        edges: (/** @type {?} */ (currentResize)).edges,
                        initialRectangle: (/** @type {?} */ (currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    })
                })
                : true;
        }))
            .subscribe((newBoundingRect) => {
            if (currentResize && currentResize.clonedNode) {
                this.renderer.setStyle(currentResize.clonedNode, 'height', `${newBoundingRect.height}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'width', `${newBoundingRect.width}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'top', `${newBoundingRect.top}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'left', `${newBoundingRect.left}px`);
            }
            this.zone.run(() => {
                this.resizing.emit({
                    edges: getEdgesDiff({
                        edges: (/** @type {?} */ (currentResize)).edges,
                        initialRectangle: (/** @type {?} */ (currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    }),
                    rectangle: newBoundingRect
                });
            });
            (/** @type {?} */ (currentResize)).currentRect = newBoundingRect;
        });
        this.mousedown
            .pipe(map(({ clientX, clientY, edges }) => {
            return (edges ||
                getResizeEdges({
                    clientX,
                    clientY,
                    elm: this.elm,
                    allowedEdges: this.resizeEdges,
                    cursorPrecision: this.resizeCursorPrecision
                }));
        }))
            .pipe(filter((edges) => {
            return Object.keys(edges).length > 0;
        }))
            .subscribe((edges) => {
            if (currentResize) {
                removeGhostElement();
            }
            /** @type {?} */
            const startingRect = getElementRect(this.elm, this.ghostElementPositioning);
            currentResize = {
                edges,
                startingRect,
                currentRect: startingRect
            };
            /** @type {?} */
            const resizeCursors = getResizeCursors();
            /** @type {?} */
            const cursor = getResizeCursor(currentResize.edges, resizeCursors);
            this.renderer.setStyle(document.body, 'cursor', cursor);
            this.setElementClass(this.elm, RESIZE_ACTIVE_CLASS, true);
            if (this.enableGhostResize) {
                currentResize.clonedNode = this.elm.nativeElement.cloneNode(true);
                this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
                this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'hidden');
                this.renderer.setStyle(currentResize.clonedNode, 'position', this.ghostElementPositioning);
                this.renderer.setStyle(currentResize.clonedNode, 'left', `${currentResize.startingRect.left}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'top', `${currentResize.startingRect.top}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'height', `${currentResize.startingRect.height}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'width', `${currentResize.startingRect.width}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
                this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS);
                (/** @type {?} */ (currentResize.clonedNode)).scrollTop = (/** @type {?} */ (currentResize.startingRect
                    .scrollTop));
                (/** @type {?} */ (currentResize.clonedNode)).scrollLeft = (/** @type {?} */ (currentResize.startingRect
                    .scrollLeft));
            }
            this.zone.run(() => {
                this.resizeStart.emit({
                    edges: getEdgesDiff({
                        edges,
                        initialRectangle: startingRect,
                        newRectangle: startingRect
                    }),
                    rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
                });
            });
        });
        this.mouseup.subscribe(() => {
            if (currentResize) {
                this.renderer.removeClass(this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
                this.renderer.setStyle(document.body, 'cursor', '');
                this.renderer.setStyle(this.elm.nativeElement, 'cursor', '');
                this.zone.run(() => {
                    this.resizeEnd.emit({
                        edges: getEdgesDiff({
                            edges: (/** @type {?} */ (currentResize)).edges,
                            initialRectangle: (/** @type {?} */ (currentResize)).startingRect,
                            newRectangle: (/** @type {?} */ (currentResize)).currentRect
                        }),
                        rectangle: (/** @type {?} */ (currentResize)).currentRect
                    });
                });
                removeGhostElement();
                currentResize = null;
            }
        });
    }
    /**
     * @hidden
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.resizeEdges) {
            this.resizeEdges$.next(this.resizeEdges);
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        // browser check for angular universal, because it doesn't know what document is
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.setStyle(document.body, 'cursor', '');
        }
        this.mousedown.complete();
        this.mouseup.complete();
        this.mousemove.complete();
        this.resizeEdges$.complete();
        this.destroy$.next();
    }
    /**
     * @private
     * @param {?} elm
     * @param {?} name
     * @param {?} add
     * @return {?}
     */
    setElementClass(elm, name, add) {
        if (add) {
            this.renderer.addClass(elm.nativeElement, name);
        }
        else {
            this.renderer.removeClass(elm.nativeElement, name);
        }
    }
}
ResizableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlResizable]'
            },] }
];
/** @nocollapse */
ResizableDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: Renderer2 },
    { type: ElementRef },
    { type: NgZone }
];
ResizableDirective.propDecorators = {
    validateResize: [{ type: Input }],
    resizeEdges: [{ type: Input }],
    enableGhostResize: [{ type: Input }],
    resizeSnapGrid: [{ type: Input }],
    resizeCursors: [{ type: Input }],
    resizeCursorPrecision: [{ type: Input }],
    ghostElementPositioning: [{ type: Input }],
    allowNegativeResizes: [{ type: Input }],
    resizeStart: [{ type: Output }],
    resizing: [{ type: Output }],
    resizeEnd: [{ type: Output }]
};
if (false) {
    /**
     * A function that will be called before each resize event. Return `true` to allow the resize event to propagate or `false` to cancel it
     * @type {?}
     */
    ResizableDirective.prototype.validateResize;
    /**
     * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
     * @deprecated use a resize handle instead that positions itself to the side of the element you would like to resize
     * @type {?}
     */
    ResizableDirective.prototype.resizeEdges;
    /**
     * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
     * @type {?}
     */
    ResizableDirective.prototype.enableGhostResize;
    /**
     * A snap grid that resize events will be locked to.
     *
     * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
     * @type {?}
     */
    ResizableDirective.prototype.resizeSnapGrid;
    /**
     * The mouse cursors that will be set on the resize edges
     * @type {?}
     */
    ResizableDirective.prototype.resizeCursors;
    /**
     * Mouse over thickness to active cursor.
     * @deprecated invalid when you migrate to use resize handles instead of setting resizeEdges on the element
     * @type {?}
     */
    ResizableDirective.prototype.resizeCursorPrecision;
    /**
     * Define the positioning of the ghost element (can be fixed or absolute)
     * @type {?}
     */
    ResizableDirective.prototype.ghostElementPositioning;
    /**
     * Allow elements to be resized to negative dimensions
     * @type {?}
     */
    ResizableDirective.prototype.allowNegativeResizes;
    /**
     * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
     * @type {?}
     */
    ResizableDirective.prototype.resizeStart;
    /**
     * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
     * @type {?}
     */
    ResizableDirective.prototype.resizing;
    /**
     * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
     * @type {?}
     */
    ResizableDirective.prototype.resizeEnd;
    /**
     * @hidden
     * @type {?}
     */
    ResizableDirective.prototype.mouseup;
    /**
     * @hidden
     * @type {?}
     */
    ResizableDirective.prototype.mousedown;
    /**
     * @hidden
     * @type {?}
     */
    ResizableDirective.prototype.mousemove;
    /**
     * @type {?}
     * @private
     */
    ResizableDirective.prototype.pointerEventListeners;
    /**
     * @type {?}
     * @private
     */
    ResizableDirective.prototype.destroy$;
    /**
     * @type {?}
     * @private
     */
    ResizableDirective.prototype.resizeEdges$;
    /**
     * @type {?}
     * @private
     */
    ResizableDirective.prototype.platformId;
    /**
     * @type {?}
     * @private
     */
    ResizableDirective.prototype.renderer;
    /** @type {?} */
    ResizableDirective.prototype.elm;
    /**
     * @type {?}
     * @private
     */
    ResizableDirective.prototype.zone;
}
class PointerEventListeners {
    // tslint:disable-line
    /**
     * @param {?} renderer
     * @param {?} zone
     * @return {?}
     */
    static getInstance(renderer, zone) {
        if (!PointerEventListeners.instance) {
            PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
        }
        return PointerEventListeners.instance;
    }
    /**
     * @param {?} renderer
     * @param {?} zone
     */
    constructor(renderer, zone) {
        this.pointerDown = new Observable((observer) => {
            /** @type {?} */
            let unsubscribeMouseDown;
            /** @type {?} */
            let unsubscribeTouchStart;
            zone.runOutsideAngular(() => {
                unsubscribeMouseDown = renderer.listen('document', 'mousedown', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchStart = renderer.listen('document', 'touchstart', (event) => {
                    observer.next({
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseDown();
                unsubscribeTouchStart();
            };
        }).pipe(share());
        this.pointerMove = new Observable((observer) => {
            /** @type {?} */
            let unsubscribeMouseMove;
            /** @type {?} */
            let unsubscribeTouchMove;
            zone.runOutsideAngular(() => {
                unsubscribeMouseMove = renderer.listen('document', 'mousemove', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchMove = renderer.listen('document', 'touchmove', (event) => {
                    observer.next({
                        clientX: event.targetTouches[0].clientX,
                        clientY: event.targetTouches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseMove();
                unsubscribeTouchMove();
            };
        }).pipe(share());
        this.pointerUp = new Observable((observer) => {
            /** @type {?} */
            let unsubscribeMouseUp;
            /** @type {?} */
            let unsubscribeTouchEnd;
            /** @type {?} */
            let unsubscribeTouchCancel;
            zone.runOutsideAngular(() => {
                unsubscribeMouseUp = renderer.listen('document', 'mouseup', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchEnd = renderer.listen('document', 'touchend', (event) => {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event
                    });
                });
                unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', (event) => {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseUp();
                unsubscribeTouchEnd();
                unsubscribeTouchCancel();
            };
        }).pipe(share());
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    PointerEventListeners.instance;
    /** @type {?} */
    PointerEventListeners.prototype.pointerDown;
    /** @type {?} */
    PointerEventListeners.prototype.pointerMove;
    /** @type {?} */
    PointerEventListeners.prototype.pointerUp;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItcmVzaXphYmxlLWVsZW1lbnQvIiwic291cmNlcyI6WyJyZXNpemFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFNBQVMsRUFDVCxVQUFVLEVBRVYsTUFBTSxFQUNOLEtBQUssRUFDTCxZQUFZLEVBRVosTUFBTSxFQUdOLE1BQU0sRUFDTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQVksS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNuRSxPQUFPLEVBQ0wsR0FBRyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsTUFBTSxFQUNOLFFBQVEsRUFDUixJQUFJLEVBQ0osS0FBSyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsU0FBUyxFQUNWLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFLeEIscUNBSUM7OztJQUhDLHlDQUFnQjs7SUFDaEIseUNBQWdCOztJQUNoQix1Q0FBK0I7Ozs7O0FBR2pDLHlCQUdDOzs7SUFGQyx1QkFBVTs7SUFDVix1QkFBVTs7Ozs7Ozs7QUFHWixTQUFTLGVBQWUsQ0FDdEIsTUFBYyxFQUNkLE1BQWMsRUFDZCxZQUFvQixDQUFDOztVQUVmLElBQUksR0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDOUMsT0FBTyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQzFCLENBQUM7Ozs7Ozs7O0FBRUQsU0FBUyx1QkFBdUIsQ0FDOUIsWUFBK0IsRUFDL0IsS0FBWSxFQUNaLE9BQWUsRUFDZixPQUFlOztVQUVULGVBQWUsR0FBc0I7UUFDekMsR0FBRyxFQUFFLFlBQVksQ0FBQyxHQUFHO1FBQ3JC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QUFDLE9BQU87d0JBQ3hDLE9BQU8sRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU87d0JBQ3hDLEtBQUs7cUJBQ04sQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FDRixDQUFDO2dCQUVGLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQ3RDLFVBQVUsRUFDVixhQUFhLEVBQ2IsQ0FBQyxLQUFpQixFQUFFLEVBQUU7b0JBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUM7d0JBQ1osT0FBTyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzt3QkFDeEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzt3QkFDeEMsS0FBSztxQkFDTixDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUNGLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sR0FBRyxFQUFFO2dCQUNWLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3JCLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3RCLHNCQUFzQixFQUFFLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUNGLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDbEIsQ0FBQztDQUNGOzs7Ozs7SUFoSkMsK0JBQStDOztJQU4vQyw0Q0FBdUQ7O0lBRXZELDRDQUF1RDs7SUFFdkQsMENBQXFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBJbnB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3QsXG4gIFBMQVRGT1JNX0lEXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIG1lcmdlLCBFTVBUWSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgbWFwLFxuICBtZXJnZU1hcCxcbiAgdGFrZVVudGlsLFxuICBmaWx0ZXIsXG4gIHBhaXJ3aXNlLFxuICB0YWtlLFxuICBzaGFyZSxcbiAgYXVkaXRUaW1lLFxuICBzd2l0Y2hNYXAsXG4gIHN0YXJ0V2l0aFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBFZGdlcyB9IGZyb20gJy4vaW50ZXJmYWNlcy9lZGdlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQm91bmRpbmdSZWN0YW5nbGUgfSBmcm9tICcuL2ludGVyZmFjZXMvYm91bmRpbmctcmVjdGFuZ2xlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBSZXNpemVFdmVudCB9IGZyb20gJy4vaW50ZXJmYWNlcy9yZXNpemUtZXZlbnQuaW50ZXJmYWNlJztcblxuaW50ZXJmYWNlIFBvaW50ZXJFdmVudENvb3JkaW5hdGUge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5pbnRlcmZhY2UgQ29vcmRpbmF0ZSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpc051bWJlckNsb3NlVG8oXG4gIHZhbHVlMTogbnVtYmVyLFxuICB2YWx1ZTI6IG51bWJlcixcbiAgcHJlY2lzaW9uOiBudW1iZXIgPSAzXG4pOiBib29sZWFuIHtcbiAgY29uc3QgZGlmZjogbnVtYmVyID0gTWF0aC5hYnModmFsdWUxIC0gdmFsdWUyKTtcbiAgcmV0dXJuIGRpZmYgPCBwcmVjaXNpb247XG59XG5cbmZ1bmN0aW9uIGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKFxuICBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlLFxuICBlZGdlczogRWRnZXMsXG4gIGNsaWVudFg6IG51bWJlcixcbiAgY2xpZW50WTogbnVtYmVyXG4pOiBCb3VuZGluZ1JlY3RhbmdsZSB7XG4gIGNvbnN0IG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUgPSB7XG4gICAgdG9wOiBzdGFydGluZ1JlY3QudG9wLFxuICAgIGJvdHRvbTogc3RhcnRpbmdSZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBzdGFydGluZ1JlY3QubGVmdCxcbiAgICByaWdodDogc3RhcnRpbmdSZWN0LnJpZ2h0XG4gIH07XG5cbiAgaWYgKGVkZ2VzLnRvcCkge1xuICAgIG5ld0JvdW5kaW5nUmVjdC50b3AgKz0gY2xpZW50WTtcbiAgfVxuICBpZiAoZWRnZXMuYm90dG9tKSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LmJvdHRvbSArPSBjbGllbnRZO1xuICB9XG4gIGlmIChlZGdlcy5sZWZ0KSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LmxlZnQgKz0gY2xpZW50WDtcbiAgfVxuICBpZiAoZWRnZXMucmlnaHQpIHtcbiAgICBuZXdCb3VuZGluZ1JlY3QucmlnaHQgKz0gY2xpZW50WDtcbiAgfVxuICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ID0gbmV3Qm91bmRpbmdSZWN0LmJvdHRvbSAtIG5ld0JvdW5kaW5nUmVjdC50b3A7XG4gIG5ld0JvdW5kaW5nUmVjdC53aWR0aCA9IG5ld0JvdW5kaW5nUmVjdC5yaWdodCAtIG5ld0JvdW5kaW5nUmVjdC5sZWZ0O1xuXG4gIHJldHVybiBuZXdCb3VuZGluZ1JlY3Q7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRSZWN0KFxuICBlbGVtZW50OiBFbGVtZW50UmVmLFxuICBnaG9zdEVsZW1lbnRQb3NpdGlvbmluZzogc3RyaW5nXG4pOiBCb3VuZGluZ1JlY3RhbmdsZSB7XG4gIGxldCB0cmFuc2xhdGVYID0gMDtcbiAgbGV0IHRyYW5zbGF0ZVkgPSAwO1xuICBjb25zdCBzdHlsZSA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZTtcbiAgY29uc3QgdHJhbnNmb3JtUHJvcGVydGllcyA9IFtcbiAgICAndHJhbnNmb3JtJyxcbiAgICAnLW1zLXRyYW5zZm9ybScsXG4gICAgJy1tb3otdHJhbnNmb3JtJyxcbiAgICAnLW8tdHJhbnNmb3JtJ1xuICBdO1xuICBjb25zdCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1Qcm9wZXJ0aWVzXG4gICAgLm1hcChwcm9wZXJ0eSA9PiBzdHlsZVtwcm9wZXJ0eV0pXG4gICAgLmZpbmQodmFsdWUgPT4gISF2YWx1ZSk7XG4gIGlmICh0cmFuc2Zvcm0gJiYgdHJhbnNmb3JtLmluY2x1ZGVzKCd0cmFuc2xhdGUzZCcpKSB7XG4gICAgdHJhbnNsYXRlWCA9IHRyYW5zZm9ybS5yZXBsYWNlKFxuICAgICAgLy4qdHJhbnNsYXRlM2RcXCgoLiopcHgsICguKilweCwgKC4qKXB4XFwpLiovLFxuICAgICAgJyQxJ1xuICAgICk7XG4gICAgdHJhbnNsYXRlWSA9IHRyYW5zZm9ybS5yZXBsYWNlKFxuICAgICAgLy4qdHJhbnNsYXRlM2RcXCgoLiopcHgsICguKilweCwgKC4qKXB4XFwpLiovLFxuICAgICAgJyQyJ1xuICAgICk7XG4gIH0gZWxzZSBpZiAodHJhbnNmb3JtICYmIHRyYW5zZm9ybS5pbmNsdWRlcygndHJhbnNsYXRlJykpIHtcbiAgICB0cmFuc2xhdGVYID0gdHJhbnNmb3JtLnJlcGxhY2UoLy4qdHJhbnNsYXRlXFwoKC4qKXB4LCAoLiopcHhcXCkuKi8sICckMScpO1xuICAgIHRyYW5zbGF0ZVkgPSB0cmFuc2Zvcm0ucmVwbGFjZSgvLip0cmFuc2xhdGVcXCgoLiopcHgsICguKilweFxcKS4qLywgJyQyJyk7XG4gIH1cblxuICBpZiAoZ2hvc3RFbGVtZW50UG9zaXRpb25pbmcgPT09ICdhYnNvbHV0ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgd2lkdGg6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgIHRvcDogZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCAtIHRyYW5zbGF0ZVksXG4gICAgICBib3R0b206XG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgK1xuICAgICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIC1cbiAgICAgICAgdHJhbnNsYXRlWSxcbiAgICAgIGxlZnQ6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC0gdHJhbnNsYXRlWCxcbiAgICAgIHJpZ2h0OlxuICAgICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggK1xuICAgICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtXG4gICAgICAgIHRyYW5zbGF0ZVhcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogYm91bmRpbmdSZWN0LmhlaWdodCxcbiAgICAgIHdpZHRoOiBib3VuZGluZ1JlY3Qud2lkdGgsXG4gICAgICB0b3A6IGJvdW5kaW5nUmVjdC50b3AgLSB0cmFuc2xhdGVZLFxuICAgICAgYm90dG9tOiBib3VuZGluZ1JlY3QuYm90dG9tIC0gdHJhbnNsYXRlWSxcbiAgICAgIGxlZnQ6IGJvdW5kaW5nUmVjdC5sZWZ0IC0gdHJhbnNsYXRlWCxcbiAgICAgIHJpZ2h0OiBib3VuZGluZ1JlY3QucmlnaHQgLSB0cmFuc2xhdGVYLFxuICAgICAgc2Nyb2xsVG9wOiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsTGVmdDogZWxlbWVudC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnRcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzV2l0aGluQm91bmRpbmdZKHtcbiAgY2xpZW50WSxcbiAgcmVjdFxufToge1xuICBjbGllbnRZOiBudW1iZXI7XG4gIHJlY3Q6IENsaWVudFJlY3Q7XG59KTogYm9vbGVhbiB7XG4gIHJldHVybiBjbGllbnRZID49IHJlY3QudG9wICYmIGNsaWVudFkgPD0gcmVjdC5ib3R0b207XG59XG5cbmZ1bmN0aW9uIGlzV2l0aGluQm91bmRpbmdYKHtcbiAgY2xpZW50WCxcbiAgcmVjdFxufToge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIHJlY3Q6IENsaWVudFJlY3Q7XG59KTogYm9vbGVhbiB7XG4gIHJldHVybiBjbGllbnRYID49IHJlY3QubGVmdCAmJiBjbGllbnRYIDw9IHJlY3QucmlnaHQ7XG59XG5cbmZ1bmN0aW9uIGdldFJlc2l6ZUVkZ2VzKHtcbiAgY2xpZW50WCxcbiAgY2xpZW50WSxcbiAgZWxtLFxuICBhbGxvd2VkRWRnZXMsXG4gIGN1cnNvclByZWNpc2lvblxufToge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZWxtOiBFbGVtZW50UmVmO1xuICBhbGxvd2VkRWRnZXM6IEVkZ2VzO1xuICBjdXJzb3JQcmVjaXNpb246IG51bWJlcjtcbn0pOiBFZGdlcyB7XG4gIGNvbnN0IGVsbVBvc2l0aW9uOiBDbGllbnRSZWN0ID0gZWxtLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IGVkZ2VzOiBFZGdlcyA9IHt9O1xuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMubGVmdCAmJlxuICAgIGlzTnVtYmVyQ2xvc2VUbyhjbGllbnRYLCBlbG1Qb3NpdGlvbi5sZWZ0LCBjdXJzb3JQcmVjaXNpb24pICYmXG4gICAgaXNXaXRoaW5Cb3VuZGluZ1koeyBjbGllbnRZLCByZWN0OiBlbG1Qb3NpdGlvbiB9KVxuICApIHtcbiAgICBlZGdlcy5sZWZ0ID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMucmlnaHQgJiZcbiAgICBpc051bWJlckNsb3NlVG8oY2xpZW50WCwgZWxtUG9zaXRpb24ucmlnaHQsIGN1cnNvclByZWNpc2lvbikgJiZcbiAgICBpc1dpdGhpbkJvdW5kaW5nWSh7IGNsaWVudFksIHJlY3Q6IGVsbVBvc2l0aW9uIH0pXG4gICkge1xuICAgIGVkZ2VzLnJpZ2h0ID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMudG9wICYmXG4gICAgaXNOdW1iZXJDbG9zZVRvKGNsaWVudFksIGVsbVBvc2l0aW9uLnRvcCwgY3Vyc29yUHJlY2lzaW9uKSAmJlxuICAgIGlzV2l0aGluQm91bmRpbmdYKHsgY2xpZW50WCwgcmVjdDogZWxtUG9zaXRpb24gfSlcbiAgKSB7XG4gICAgZWRnZXMudG9wID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMuYm90dG9tICYmXG4gICAgaXNOdW1iZXJDbG9zZVRvKGNsaWVudFksIGVsbVBvc2l0aW9uLmJvdHRvbSwgY3Vyc29yUHJlY2lzaW9uKSAmJlxuICAgIGlzV2l0aGluQm91bmRpbmdYKHsgY2xpZW50WCwgcmVjdDogZWxtUG9zaXRpb24gfSlcbiAgKSB7XG4gICAgZWRnZXMuYm90dG9tID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBlZGdlcztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXNpemVDdXJzb3JzIHtcbiAgdG9wTGVmdDogc3RyaW5nO1xuICB0b3BSaWdodDogc3RyaW5nO1xuICBib3R0b21MZWZ0OiBzdHJpbmc7XG4gIGJvdHRvbVJpZ2h0OiBzdHJpbmc7XG4gIGxlZnRPclJpZ2h0OiBzdHJpbmc7XG4gIHRvcE9yQm90dG9tOiBzdHJpbmc7XG59XG5cbmNvbnN0IERFRkFVTFRfUkVTSVpFX0NVUlNPUlM6IFJlc2l6ZUN1cnNvcnMgPSBPYmplY3QuZnJlZXplKHtcbiAgdG9wTGVmdDogJ253LXJlc2l6ZScsXG4gIHRvcFJpZ2h0OiAnbmUtcmVzaXplJyxcbiAgYm90dG9tTGVmdDogJ3N3LXJlc2l6ZScsXG4gIGJvdHRvbVJpZ2h0OiAnc2UtcmVzaXplJyxcbiAgbGVmdE9yUmlnaHQ6ICdjb2wtcmVzaXplJyxcbiAgdG9wT3JCb3R0b206ICdyb3ctcmVzaXplJ1xufSk7XG5cbmZ1bmN0aW9uIGdldFJlc2l6ZUN1cnNvcihlZGdlczogRWRnZXMsIGN1cnNvcnM6IFJlc2l6ZUN1cnNvcnMpOiBzdHJpbmcge1xuICBpZiAoZWRnZXMubGVmdCAmJiBlZGdlcy50b3ApIHtcbiAgICByZXR1cm4gY3Vyc29ycy50b3BMZWZ0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLnJpZ2h0ICYmIGVkZ2VzLnRvcCkge1xuICAgIHJldHVybiBjdXJzb3JzLnRvcFJpZ2h0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLmxlZnQgJiYgZWRnZXMuYm90dG9tKSB7XG4gICAgcmV0dXJuIGN1cnNvcnMuYm90dG9tTGVmdDtcbiAgfSBlbHNlIGlmIChlZGdlcy5yaWdodCAmJiBlZGdlcy5ib3R0b20pIHtcbiAgICByZXR1cm4gY3Vyc29ycy5ib3R0b21SaWdodDtcbiAgfSBlbHNlIGlmIChlZGdlcy5sZWZ0IHx8IGVkZ2VzLnJpZ2h0KSB7XG4gICAgcmV0dXJuIGN1cnNvcnMubGVmdE9yUmlnaHQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMudG9wIHx8IGVkZ2VzLmJvdHRvbSkge1xuICAgIHJldHVybiBjdXJzb3JzLnRvcE9yQm90dG9tO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFZGdlc0RpZmYoe1xuICBlZGdlcyxcbiAgaW5pdGlhbFJlY3RhbmdsZSxcbiAgbmV3UmVjdGFuZ2xlXG59OiB7XG4gIGVkZ2VzOiBFZGdlcztcbiAgaW5pdGlhbFJlY3RhbmdsZTogQm91bmRpbmdSZWN0YW5nbGU7XG4gIG5ld1JlY3RhbmdsZTogQm91bmRpbmdSZWN0YW5nbGU7XG59KTogRWRnZXMge1xuICBjb25zdCBlZGdlc0RpZmY6IEVkZ2VzID0ge307XG4gIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGVkZ2UgPT4ge1xuICAgIGVkZ2VzRGlmZltlZGdlXSA9IChuZXdSZWN0YW5nbGVbZWRnZV0gfHwgMCkgLSAoaW5pdGlhbFJlY3RhbmdsZVtlZGdlXSB8fCAwKTtcbiAgfSk7XG4gIHJldHVybiBlZGdlc0RpZmY7XG59XG5cbmNvbnN0IFJFU0laRV9BQ1RJVkVfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtYWN0aXZlJztcbmNvbnN0IFJFU0laRV9MRUZUX0hPVkVSX0NMQVNTOiBzdHJpbmcgPSAncmVzaXplLWxlZnQtaG92ZXInO1xuY29uc3QgUkVTSVpFX1JJR0hUX0hPVkVSX0NMQVNTOiBzdHJpbmcgPSAncmVzaXplLXJpZ2h0LWhvdmVyJztcbmNvbnN0IFJFU0laRV9UT1BfSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtdG9wLWhvdmVyJztcbmNvbnN0IFJFU0laRV9CT1RUT01fSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtYm90dG9tLWhvdmVyJztcbmNvbnN0IFJFU0laRV9HSE9TVF9FTEVNRU5UX0NMQVNTOiBzdHJpbmcgPSAncmVzaXplLWdob3N0LWVsZW1lbnQnO1xuXG5leHBvcnQgY29uc3QgTU9VU0VfTU9WRV9USFJPVFRMRV9NUzogbnVtYmVyID0gNTA7XG5cbi8qKlxuICogUGxhY2UgdGhpcyBvbiBhbiBlbGVtZW50IHRvIG1ha2UgaXQgcmVzaXphYmxlLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBodG1sXG4gKiA8ZGl2XG4gKiAgIG13bFJlc2l6YWJsZVxuICogICBbcmVzaXplRWRnZXNdPVwie2JvdHRvbTogdHJ1ZSwgcmlnaHQ6IHRydWUsIHRvcDogdHJ1ZSwgbGVmdDogdHJ1ZX1cIlxuICogICBbZW5hYmxlR2hvc3RSZXNpemVdPVwidHJ1ZVwiPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bFJlc2l6YWJsZV0nXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6YWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJlZm9yZSBlYWNoIHJlc2l6ZSBldmVudC4gUmV0dXJuIGB0cnVlYCB0byBhbGxvdyB0aGUgcmVzaXplIGV2ZW50IHRvIHByb3BhZ2F0ZSBvciBgZmFsc2VgIHRvIGNhbmNlbCBpdFxuICAgKi9cbiAgQElucHV0KCkgdmFsaWRhdGVSZXNpemU6IChyZXNpemVFdmVudDogUmVzaXplRXZlbnQpID0+IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBlZGdlcyB0aGF0IGFuIGVsZW1lbnQgY2FuIGJlIHJlc2l6ZWQgZnJvbS4gUGFzcyBhbiBvYmplY3QgbGlrZSBge3RvcDogdHJ1ZSwgYm90dG9tOiBmYWxzZX1gLiBCeSBkZWZhdWx0IG5vIGVkZ2VzIGNhbiBiZSByZXNpemVkLlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYSByZXNpemUgaGFuZGxlIGluc3RlYWQgdGhhdCBwb3NpdGlvbnMgaXRzZWxmIHRvIHRoZSBzaWRlIG9mIHRoZSBlbGVtZW50IHlvdSB3b3VsZCBsaWtlIHRvIHJlc2l6ZVxuICAgKi9cbiAgQElucHV0KCkgcmVzaXplRWRnZXM6IEVkZ2VzID0ge307XG5cbiAgLyoqXG4gICAqIFNldCB0byBgdHJ1ZWAgdG8gZW5hYmxlIGEgdGVtcG9yYXJ5IHJlc2l6aW5nIGVmZmVjdCBvZiB0aGUgZWxlbWVudCBpbiBiZXR3ZWVuIHRoZSBgcmVzaXplU3RhcnRgIGFuZCBgcmVzaXplRW5kYCBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKSBlbmFibGVHaG9zdFJlc2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIHNuYXAgZ3JpZCB0aGF0IHJlc2l6ZSBldmVudHMgd2lsbCBiZSBsb2NrZWQgdG8uXG4gICAqXG4gICAqIGUuZy4gdG8gb25seSBhbGxvdyB0aGUgZWxlbWVudCB0byBiZSByZXNpemVkIGV2ZXJ5IDEwcHggc2V0IGl0IHRvIGB7bGVmdDogMTAsIHJpZ2h0OiAxMH1gXG4gICAqL1xuICBASW5wdXQoKSByZXNpemVTbmFwR3JpZDogRWRnZXMgPSB7fTtcblxuICAvKipcbiAgICogVGhlIG1vdXNlIGN1cnNvcnMgdGhhdCB3aWxsIGJlIHNldCBvbiB0aGUgcmVzaXplIGVkZ2VzXG4gICAqL1xuICBASW5wdXQoKSByZXNpemVDdXJzb3JzOiBSZXNpemVDdXJzb3JzID0gREVGQVVMVF9SRVNJWkVfQ1VSU09SUztcblxuICAvKipcbiAgICogTW91c2Ugb3ZlciB0aGlja25lc3MgdG8gYWN0aXZlIGN1cnNvci5cbiAgICogQGRlcHJlY2F0ZWQgaW52YWxpZCB3aGVuIHlvdSBtaWdyYXRlIHRvIHVzZSByZXNpemUgaGFuZGxlcyBpbnN0ZWFkIG9mIHNldHRpbmcgcmVzaXplRWRnZXMgb24gdGhlIGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIHJlc2l6ZUN1cnNvclByZWNpc2lvbjogbnVtYmVyID0gMztcblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwb3NpdGlvbmluZyBvZiB0aGUgZ2hvc3QgZWxlbWVudCAoY2FuIGJlIGZpeGVkIG9yIGFic29sdXRlKVxuICAgKi9cbiAgQElucHV0KCkgZ2hvc3RFbGVtZW50UG9zaXRpb25pbmc6ICdmaXhlZCcgfCAnYWJzb2x1dGUnID0gJ2ZpeGVkJztcblxuICAvKipcbiAgICogQWxsb3cgZWxlbWVudHMgdG8gYmUgcmVzaXplZCB0byBuZWdhdGl2ZSBkaW1lbnNpb25zXG4gICAqL1xuICBASW5wdXQoKSBhbGxvd05lZ2F0aXZlUmVzaXplczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbW91c2UgaXMgcHJlc3NlZCBhbmQgYSByZXNpemUgZXZlbnQgaXMgYWJvdXQgdG8gYmVnaW4uIGAkZXZlbnRgIGlzIGEgYFJlc2l6ZUV2ZW50YCBvYmplY3QuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVzaXplU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYXMgdGhlIG1vdXNlIGlzIGRyYWdnZWQgYWZ0ZXIgYSByZXNpemUgZXZlbnQgaGFzIGJlZ3VuLiBgJGV2ZW50YCBpcyBhIGBSZXNpemVFdmVudGAgb2JqZWN0LlxuICAgKi9cbiAgQE91dHB1dCgpIHJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxSZXNpemVFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBtb3VzZSBpcyByZWxlYXNlZCBhZnRlciBhIHJlc2l6ZSBldmVudC4gYCRldmVudGAgaXMgYSBgUmVzaXplRXZlbnRgIG9iamVjdC5cbiAgICovXG4gIEBPdXRwdXQoKSByZXNpemVFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2V1cCA9IG5ldyBTdWJqZWN0PHtcbiAgICBjbGllbnRYOiBudW1iZXI7XG4gICAgY2xpZW50WTogbnVtYmVyO1xuICAgIGVkZ2VzPzogRWRnZXM7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHB1YmxpYyBtb3VzZWRvd24gPSBuZXcgU3ViamVjdDx7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBlZGdlcz86IEVkZ2VzO1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2Vtb3ZlID0gbmV3IFN1YmplY3Q8e1xuICAgIGNsaWVudFg6IG51bWJlcjtcbiAgICBjbGllbnRZOiBudW1iZXI7XG4gICAgZWRnZXM/OiBFZGdlcztcbiAgICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQ7XG4gIH0+KCk7XG5cbiAgcHJpdmF0ZSBwb2ludGVyRXZlbnRMaXN0ZW5lcnM6IFBvaW50ZXJFdmVudExpc3RlbmVycztcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwcml2YXRlIHJlc2l6ZUVkZ2VzJCA9IG5ldyBTdWJqZWN0PEVkZ2VzPigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIHBsYXRmb3JtSWQ6IGFueSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGVsbTogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxuICApIHtcbiAgICB0aGlzLnBvaW50ZXJFdmVudExpc3RlbmVycyA9IFBvaW50ZXJFdmVudExpc3RlbmVycy5nZXRJbnN0YW5jZShcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgem9uZVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gVE9ETyAtIHVzZSBzb21lIGZhbmN5IE9ic2VydmFibGUubWVyZ2UncyBmb3IgdGhpc1xuICAgIHRoaXMucG9pbnRlckV2ZW50TGlzdGVuZXJzLnBvaW50ZXJEb3duXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFkgfSkgPT4ge1xuICAgICAgICB0aGlzLm1vdXNlZG93bi5uZXh0KHsgY2xpZW50WCwgY2xpZW50WSB9KTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5wb2ludGVyRXZlbnRMaXN0ZW5lcnMucG9pbnRlck1vdmVcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgY2xpZW50WCwgY2xpZW50WSwgZXZlbnQgfSkgPT4ge1xuICAgICAgICB0aGlzLm1vdXNlbW92ZS5uZXh0KHsgY2xpZW50WCwgY2xpZW50WSwgZXZlbnQgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMucG9pbnRlckV2ZW50TGlzdGVuZXJzLnBvaW50ZXJVcFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZIH0pID0+IHtcbiAgICAgICAgdGhpcy5tb3VzZXVwLm5leHQoeyBjbGllbnRYLCBjbGllbnRZIH0pO1xuICAgICAgfSk7XG5cbiAgICBsZXQgY3VycmVudFJlc2l6ZToge1xuICAgICAgZWRnZXM6IEVkZ2VzO1xuICAgICAgc3RhcnRpbmdSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZTtcbiAgICAgIGN1cnJlbnRSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZTtcbiAgICAgIGNsb25lZE5vZGU/OiBIVE1MRWxlbWVudDtcbiAgICB9IHwgbnVsbDtcblxuICAgIGNvbnN0IHJlbW92ZUdob3N0RWxlbWVudCA9ICgpID0+IHtcbiAgICAgIGlmIChjdXJyZW50UmVzaXplICYmIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSkge1xuICAgICAgICB0aGlzLmVsbS5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoXG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbG0ubmF0aXZlRWxlbWVudCwgJ3Zpc2liaWxpdHknLCAnaW5oZXJpdCcpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBnZXRSZXNpemVDdXJzb3JzID0gKCk6IFJlc2l6ZUN1cnNvcnMgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uREVGQVVMVF9SRVNJWkVfQ1VSU09SUyxcbiAgICAgICAgLi4udGhpcy5yZXNpemVDdXJzb3JzXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBtb3VzZU1vdmU6IE9ic2VydmFibGU8YW55PiA9IHRoaXMubW91c2Vtb3ZlLnBpcGUoc2hhcmUoKSk7XG5cbiAgICBtb3VzZU1vdmUucGlwZShmaWx0ZXIoKCkgPT4gISFjdXJyZW50UmVzaXplKSkuc3Vic2NyaWJlKCh7IGV2ZW50IH0pID0+IHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlc2l6ZUVkZ2VzJFxuICAgICAgLnBpcGUoXG4gICAgICAgIHN0YXJ0V2l0aCh0aGlzLnJlc2l6ZUVkZ2VzKSxcbiAgICAgICAgbWFwKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5yZXNpemVFZGdlcyAmJlxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5yZXNpemVFZGdlcykuc29tZShlZGdlID0+ICEhdGhpcy5yZXNpemVFZGdlc1tlZGdlXSlcbiAgICAgICAgICApO1xuICAgICAgICB9KSxcbiAgICAgICAgc3dpdGNoTWFwKGxlZ2FjeVJlc2l6ZUVkZ2VzRW5hYmxlZCA9PlxuICAgICAgICAgIGxlZ2FjeVJlc2l6ZUVkZ2VzRW5hYmxlZCA/IG1vdXNlTW92ZSA6IEVNUFRZXG4gICAgICAgICksXG4gICAgICAgIGF1ZGl0VGltZShNT1VTRV9NT1ZFX1RIUk9UVExFX01TKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZIH0pID0+IHtcbiAgICAgICAgY29uc3QgcmVzaXplRWRnZXM6IEVkZ2VzID0gZ2V0UmVzaXplRWRnZXMoe1xuICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICBlbG06IHRoaXMuZWxtLFxuICAgICAgICAgIGFsbG93ZWRFZGdlczogdGhpcy5yZXNpemVFZGdlcyxcbiAgICAgICAgICBjdXJzb3JQcmVjaXNpb246IHRoaXMucmVzaXplQ3Vyc29yUHJlY2lzaW9uXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXNpemVDdXJzb3JzID0gZ2V0UmVzaXplQ3Vyc29ycygpO1xuICAgICAgICBpZiAoIWN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgICBjb25zdCBjdXJzb3IgPSBnZXRSZXNpemVDdXJzb3IocmVzaXplRWRnZXMsIHJlc2l6ZUN1cnNvcnMpO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbG0ubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsIGN1cnNvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX0xFRlRfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMubGVmdCA9PT0gdHJ1ZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNldEVsZW1lbnRDbGFzcyhcbiAgICAgICAgICB0aGlzLmVsbSxcbiAgICAgICAgICBSRVNJWkVfUklHSFRfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMucmlnaHQgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX1RPUF9IT1ZFUl9DTEFTUyxcbiAgICAgICAgICByZXNpemVFZGdlcy50b3AgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX0JPVFRPTV9IT1ZFUl9DTEFTUyxcbiAgICAgICAgICByZXNpemVFZGdlcy5ib3R0b20gPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VkcmFnOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLm1vdXNlZG93blxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKHN0YXJ0Q29vcmRzID0+IHtcbiAgICAgICAgICBmdW5jdGlvbiBnZXREaWZmKG1vdmVDb29yZHM6IHsgY2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXIgfSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY2xpZW50WDogbW92ZUNvb3Jkcy5jbGllbnRYIC0gc3RhcnRDb29yZHMuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogbW92ZUNvb3Jkcy5jbGllbnRZIC0gc3RhcnRDb29yZHMuY2xpZW50WVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBnZXRTbmFwR3JpZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0geyB4OiAxLCB5OiAxIH07XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZVNuYXBHcmlkLmxlZnQgJiYgY3VycmVudFJlc2l6ZS5lZGdlcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueCA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLmxlZnQ7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVTbmFwR3JpZC5yaWdodCAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuZWRnZXMucmlnaHRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueCA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLnJpZ2h0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVzaXplU25hcEdyaWQudG9wICYmIGN1cnJlbnRSZXNpemUuZWRnZXMudG9wKSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueSA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLnRvcDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZVNuYXBHcmlkLmJvdHRvbSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuZWRnZXMuYm90dG9tXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNuYXBHcmlkLnkgPSArdGhpcy5yZXNpemVTbmFwR3JpZC5ib3R0b207XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNuYXBHcmlkO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmdW5jdGlvbiBnZXRHcmlkKFxuICAgICAgICAgICAgY29vcmRzOiB7IGNsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyIH0sXG4gICAgICAgICAgICBzbmFwR3JpZDogQ29vcmRpbmF0ZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgeDogTWF0aC5jZWlsKGNvb3Jkcy5jbGllbnRYIC8gc25hcEdyaWQueCksXG4gICAgICAgICAgICAgIHk6IE1hdGguY2VpbChjb29yZHMuY2xpZW50WSAvIHNuYXBHcmlkLnkpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgIG1vdXNlTW92ZS5waXBlKHRha2UoMSkpLnBpcGUobWFwKGNvb3JkcyA9PiBbLCBjb29yZHNdKSksXG4gICAgICAgICAgICBtb3VzZU1vdmUucGlwZShwYWlyd2lzZSgpKVxuICAgICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBtYXAoKFtwcmV2aW91c0Nvb3JkcywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyA/IGdldERpZmYocHJldmlvdXNDb29yZHMpIDogcHJldmlvdXNDb29yZHMsXG4gICAgICAgICAgICAgICAgICBnZXREaWZmKG5ld0Nvb3JkcylcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIGZpbHRlcigoW3ByZXZpb3VzQ29vcmRzLCBuZXdDb29yZHNdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c0Nvb3Jkcykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcEdyaWQ6IENvb3JkaW5hdGUgPSBnZXRTbmFwR3JpZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzR3JpZDogQ29vcmRpbmF0ZSA9IGdldEdyaWQoXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyxcbiAgICAgICAgICAgICAgICAgIHNuYXBHcmlkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdHcmlkOiBDb29yZGluYXRlID0gZ2V0R3JpZChuZXdDb29yZHMsIHNuYXBHcmlkKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0dyaWQueCAhPT0gbmV3R3JpZC54IHx8IHByZXZpb3VzR3JpZC55ICE9PSBuZXdHcmlkLnlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIG1hcCgoWywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0gZ2V0U25hcEdyaWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgY2xpZW50WDpcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChuZXdDb29yZHMuY2xpZW50WCAvIHNuYXBHcmlkLngpICogc25hcEdyaWQueCxcbiAgICAgICAgICAgICAgICAgIGNsaWVudFk6XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQobmV3Q29vcmRzLmNsaWVudFkgLyBzbmFwR3JpZC55KSAqIHNuYXBHcmlkLnlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMubW91c2V1cCwgdGhpcy5tb3VzZWRvd24pKSk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShmaWx0ZXIoKCkgPT4gISFjdXJyZW50UmVzaXplKSk7XG5cbiAgICBtb3VzZWRyYWdcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHsgY2xpZW50WCwgY2xpZW50WSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZSEuc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgY2xpZW50WVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChuZXdCb3VuZGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuYWxsb3dOZWdhdGl2ZVJlc2l6ZXMgfHxcbiAgICAgICAgICAgICEhKFxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ICYmXG4gICAgICAgICAgICAgIG5ld0JvdW5kaW5nUmVjdC53aWR0aCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ID4gMCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3Qud2lkdGggPiAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVJlc2l6ZVxuICAgICAgICAgICAgPyB0aGlzLnZhbGlkYXRlUmVzaXplKHtcbiAgICAgICAgICAgICAgICByZWN0YW5nbGU6IG5ld0JvdW5kaW5nUmVjdCxcbiAgICAgICAgICAgICAgICBlZGdlczogZ2V0RWRnZXNEaWZmKHtcbiAgICAgICAgICAgICAgICAgIGVkZ2VzOiBjdXJyZW50UmVzaXplIS5lZGdlcyxcbiAgICAgICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogbmV3Qm91bmRpbmdSZWN0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZXNpemUgJiYgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdoZWlnaHQnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LmhlaWdodH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LndpZHRofXB4YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICd0b3AnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LnRvcH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnbGVmdCcsXG4gICAgICAgICAgICBgJHtuZXdCb3VuZGluZ1JlY3QubGVmdH1weGBcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNpemluZy5lbWl0KHtcbiAgICAgICAgICAgIGVkZ2VzOiBnZXRFZGdlc0RpZmYoe1xuICAgICAgICAgICAgICBlZGdlczogY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgbmV3UmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3RcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3VycmVudFJlc2l6ZSEuY3VycmVudFJlY3QgPSBuZXdCb3VuZGluZ1JlY3Q7XG4gICAgICB9KTtcblxuICAgIHRoaXMubW91c2Vkb3duXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKCh7IGNsaWVudFgsIGNsaWVudFksIGVkZ2VzIH0pID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZWRnZXMgfHxcbiAgICAgICAgICAgIGdldFJlc2l6ZUVkZ2VzKHtcbiAgICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICAgICAgZWxtOiB0aGlzLmVsbSxcbiAgICAgICAgICAgICAgYWxsb3dlZEVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzLFxuICAgICAgICAgICAgICBjdXJzb3JQcmVjaXNpb246IHRoaXMucmVzaXplQ3Vyc29yUHJlY2lzaW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChlZGdlczogRWRnZXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZWRnZXMpLmxlbmd0aCA+IDA7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChlZGdlczogRWRnZXMpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgICByZW1vdmVHaG9zdEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlID0gZ2V0RWxlbWVudFJlY3QoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRQb3NpdGlvbmluZ1xuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UmVzaXplID0ge1xuICAgICAgICAgIGVkZ2VzLFxuICAgICAgICAgIHN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICBjdXJyZW50UmVjdDogc3RhcnRpbmdSZWN0XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc2l6ZUN1cnNvcnMgPSBnZXRSZXNpemVDdXJzb3JzKCk7XG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGdldFJlc2l6ZUN1cnNvcihjdXJyZW50UmVzaXplLmVkZ2VzLCByZXNpemVDdXJzb3JzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgY3Vyc29yKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbG0sIFJFU0laRV9BQ1RJVkVfQ0xBU1MsIHRydWUpO1xuICAgICAgICBpZiAodGhpcy5lbmFibGVHaG9zdFJlc2l6ZSkge1xuICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSA9IHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAndmlzaWJpbGl0eScsXG4gICAgICAgICAgICAnaGlkZGVuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdwb3NpdGlvbicsXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudFBvc2l0aW9uaW5nXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2xlZnQnLFxuICAgICAgICAgICAgYCR7Y3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3QubGVmdH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAndG9wJyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LnRvcH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LmhlaWdodH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgYCR7Y3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3Qud2lkdGh9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2N1cnNvcicsXG4gICAgICAgICAgICBnZXRSZXNpemVDdXJzb3IoY3VycmVudFJlc2l6ZS5lZGdlcywgcmVzaXplQ3Vyc29ycylcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICBSRVNJWkVfR0hPU1RfRUxFTUVOVF9DTEFTU1xuICAgICAgICAgICk7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlIS5zY3JvbGxUb3AgPSBjdXJyZW50UmVzaXplLnN0YXJ0aW5nUmVjdFxuICAgICAgICAgICAgLnNjcm9sbFRvcCBhcyBudW1iZXI7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlIS5zY3JvbGxMZWZ0ID0gY3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3RcbiAgICAgICAgICAgIC5zY3JvbGxMZWZ0IGFzIG51bWJlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc2l6ZVN0YXJ0LmVtaXQoe1xuICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgIGVkZ2VzLFxuICAgICAgICAgICAgICBpbml0aWFsUmVjdGFuZ2xlOiBzdGFydGluZ1JlY3QsXG4gICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogc3RhcnRpbmdSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogZ2V0TmV3Qm91bmRpbmdSZWN0YW5nbGUoc3RhcnRpbmdSZWN0LCB7fSwgMCwgMClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMubW91c2V1cC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCBSRVNJWkVfQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgJycpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnJyk7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzaXplRW5kLmVtaXQoe1xuICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgIGVkZ2VzOiBjdXJyZW50UmVzaXplIS5lZGdlcyxcbiAgICAgICAgICAgICAgaW5pdGlhbFJlY3RhbmdsZTogY3VycmVudFJlc2l6ZSEuc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgICBuZXdSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLmN1cnJlbnRSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogY3VycmVudFJlc2l6ZSEuY3VycmVudFJlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZUdob3N0RWxlbWVudCgpO1xuICAgICAgICBjdXJyZW50UmVzaXplID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMucmVzaXplRWRnZXMpIHtcbiAgICAgIHRoaXMucmVzaXplRWRnZXMkLm5leHQodGhpcy5yZXNpemVFZGdlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIC8vIGJyb3dzZXIgY2hlY2sgZm9yIGFuZ3VsYXIgdW5pdmVyc2FsLCBiZWNhdXNlIGl0IGRvZXNuJ3Qga25vdyB3aGF0IGRvY3VtZW50IGlzXG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZG9jdW1lbnQuYm9keSwgJ2N1cnNvcicsICcnKTtcbiAgICB9XG4gICAgdGhpcy5tb3VzZWRvd24uY29tcGxldGUoKTtcbiAgICB0aGlzLm1vdXNldXAuY29tcGxldGUoKTtcbiAgICB0aGlzLm1vdXNlbW92ZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMucmVzaXplRWRnZXMkLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldEVsZW1lbnRDbGFzcyhlbG06IEVsZW1lbnRSZWYsIG5hbWU6IHN0cmluZywgYWRkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGFkZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbG0ubmF0aXZlRWxlbWVudCwgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxtLm5hdGl2ZUVsZW1lbnQsIG5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQb2ludGVyRXZlbnRMaXN0ZW5lcnMge1xuICBwdWJsaWMgcG9pbnRlckRvd246IE9ic2VydmFibGU8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT47XG5cbiAgcHVibGljIHBvaW50ZXJNb3ZlOiBPYnNlcnZhYmxlPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+O1xuXG4gIHB1YmxpYyBwb2ludGVyVXA6IE9ic2VydmFibGU8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT47XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFBvaW50ZXJFdmVudExpc3RlbmVyczsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICB6b25lOiBOZ1pvbmVcbiAgKTogUG9pbnRlckV2ZW50TGlzdGVuZXJzIHtcbiAgICBpZiAoIVBvaW50ZXJFdmVudExpc3RlbmVycy5pbnN0YW5jZSkge1xuICAgICAgUG9pbnRlckV2ZW50TGlzdGVuZXJzLmluc3RhbmNlID0gbmV3IFBvaW50ZXJFdmVudExpc3RlbmVycyhcbiAgICAgICAgcmVuZGVyZXIsXG4gICAgICAgIHpvbmVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBQb2ludGVyRXZlbnRMaXN0ZW5lcnMuaW5zdGFuY2U7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCB6b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLnBvaW50ZXJEb3duID0gbmV3IE9ic2VydmFibGUoXG4gICAgICAob2JzZXJ2ZXI6IE9ic2VydmVyPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+KSA9PiB7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZU1vdXNlRG93bjogKCkgPT4gdm9pZDtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlVG91Y2hTdGFydDogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlRG93biA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2Vkb3duJyxcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hTdGFydCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VEb3duKCk7XG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaFN0YXJ0KCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgdGhpcy5wb2ludGVyTW92ZSA9IG5ldyBPYnNlcnZhYmxlKFxuICAgICAgKG9ic2VydmVyOiBPYnNlcnZlcjxQb2ludGVyRXZlbnRDb29yZGluYXRlPikgPT4ge1xuICAgICAgICBsZXQgdW5zdWJzY3JpYmVNb3VzZU1vdmU6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoTW92ZTogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlTW92ZSA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hNb3ZlID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlTW92ZSgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hNb3ZlKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgdGhpcy5wb2ludGVyVXAgPSBuZXcgT2JzZXJ2YWJsZShcbiAgICAgIChvYnNlcnZlcjogT2JzZXJ2ZXI8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT4pID0+IHtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlTW91c2VVcDogKCkgPT4gdm9pZDtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlVG91Y2hFbmQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsOiAoKSA9PiB2b2lkO1xuXG4gICAgICAgIHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VVcCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoRW5kID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaGVuZCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVNb3VzZVVwKCk7XG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaEVuZCgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hDYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApLnBpcGUoc2hhcmUoKSk7XG4gIH1cbn1cbiJdfQ==