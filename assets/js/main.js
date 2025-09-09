(function () {
  const PRODUCTS = window.PRODUCTS || [];

  const countEl = document.getElementById("cart-count");

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("ta_cart") || "[]");
    } catch (e) {
      return [];
    }
  }

  function setCount() {
    if (!countEl) return;
    const cart = getCart();
    const total = cart.reduce((a, i) => a + (i.qty || 1), 0);
    countEl.textContent = total;
  }

  document.addEventListener("DOMContentLoaded", setCount);
})();
