/* ==========================================================
   SK ARIF AHMED - PORTFOLIO CORE JAVASCRIPT ENGINE
   - 3D Cyber Constellation & Starfield (Three.js)
   - Interactive Cursor Glow
   - Smooth Navigation & Scroll Spy
   - Terminal Typing Simulation
   - Project Filtering & 3D Tilt
   - Modal System with Dynamic Fallback
   - Animated Stats Counters
   - Clipboard & Transmission Handlers
   ========================================================== */

/* ==========================================================
   1. THREE.JS PROCEDURAL CYBER CONSTELLATION ENGINE
   ========================================================== */
(function initThreeBackground() {
  const canvas = document.getElementById("bg");
  if (!canvas || typeof THREE === "undefined") return;

  // Renderer setup with retina clamp
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 80;

  // Ambient & point lights
  const ambientLight = new THREE.AmbientLight(0x1a1a1a, 2.5);
  scene.add(ambientLight);

  const redLight = new THREE.PointLight(0xe63946, 3.5, 250);
  redLight.position.set(30, 40, 50);
  scene.add(redLight);

  const deepRedLight = new THREE.PointLight(0xc1121f, 2.8, 250);
  deepRedLight.position.set(-40, -30, 30);
  scene.add(deepRedLight);

  /* ----- DEEP STARFIELD (Procedural Point Cloud) ----- */
  const starCount = 3500;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colorPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xffffff),
    new THREE.Color(0xe63946),
    new THREE.Color(0xff858d),
    new THREE.Color(0xc1121f)
  ];

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = (Math.random() - 0.5) * 1600;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1600;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    starColors[i * 3]     = chosenColor.r;
    starColors[i * 3 + 1] = chosenColor.g;
    starColors[i * 3 + 2] = chosenColor.b;
  }

  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 1.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  });

  const starField = new THREE.Points(starGeo, starMaterial);
  scene.add(starField);

  /* ----- FLOATING CYBER NEURAL CONSTELLATION NETWORK ----- */
  const nodeCount = 90;
  const nodePositions = [];
  const nodeVelocities = [];
  const nodeRange = 120;

  for (let i = 0; i < nodeCount; i++) {
    const x = (Math.random() - 0.5) * nodeRange;
    const y = (Math.random() - 0.5) * nodeRange;
    const z = (Math.random() - 0.5) * (nodeRange * 0.7) - 20;
    nodePositions.push(new THREE.Vector3(x, y, z));
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.05,
      (Math.random() - 0.5) * 0.04
    ));
  }

  // Node Points
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
  const nodeMat = new THREE.PointsMaterial({
    color: 0xe63946,
    size: 2.2,
    transparent: true,
    opacity: 0.9
  });
  const nodeParticles = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodeParticles);

  // Line Segments connecting nearby nodes
  const maxLines = (nodeCount * (nodeCount - 1)) / 2;
  const linePositions = new Float32Array(maxLines * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMat = new THREE.LineBasicMaterial({
    color: 0xe63946,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });
  const constellationLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(constellationLines);

  /* ----- CENTRAL GEOMETRIC QUANTUM CORE (FUTURISTIC WIREFRAME) ----- */
  const coreGroup = new THREE.Group();

  const outerGeo = new THREE.IcosahedronGeometry(14, 1);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    wireframe: true,
    transparent: true,
    opacity: 0.22,
    emissive: 0x3d0a0d
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  coreGroup.add(outerMesh);

  const innerGeo = new THREE.OctahedronGeometry(8, 0);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xff6b75,
    wireframe: true,
    transparent: true,
    opacity: 0.38
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerMesh);

  // Place core slightly in background to right of hero
  coreGroup.position.set(45, 10, -60);
  scene.add(coreGroup);

  /* ----- PARALLAX & MOUSE INTERACTION ----- */
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let scrollY = window.scrollY;

  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  }, { passive: true });

  /* ----- RENDER LOOP ----- */
  let frameId;
  const connectionDistance = 28;

  function animate() {
    frameId = requestAnimationFrame(animate);

    // Smooth camera damping
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    scene.rotation.y = currentX * 0.25;
    scene.rotation.x = currentY * 0.2;

    // Camera scroll tracking
    camera.position.z = 80 - scrollY * 0.04;
    camera.position.y = -scrollY * 0.015;

    // Starfield gentle rotation
    starField.rotation.y += 0.0003;
    starField.rotation.x += 0.00015;

    // Core rotation
    coreGroup.rotation.y += 0.004;
    coreGroup.rotation.x += 0.002;
    innerMesh.rotation.y -= 0.006;
    innerMesh.rotation.z += 0.003;

    // Animate constellation nodes
    let lineIdx = 0;
    const posArr = lineGeo.attributes.position.array;

    for (let i = 0; i < nodeCount; i++) {
      const p = nodePositions[i];
      const v = nodeVelocities[i];

      p.add(v);

      // Bounce at boundary
      if (Math.abs(p.x) > nodeRange / 2) v.x *= -1;
      if (Math.abs(p.y) > nodeRange / 2) v.y *= -1;
      if (Math.abs(p.z + 20) > nodeRange * 0.35) v.z *= -1;

      // Connect with other nodes
      for (let j = i + 1; j < nodeCount; j++) {
        const p2 = nodePositions[j];
        const dist = p.distanceTo(p2);

        if (dist < connectionDistance) {
          posArr[lineIdx++] = p.x;
          posArr[lineIdx++] = p.y;
          posArr[lineIdx++] = p.z;
          posArr[lineIdx++] = p2.x;
          posArr[lineIdx++] = p2.y;
          posArr[lineIdx++] = p2.z;
        }
      }
    }

    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx / 3);

    nodeGeo.setFromPoints(nodePositions);
    nodeGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  /* ----- RESIZE HANDLER ----- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 100);
  });
})();

/* ==========================================================
   2. AMBIENT CURSOR GLOW (Non-blocking, respects touch/motion)
   ========================================================== */
