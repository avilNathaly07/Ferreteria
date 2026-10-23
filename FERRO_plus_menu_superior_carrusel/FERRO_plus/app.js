
const products = [
    { id: 1, name: "Taladro percutor 650 W", category: "Herramientas", price: 54.99, imagen: "imagenes/taladro.jpg", desc: "Velocidad variable y mandril de 13 mm." },
    { id: 2, name: "Martillo de uña 16 oz", category: "Herramientas", price: 12.50, imagen: "imagenes/martillo.jpg", desc: "Mango ergonómico y cabeza de acero." },
    { id: 3, name: "Juego de destornilladores", category: "Herramientas", price: 18.75, imagen: "imagenes/Destornillador.jpg", desc: "Set de 8 piezas, puntas planas y Phillips." },
    { id: 4, name: "Extensión eléctrica 5 m", category: "Eléctricos", price: 14.90, imagen: "imagenes/extension.jpg", desc: "Cable resistente para uso doméstico." },
    { id: 5, name: "Bombillo LED 12 W", category: "Eléctricos", price: 4.25, imagen: "imagenes/bombillo.jpg", desc: "Luz blanca, rosca estándar E27." },
    { id: 6, name: "Pintura látex blanca 1 gal", category: "Pintura", price: 23.80, imagen: "imagenes/pintura.jpg", desc: "Acabado mate para paredes interiores." },
    { id: 7, name: "Rodillo para pintar 9 pulg.", category: "Pintura", price: 6.75, imagen: "imagenes/rodillo.jpg", desc: "Incluye mango y felpa lavable." },
    { id: 8, name: "Llave ajustable 10 pulg.", category: "Plomería", price: 16.40, imagen: "imagenes/llave.jpg", desc: "Acero cromado de alta resistencia." },
    { id: 9, name: "Cinta teflón 12 m", category: "Plomería", price: 1.95, imagen: "imagenes/teflon.jpg", desc: "Sellado para conexiones roscadas." },
    { id: 10, name: "Alicate universal 8 pulg.", category: "Herramientas", price: 11.20, imagen: "imagenes/alicate.jpg", desc: "Agarre antideslizante y corte preciso." },
    { id: 11, name: "Interruptor sencillo", category: "Eléctricos", price: 3.60, imagen: "imagenes/interruptor.jpg", desc: "Para instalación eléctrica residencial." },
    { id: 12, name: "Codo PVC 1/2 pulg.", category: "Plomería", price: 0.85, imagen: "imagenes/codo.jpg", desc: "Conexión de 90° para tubería PVC." }
];

