(function () {
  
  const PRODUCTS = [
   
    {
      id: "p1",
      title: "Remera 01",
      price: 15000,
      img: "assets/img/products/product_1.png",
    },
    {
      id: "p2",
      title: "Remera 02",
      price: 15000,
      img: "assets/img/products/product_2.png",
    },
    {
      id: "p3",
      title: "Remera 03",
      price: 15000,
      img: "assets/img/products/product_3.png",
    },
    {
      id: "p4",
      title: "Remera 04",
      price: 15000,
      img: "assets/img/products/product_4.png",
    },
    {
      id: "p5",
      title: "Remera 05",
      price: 15000,
      img: "assets/img/products/product_5.png",
    },
    {
      id: "p6",
      title: "Remera 06",
      price: 15000,
      img: "assets/img/products/product_6.png",
    },
    {
      id: "p7",
      title: "Remera 07",
      price: 15000,
      img: "assets/img/products/product_7.png",
    },
    {
      id: "p8",
      title: "Remera 08",
      price: 15000,
      img: "assets/img/products/product_8.png",
    },
    {
      id: "p9",
      title: "Remera 09",
      price: 15000,
      img: "assets/img/products/product_9.png",
    },
    {
      id: "p10",
      title: "Remera 10",
      price: 15000,
      img: "assets/img/products/product_10.png",
    },
  ];
  const FALLBACK_IMG = "assets/img/placeholder_square.jpg";

  
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const money = (n) => "$ " + Number(n || 0).toLocaleString("es-AR");

  const CART_KEY = "ta_cart";
  const getCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  };
  const saveCart = (c) => {
    localStorage.setItem(CART_KEY, JSON.stringify(c));
    document.dispatchEvent(new Event("cart:changed"));
  };


  function renderProducts() {
    const grid = $("#products");
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(
      (p) => `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card h-100">
          <!-- PONÉ TU IMAGEN AQUÍ: ${p.img} -->
          <img src="${
            p.img
          }" onerror="this.src='${FALLBACK_IMG}'" class="card-img-top" alt="${
        p.title
      }">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <div class="price mb-3">${money(p.price)}</div>
            <button class="btn btn-dark mt-auto" data-add="${
              p.id
            }">Agregar</button>
          </div>
        </div>
      </div>
    `
    ).join("");

    $$("[data-add]", grid).forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.add));
    });
  }

  
  function addToCart(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const cart = getCart();
    const it = cart.find((x) => x.id === id);
    if (it) it.qty += 1;
    else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
    saveCart(cart);
    renderCart();
  }

  function changeQty(id, delta) {
    const cart = getCart();
    const it = cart.find((x) => x.id === id);
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) removeItem(id);
    else {
      saveCart(cart);
      renderCart();
    }
  }

  function removeItem(id) {
    const cart = getCart().filter((x) => x.id !== id);
    saveCart(cart);
    renderCart();
  }

  
  function renderCart() {
    const list = $("#cart-items");
    const empty = $("#cart-empty");
    const totalEl = $("#cart-total");
    if (!list || !empty || !totalEl) return;

    const cart = getCart();
    list.innerHTML = "";

    if (cart.length === 0) {
      empty.style.display = "block";
      totalEl.textContent = "$ 0";
      return;
    }
    empty.style.display = "none";

    let total = 0;

    cart.forEach((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      const img = p?.img || FALLBACK_IMG;
      const title = p?.title || i.id;
      const line = (p?.price ?? i.price) * i.qty;
      total += line;

      const row = document.createElement("div");
      row.className = "list-group-item d-flex align-items-center gap-3";
      row.innerHTML = `
        <img class="cart-thumb" src="${img}" onerror="this.src='${FALLBACK_IMG}'" alt="${title}">
        <div class="me-auto">
          <div class="fw-semibold">${title}</div>
          <div class="text-secondary small">x${i.qty}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-dark" data-dec="${
            i.id
          }" aria-label="Restar">-</button>
          <button class="btn btn-sm btn-outline-dark" data-inc="${
            i.id
          }" aria-label="Sumar">+</button>
          <span class="fw-semibold">${money(line)}</span>
          <button class="btn btn-sm btn-danger" data-del="${
            i.id
          }" aria-label="Quitar">x</button>
        </div>
      `;
      list.appendChild(row);
    });

    totalEl.textContent = money(total);

    // eventos de fila
    $$("[data-dec]", list).forEach((b) =>
      b.addEventListener("click", () => changeQty(b.dataset.dec, -1))
    );
    $$("[data-inc]", list).forEach((b) =>
      b.addEventListener("click", () => changeQty(b.dataset.inc, +1))
    );
    $$("[data-del]", list).forEach((b) =>
      b.addEventListener("click", () => removeItem(b.dataset.del))
    );
  }

  
  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderCart();
    const checkout = $("#checkout-btn");
    if (checkout) {
      checkout.addEventListener("click", () =>
        alert("¡Gracias! Esto es un demo. Podés conectar tu pasarela después.")
      );
    }
  });

  
  document.addEventListener("cart:changed", () => {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const total = getCart().reduce((a, i) => a + (i.qty || 1), 0);
    el.textContent = total;
  });
})();
