/* ==========================================================
   THREE.JS CANVAS STARFIELD & PLANETS ENGINE
   ========================================================== */

const canvas = document.getElementById("bg");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); // Clamped to 2 for Retina/High-DPI display speeds

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 6000);
camera.position.z = 55;

/* ===== LIGHT SOURCES ===== */
scene.add(new THREE.AmbientLight(0xffffff, 1));
const sunLight = new THREE.PointLight(0xffffff, 7);
scene.add(sunLight);

/* ===== COSMIC TEXTURES LOADERS ===== */
const loader = new THREE.TextureLoader();

const tex = {
  sun: loader.load("https://threejs.org/examples/textures/lava/lavatile.jpg"),
  earth: loader.load("https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg"),
  moon: loader.load("https://threejs.org/examples/textures/planets/moon_1024.jpg"),
  mercury: loader.load("https://threejs.org/examples/textures/lava/lavatile.jpg"),
  venus:   loader.load("https://threejs.org/examples/textures/hardwood2_diffuse.jpg"),
  mars:    loader.load("https://threejs.org/examples/textures/lava/cloud.png"),
  jupiter: loader.load("https://threejs.org/examples/textures/brick_diffuse.jpg"),
  saturn:  loader.load("https://threejs.org/examples/textures/water.jpg"),
  uranus:  loader.load("https://threejs.org/examples/textures/cube/Bridge2/posx.jpg"),
  neptune: loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"),
  saturnRing: loader.load("https://threejs.org/examples/textures/alphaMap.jpg")
};

/* ===== STARFIELD BUFFER LAYER ===== */
const starGeo = new THREE.BufferGeometry();
const starCount = 8000;
const starPos = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 3000;
  starPos[i * 3 + 1] = (Math.random() - 0.5) * 3000;
  starPos[i * 3 + 2] = -Math.random() * 4500;
}

starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 })
));

/* ===== CENTRAL STAR (SUN) ===== */
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(18, 64, 64),
  new THREE.MeshBasicMaterial({ map: tex.sun })
);
sun.position.set(-75, 40, -120);
sunLight.position.copy(sun.position);
scene.add(sun);

/* Sun glow layer */
const sunGlow = new THREE.Mesh(
  new THREE.SphereGeometry(26, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0xffaa33,
    transparent: true,
    opacity: 0.4
  })
);
sunGlow.position.copy(sun.position);
scene.add(sunGlow);

/* ===== PLANETS BUILDER HELPER ===== */
function createPlanet(size, map, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshPhongMaterial({
      map: map,
      shininess: 15
    })
  );
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return mesh;
}

/* ===== ORBITING PLANETS SETS ===== */
const mercury = createPlanet(6, tex.mercury, -20, 8, -220);
const venus   = createPlanet(7, tex.venus,    22, -8, -340);
const earth   = createPlanet(7.5, tex.earth, -18, 10, -480);
const mars    = createPlanet(6.5, tex.mars,   20, 8, -620);
const jupiter = createPlanet(12, tex.jupiter, -22, -8, -820);
const saturn  = createPlanet(11, tex.saturn,  24, 6, -1000);
const uranus  = createPlanet(9, tex.uranus, -20, -10, -1200);
const neptune = createPlanet(9, tex.neptune, 22, 9, -1400);

const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

/* ===== SATURN RING OVERLAYS ===== */
const ring = new THREE.Mesh(
  new THREE.RingGeometry(16, 26, 128),
  new THREE.MeshBasicMaterial({
    map: tex.saturnRing,
    side: THREE.DoubleSide,
    transparent: true
  })
);
ring.position.copy(saturn.position);
ring.rotation.x = Math.PI / 2.2;
scene.add(ring);

const moon = createPlanet(2.2, tex.moon, 0, 0, 0);

/* ===== CURSOR & WINDOW SCROLL INTERACTIONS ===== */
let mx = 0, my = 0;
document.addEventListener("mousemove", e => {
  mx = (e.clientX / innerWidth - 0.5) * 2;
  my = (e.clientY / innerHeight - 0.5) * 2;
});

let scrollY = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  // Toggle scrolled height shift state on navbar header
  const header = document.getElementById("portfolio-header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  // Scroll Spy link active class highlighter
  let currentSection = "";
  const sectionsList = document.querySelectorAll("section:not(#modals-container)");
  const navLinks = document.querySelectorAll(".nav-item-link");

  sectionsList.forEach(sec => {
    const secTop = sec.offsetTop;
    if (window.scrollY >= secTop - 140) {
      currentSection = sec.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

// Trigger scroll spy check on page load to set active nav item
document.addEventListener("DOMContentLoaded", () => {
  window.dispatchEvent(new Event("scroll"));
});

/* ===== ANIMATION FRAME TICKER ===== */
function animate() {
  requestAnimationFrame(animate);
  
  planets.forEach(p => p.rotation.y += 0.002);
  
  moon.position.x = earth.position.x + Math.sin(Date.now() * 0.001) * 8;
  moon.position.z = earth.position.z + Math.cos(Date.now() * 0.001) * 8;
  moon.position.y = earth.position.y;
  
  camera.position.z = 55 - scrollY * 0.18;
  
  scene.rotation.y += (mx * 0.6 - scene.rotation.y) * 0.02;
  scene.rotation.x += (-my * 0.3 - scene.rotation.x) * 0.02;
  
  camera.lookAt(0, 0, camera.position.z - 400);
  renderer.render(scene, camera);
}

animate();

/* ===== DYNAMIC WINDOW RESIZING (THROTTLED) ===== */
let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }, 100);
});