(function initCursorGlow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const orb = document.getElementById("orb");
  if (!orb) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let orbX = mouseX;
  let orbY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function renderOrb() {
    orbX += (mouseX - orbX) * 0.15;
    orbY += (mouseY - orbY) * 0.15;
    orb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0)`;
    requestAnimationFrame(renderOrb);
  }
  requestAnimationFrame(renderOrb);
})();

/* ==========================================================
   3. HEADER SCROLL SPY & STICKY NAVBAR
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("portfolio-header");
  const navLinks = document.querySelectorAll(".nav-item-link");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const scrollPos = window.scrollY;

    // Header blur / elevation change on scroll
    if (header) {
      if (scrollPos > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Scroll spy active nav highlighting
    let currentId = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${currentId}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // initial trigger
});

/* ==========================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");
  const navLinks = document.querySelectorAll("#navList a");

  if (!navToggle || !navList) return;

  function toggleMenu(isOpen) {
    navToggle.classList.toggle("active", isOpen);
    navList.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("nav-menu-open", isOpen);
  }

  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = navToggle.classList.contains("active");
    toggleMenu(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("click", (e) => {
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navList.classList.contains("active")) {
      toggleMenu(false);
    }
  });
});

/* ==========================================================
   5. TERMINAL BIO TYPING SIMULATION (With Blink Cursor)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector("#about");
  const aboutTextEl = document.getElementById("about-text");

  const fullBio = `▣ SYSTEM DIAGNOSTICS: INITIALIZED & OPTIMIZED.
> CANDIDATE : Sk Arif Ahmed
> IDENTITY  : Full Stack Developer | AI & Backend Engineer
> EDUCATION : B.Tech Computer Science & Engineering (2026)

> CORE ENGINEERING ARCHITECTURE & EXPERTISE:
  ✔ Full-Stack Development : React.js, Next.js, Node.js, Express.js, TypeScript
  ✔ Backend Engineering    : High-throughput REST APIs, JWT Auth, Microservices
  ✔ AI & LLM Integration   : OpenAI API, Function Calling, GenAI Agents, Tool Use
  ✔ Real-Time Systems      : Socket.io WebSockets, Low-Latency Event Streaming
  ✔ Distributed Systems    : RabbitMQ Message Queuing, Redis In-Memory Caching
  ✔ Cloud & DevOps         : Docker, Kubernetes, AWS EC2, GitHub Actions CI/CD
  ✔ System Design          : Dynamic ETA scoring, GeoJSON discovery, demand forecasting

> RESEARCH & INDUSTRY STATIONS:
  - Cybersecurity Research Intern @ University College Cork (UCC), Ireland
  - Software Development Intern @ KATSI Canada
  - Software Development Intern @ Adamas University

> STATUS: AVAILABLE FOR FULL-STACK & BACKEND ENGINEERING OPPORTUNITIES.`;

  if (!aboutSection || !aboutTextEl) return;

  let hasTyped = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !hasTyped) {
        hasTyped = true;
        typeBio();
        observer.unobserve(aboutSection);
      }
    },
    { threshold: 0.15 }
  );

  observer.observe(aboutSection);

  function typeBio() {
    let charIndex = 0;
    aboutTextEl.textContent = "";

    // Fast, smooth typing cadence
    function step() {
      if (charIndex < fullBio.length) {
        // Type in small batches for performance and snappy rhythm
        const chunk = fullBio.slice(charIndex, charIndex + 2);
        aboutTextEl.textContent += chunk;
        charIndex += 2;
        setTimeout(step, 6);
      } else {
        aboutTextEl.textContent = fullBio;
      }
    }
    step();
  }
});

/* ==========================================================
   6. ANIMATED NUMERICAL COUNTERS (DSA, Builds, Internships)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const statNumbers = document.querySelectorAll(".stat-number, .ach-counter-number");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawText = el.textContent.trim();

          // Extract number and suffix (e.g., "500+", "15+", "8000+", "2×", "2026")
          const match = rawText.match(/^([^\d]*)(\d+)([^\d]*)$/);
          if (match) {
            const prefix = match[1] || "";
            const targetVal = parseInt(match[2], 10);
            const suffix = match[3] || "";
            let startVal = 0;
            const duration = 1200;
            const startTime = performance.now();

            function countUp(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const ease = 1 - Math.pow(1 - progress, 3);
              const currentNum = Math.floor(ease * targetVal);

              el.textContent = `${prefix}${currentNum}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(countUp);
              } else {
                el.textContent = rawText;
              }
            }
            requestAnimationFrame(countUp);
          }
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  statNumbers.forEach((el) => observer.observe(el));
});

