// ==UserScript==
// @name         在 Microsoft Loop 进度跟踪器中启用 Shift + 滚轮横向滚动。
// @namespace    https://loop.microsoft.com/
// @version      1.0
// @description  在 Microsoft Loop 网页中启用 Shift/Alt/Ctrl + 滚轮 横向滚动，专门处理 scriptor-paragraph 容器内的进度跟踪器表格
// @author       SaltcoreYan
// @match        https://loop.cloud.microsoft.com/*
// @match        https://loop.microsoft.com/*
// @match        https://loop.cloud.microsoft/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const MODIFIER = 'Shift'; // 可选: 'Shift' | 'Alt' | 'Ctrl'
  const SPEED = 1.0;        // 滚动速度系数

  function modifierPressed(e) {
    return MODIFIER === 'Shift' ? e.shiftKey :
           MODIFIER === 'Alt'   ? e.altKey   :
           MODIFIER === 'Ctrl'  ? e.ctrlKey  : false;
  }

  window.addEventListener('wheel', e => {
    if (!modifierPressed(e)) return;

    const delta = (e.deltaMode === 1 ? e.deltaY * 16 :
                  e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY) * SPEED;

    const sb = e.target.closest('[data-automation-id="table-custom-horizontal-scroll"]')
            || document.querySelector('[data-automation-id="table-custom-horizontal-scroll"]');

    if (sb) {
      e.preventDefault();
      e.stopPropagation();
      const max = sb.scrollWidth - sb.clientWidth;
      const next = Math.max(0, Math.min(sb.scrollLeft + delta, max));
      sb.scrollLeft = next;
      sb.dispatchEvent(new Event('scroll', { bubbles: true })); // 关键：触发 Loop 内部同步
    }
  }, { passive: false, capture: true });

})();
