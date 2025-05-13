import { enableBgScroll } from "../../utils.js";

/**
 * What the function does:
 * - hide element
 * - erase all inner elements
 * - enable scrolling
 *
 * @param backdropEle backdrop element from HTML.
 * @returns none.
 */
export function closeBackDrop(backdropEle) {
  backdropEle.hide();
  backdropEle.html("");
  enableBgScroll();
}
/**
 * Similar with closeBackDrop or closePopup but difference name
 */
export const closeForm = closeBackDrop;
/**
 * Similar with closeBackDrop or closeForm but difference name
 */
export const closePopup = closeBackDrop;