/* ==========================================================
   7. 3D TILT EFFECT ON CARDS
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const tiltCards = document.querySelectorAll(".flagship-project-card, .portrait-glowing-frame");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
});

/* ==========================================================
   8. PROJECT CATEGORY FILTERING TABS
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-showcase-card");

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter") || "all";

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category") || "";
        const tags = (card.querySelector(".project-tech-tags")?.textContent || "").toLowerCase();
        const title = (card.querySelector("h3")?.textContent || "").toLowerCase();

        let matches = false;
        if (filter === "all") {
          matches = true;
        } else if (filter === "ai") {
          matches = category.includes("ai") || tags.includes("ai") || tags.includes("gpt") || tags.includes("nlp") || tags.includes("vision") || tags.includes("machine learning");
        } else if (filter === "realtime") {
          matches = category.includes("realtime") || tags.includes("socket") || tags.includes("webrtc") || tags.includes("streaming") || tags.includes("real-time") || tags.includes("rabbitmq");
        } else if (filter === "fullstack") {
          matches = category.includes("fullstack") || tags.includes("react") || tags.includes("node") || tags.includes("express") || tags.includes("mongodb") || tags.includes("next");
        } else if (filter === "cloud-devops") {
          matches = category.includes("devops") || tags.includes("docker") || tags.includes("kubernetes") || tags.includes("monitoring") || tags.includes("github actions") || tags.includes("serverless");
        }

        if (matches) {
          card.style.display = "";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(12px) scale(0.97)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
});

/* ==========================================================
   9. PROJECT MODAL MANAGER (With ESC, Click Outside, Dynamic Fallback)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const triggerBtns = document.querySelectorAll(".view-details-trigger-btn");
  const closeBtns = document.querySelectorAll(".modal-close, .modal-dismiss-btn");
  const modals = document.querySelectorAll(".modal");

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Smooth transition
    requestAnimationFrame(() => {
      modal.classList.add("active");
    });

    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }, 280);
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const modalId = btn.getAttribute("data-modal");
      let modal = modalId ? document.getElementById(modalId) : null;

      // Dynamic fallback for cards without pre-defined modals
      if (!modal) {
        const card = btn.closest(".project-showcase-card, .project-card, .flagship-project-card");
        const fallbackModal = document.getElementById("modal-dynamic-fallback");

        if (card && fallbackModal) {
          const title = card.querySelector("h3")?.textContent || "Project Overview";
          const desc = card.querySelector(".project-summary-desc, p")?.textContent || "";
          const tags = [...card.querySelectorAll(".project-tech-tags span, .flagship-tech-pills span, .exp-tech-badges span")].map((t) => t.textContent.trim());
          const ghLink = card.querySelector("a.github-link, a[href*='github.com']")?.getAttribute("href") || "https://github.com/Arif1258";

          const titleEl = document.getElementById("dynamicModalTitle");
          const descEl = document.getElementById("dynamicModalDesc");
          const tagsEl = document.getElementById("dynamicModalTags");
          const ghEl = document.getElementById("dynamicModalGithub");

          if (titleEl) titleEl.textContent = title;
          if (descEl) descEl.textContent = desc;
          if (tagsEl) {
            tagsEl.innerHTML = tags.map((t) => `<span>${t}</span>`).join("");
          }
          if (ghEl) ghEl.href = ghLink;

          modal = fallbackModal;
        }
      }

      if (modal) {
        openModal(modal);
      }
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.closest(".modal"));
    });
  });

  modals.forEach((modal) => {
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
   10. CONTACT HANDLERS (Copy Email & Message Dispatch)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const emailText = document.getElementById("emailText");

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener("click", () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const originalHTML = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `✓ Email Copied!`;
        copyEmailBtn.classList.add("copied");

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalHTML;
          copyEmailBtn.classList.remove("copied");
        }, 2200);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        copyEmailBtn.textContent = "✓ Email Copied!";
        setTimeout(() => {
          copyEmailBtn.textContent = "Copy Email Address";
        }, 2200);
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
        messageText.focus();
        return;
      }

      sendBtn.textContent = "Transmitting Signal...";
      sendBtn.disabled = true;

      const targetMail = "skarifahmedofficial@gmail.com";
      const subject = "Message from Sk Arif Ahmed Portfolio";
      const mailtoLink = `mailto:${targetMail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textVal)}`;

      window.location.href = mailtoLink;

      setTimeout(() => {
        sendBtn.textContent = "✓ Signal Transmitted";
        messageText.value = "";
        setTimeout(() => {
          sendBtn.textContent = "Send Transmission";
          sendBtn.disabled = false;
        }, 2500);
      }, 1000);
    });
  }
});

/* ==========================================================
   11. SAFE ENTRANCE ANIMATIONS (Never cuts off tall sections)
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(
    ".eng-highlight-card, .skill-card, .project-showcase-card, .achievement-card, .edu-timeline-card, .experience-timeline-item, .profile-platform-card"
  );

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.05,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((el) => {
    el.classList.add("reveal-ready");
    observer.observe(el);
  });
});