let cart = {}; let category = "Todos"; let loggedIn = false; let toastTimer;
const $ = id => document.getElementById(id); const money = n => "$" + n.toFixed(2);
function toast(msg) { $("toast").textContent = msg; $("toast").classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2400) }
function navigate(page) { if (!loggedIn && page !== "login") { page = "login" } document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === page)); $("bottomNav").classList.toggle("hidden", !loggedIn); document.querySelectorAll(".bottom-nav [data-go]").forEach(b => b.classList.toggle("active", b.dataset.go === page)); if (page === "cart") renderCart(); if (page === "catalog") renderCatalog(); history.replaceState(null, "", "#" + page); window.scrollTo({ top: 0, behavior: "instant" }) }
function productCard(p) { return `<article class="product"><div class="product-img"><img src="imagenes/producto-${p.id}.jpg" alt="${p.name}" loading="lazy" onerror="this.parentElement.classList.add(\'missing\')"><span class="photo-placeholder">▧<small>producto-${p.id}.jpg</small></span></div><div class="product-body"><div class="product-category">${p.category}</div><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-price">${money(p.price)}</div><button class="primary full" data-add="${p.id}" aria-label="Agregar ${p.name} al carrito">+ Agregar al carrito</button></div></article>` }
function renderFeatured() { $("featured").innerHTML = products.slice(0, 4).map(productCard).join("") }
function renderFilters() { $("filterButtons").innerHTML = ["Todos", "Herramientas", "Eléctricos", "Pintura", "Plomería"].map(c => `<button class="chip ${c === category ? "active" : ""}" data-filter="${c}">${c}</button>`).join("") }
function renderCatalog() { renderFilters(); let q = $("search").value.trim().toLocaleLowerCase("es"); let filtered = products.filter(p => (category === "Todos" || p.category === category) && (p.name.toLocaleLowerCase("es").includes(q) || p.category.toLocaleLowerCase("es").includes(q))); $("catalogGrid").innerHTML = filtered.map(productCard).join(""); $("resultCount").textContent = `${filtered.length} producto${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`; $("noResults").classList.toggle("hidden", filtered.length > 0) }
function count() { return Object.values(cart).reduce((s, n) => s + n, 0) }
function updateBadge() { $("cartCount").textContent = count() }
function add(id) { cart[id] = (cart[id] || 0) + 1; updateBadge(); toast("Producto agregado al carrito ✓") }
function renderCart() { let ids = Object.keys(cart).filter(id => cart[id] > 0); $("cartEmpty").classList.toggle("hidden", ids.length > 0); $("cartFilled").classList.toggle("hidden", ids.length === 0); if (!ids.length) return; $("cartItems").innerHTML = ids.map(id => { let p = products.find(p => p.id === +id); return `<article class="cart-item"><div class="cart-emoji"><img src="imagenes/producto-${p.id}.jpg" alt="${p.name}" onerror="this.parentElement.classList.add(\'missing\')"><span class="photo-placeholder">▧</span></div><div class="cart-detail"><h3>${p.name}</h3><p>${money(p.price)} por unidad</p><div class="qty"><button data-qty="${id}" data-delta="-1" aria-label="Quitar una unidad de ${p.name}">−</button><strong>${cart[id]}</strong><button data-qty="${id}" data-delta="1" aria-label="Agregar una unidad de ${p.name}">+</button><button class="remove" data-remove="${id}">Eliminar</button></div></div><strong>${money(p.price * cart[id])}</strong></article>` }).join(""); let sub = ids.reduce((s, id) => s + products.find(p => p.id === +id).price * cart[id], 0); let shipping = sub >= 75 ? 0 : 5.00; $("subtotal").textContent = money(sub); $("shipping").textContent = shipping ? money(shipping) : "Gratis"; $("total").textContent = money(sub + shipping) }
function fieldError(id, message) { $(id).classList.toggle("invalid", !!message); $(id + "Error").textContent = message; $(id).setAttribute("aria-invalid", String(!!message)) }
$("loginForm").addEventListener("submit", e => { e.preventDefault(); let email = $("email").value.trim(); let pw = $("password").value; let emailError = !email ? "Ingresa tu correo electrónico." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Ingresa un correo válido." : ""; let passError = !pw ? "Ingresa tu contraseña." : pw.length < 6 ? "La contraseña debe tener al menos 6 caracteres." : ""; fieldError("email", emailError); fieldError("password", passError); if (emailError || passError) return; loggedIn = true; navigate("home"); toast("¡Bienvenido a FERRO+!") });
["email", "password"].forEach(id => $(id).addEventListener("input", () => fieldError(id, "")));
$("togglePassword").addEventListener("click", () => { let show = $("password").type === "password"; $("password").type = show ? "text" : "password"; $("togglePassword").textContent = show ? "Ocultar" : "Mostrar" });
document.addEventListener("click", e => { let addButton = e.target.closest("[data-add]"); if (addButton) add(+addButton.dataset.add); let go = e.target.closest("[data-go]"); if (go) navigate(go.dataset.go); let filter = e.target.closest("[data-filter]"); if (filter) { category = filter.dataset.filter; navigate("catalog") } let cat = e.target.closest("[data-category]"); if (cat) { category = cat.dataset.category; navigate("catalog") } let qty = e.target.closest("[data-qty]"); if (qty) { let id = qty.dataset.qty; cart[id] = Math.max(0, (cart[id] || 0) + Number(qty.dataset.delta)); if (!cart[id]) delete cart[id]; updateBadge(); renderCart() } let remove = e.target.closest("[data-remove]"); if (remove) { delete cart[remove.dataset.remove]; updateBadge(); renderCart(); toast("Producto eliminado del carrito") } });
$("search").addEventListener("input", renderCatalog);
$("clearFilters").addEventListener("click", () => { category = "Todos"; $("search").value = ""; renderCatalog() });
$("cartTop").addEventListener("click", () => navigate("cart"));
$("logout").addEventListener("click", () => { loggedIn = false; cart = {}; updateBadge(); $("loginForm").reset(); navigate("login"); toast("Sesión cerrada") });
$("confirmOrder").addEventListener("click", () => { if (!count()) return; $("orderNumber").textContent = "#FP-" + String(Date.now()).slice(-6); cart = {}; updateBadge(); navigate("success") });
$("backHome").addEventListener("click", () => navigate("home"));
document.querySelector(".brand").addEventListener("click", e => { e.preventDefault(); navigate(loggedIn ? "home" : "login") });
renderFeatured(); renderCatalog(); navigate("login");

// Carrusel: botones, indicadores y rotación automática cada 5 segundos.
let currentBanner = 0;
const bannerSlides = [...document.querySelectorAll(".banner-slide")];
const bannerDots = [...document.querySelectorAll("[data-slide]")];
function showBanner(index) { currentBanner = (index + bannerSlides.length) % bannerSlides.length; bannerSlides.forEach((slide, i) => { slide.classList.toggle("active", i === currentBanner); slide.setAttribute("aria-hidden", String(i !== currentBanner)) }); bannerDots.forEach((dot, i) => { dot.classList.toggle("active", i === currentBanner); if (i === currentBanner) dot.setAttribute("aria-current", "true"); else dot.removeAttribute("aria-current") }) }
$("bannerPrev").addEventListener("click", () => showBanner(currentBanner - 1));
$("bannerNext").addEventListener("click", () => showBanner(currentBanner + 1));
bannerDots.forEach(dot => dot.addEventListener("click", () => showBanner(Number(dot.dataset.slide))));
setInterval(() => { if (document.visibilityState === "visible" && $("home").classList.contains("active")) showBanner(currentBanner + 1) }, 5000);