/* ==========================================================
   INTERACTIVE POINTER TRAIL UTILITY
   ========================================================== */

const orb = document.getElementById("orb");
const trailContainer = document.getElementById("trail-container");
const TRAIL_COUNT = 5;
const trail = [];

if (trailContainer) {
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement("div");
    dot.className = "trail";
    trailContainer.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  if (orb) {
    orb.style.left = mouseX + "px";
    orb.style.top = mouseY + "px";
  }
  
  let prevX = mouseX;
  let prevY = mouseY;
  
  trail.forEach(t => {
    t.x += (prevX - t.x) * 0.45;
    t.y += (prevY - t.y) * 0.45;
    t.el.style.left = t.x + "px";
    t.el.style.top = t.y + "px";
    prevX = t.x;
    prevY = t.y;
  });
  
  requestAnimationFrame(animateCursor);
}

animateCursor();

/* ==========================================================
   NAVIGATION TOGGLER FOR MOBILE
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");
  const navLinks = document.querySelectorAll("#navList a");
  
  if (!navToggle || !navList) return;
  
  const toggleMenu = (state) => {
    navToggle.classList.toggle("active", state);
    navList.classList.toggle("active", state);
    navToggle.setAttribute("aria-expanded", state);
  };
  
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navToggle.classList.contains("active");
    toggleMenu(!isOpen);
  });
  
  navLinks.forEach(link => {
    link.addEventListener("click", () => toggleMenu(false));
  });
  
  document.addEventListener("click", (e) => {
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });
});

/* ==========================================================
   TERMINAL BIO WRITER TYPING OBSERVER
   ========================================================== */

const aboutSection = document.querySelector("#about");
const aboutTextEl = document.getElementById("about-text");

const aboutText = `▣ SYSTEM DIAGNOSTICS: COMPLETED.
> STUDENT IDENT: Sk Arif Ahmed
> SPECIALIZATION: B.Tech CSE (Expected 2026)
> INTERESTS: Scalable backend structures, API deployment, automation pipelines.

> BIO SNAPSHOT:
  Focused on constructing secure backend architectures and automated cloud configurations.
  Passionate about writing clean database queries and orchestrating Docker workloads.

> RESEARCH STATIONS:
  - Cybersecurity Research Intern @ UCC Ireland
  - Software Development Intern @ KATSI Canada
  - Software Development Intern @ Adamas University

> SYSTEM STATUS: ACTIVE. READY FOR CONNECTION.`;

let typed = false;

const typingObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !typed) {
    typeText();
    typed = true;
  }
}, { threshold: 0.3 });

if (aboutSection && aboutTextEl) {
  typingObserver.observe(aboutSection);
}

function typeText() {
  let i = 0;
  aboutTextEl.textContent = "";
  function typing() {
    if (i < aboutText.length) {
      aboutTextEl.textContent += aboutText.charAt(i);
      i++;
      setTimeout(typing, 10);
    }
  }
  typing();
}

/* ==========================================================
   SINGLE MANAGER INSTANCE FOR MODALS (NO INTERFERENCES)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const triggerBtns = document.querySelectorAll(".view-details-trigger-btn");
  const closeBtns = document.querySelectorAll(".modal-close, .modal-dismiss-btn");
  const modals = document.querySelectorAll(".modal");
  
  const openModal = (modal) => {
    if (!modal) return;
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
    document.body.style.overflow = "hidden"; // Prevent layout scrolling
    
    const closeIcon = modal.querySelector(".modal-close");
    if (closeIcon) closeIcon.focus();
  };
  
  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("active");
    setTimeout(() => modal.style.display = "none", 300);
    document.body.style.overflow = ""; // Enable scrolling
  };
  
  triggerBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      openModal(modal);
    });
  });
  
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal"));
    });
  });
  
  modals.forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal.active");
      if (activeModal) closeModal(activeModal);
    }
  });
});

/* ==========================================================
   CONTACT FORMS & CLIPBOARD ACTIONS HELPERS
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailText = document.getElementById("emailText");
  
  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(emailText.innerText.trim()).then(() => {
        const originalText = copyEmailBtn.innerText;
        copyEmailBtn.innerText = "Email Copied!";
        setTimeout(() => copyEmailBtn.innerText = originalText, 2000);
      });
    });
  }
  
  const sendBtn = document.getElementById("sendBtn");
  const messageText = document.getElementById("messageText");
  
  if (sendBtn && messageText) {
    sendBtn.addEventListener("click", () => {
      const textVal = messageText.value.trim();
      if (!textVal) {
        alert("Please write a message before transmitting signal.");
        return;
      }
      
      sendBtn.innerText = "Transmitting...";
      const targetMail = "skarifahmedofficial@gmail.com";
      const subject = "Message from Sk Arif Ahmed Portfolio";
      
      const mailtoLink = `mailto:${targetMail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textVal)}`;
      window.location.href = mailtoLink;
      
      setTimeout(() => {
        sendBtn.innerText = "Send Transmission";
        messageText.value = "";
      }, 2000);
    });
  }
});

/* ==========================================================
   GLOBAL SECTION SCROLL FADE-UP ENTRANCE TRANSITION
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const scrollSections = document.querySelectorAll("section:not(#hero):not(#modals-container), footer");
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });
  
  scrollSections.forEach(sec => {
    sec.classList.add("section-fade-up");
    scrollObserver.observe(sec);
  });
});
