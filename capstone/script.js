(function () {

    // gsap setup
    gsap.registerPlugin(ScrollTrigger);

    // hero entrance
    gsap.from(".hero .eyebrow", { opacity: 0, y: 16, duration: 0.7, delay: 0.2, ease: "power3.out" });
    gsap.from(".hero-title", { opacity: 0, y: 36, duration: 0.9, delay: 0.35, ease: "power3.out" });
    gsap.from(".hero-sub", { opacity: 0, y: 16, duration: 0.7, delay: 0.55, ease: "power3.out" });
    gsap.from(".scroll-hint", { opacity: 0, duration: 0.7, delay: 0.8, ease: "power2.out" });

    // stats cards — rise one by one on scroll
    gsap.from(".card", {
        scrollTrigger: {
            trigger: ".stats",
            start: "top 78%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 48,
        duration: 0.7,
        stagger: 0.14,
        ease: "power3.out"
    });


    // foods data
    const foods = [
        {
            name: "Matcha latte",
            img: "images/matcha.png",
            allergens: ["milk", "soy"],
            callouts: [
                { name: "Milk", alias: "Hidden as: casein, whey" },
                { name: "Soy", alias: "Hidden as: natural flavoring" }
            ]
        },
        {
            name: "Vegan cake",
            img: "images/cake.png",
            allergens: ["wheat", "milk", "eggs"],
            callouts: [
                { name: "Wheat"},
                { name: "Milk" },
                { name: "Eggs" }
            ]
        },
        {
            name: "Salad",
            img: "images/salad.png",
            allergens: ["peanuts"],
            callouts: [
                { name: "Peanuts", alias: "Hidden in the leafs" }
            ]
        },
        {
            name: "Cinnamon bun",
            img: "images/bun.png", 
            allergens: ["Milk", "wheat", "eggs"],
            callouts: [
                { name: "Milk", alias: "Hidden as inside butter" },
                { name: "Wheat"},
                { name: "Eggs", alias: "Hidden as: egg wash" }
            ]
        },
        {
            name: "Bagel",
            img: "images/bagel.png", 
            allergens: ["wheat", "Tree nuts"],
            callouts: [
                { name: "Wheat", alias: "Hidden as: methylcellulose" },
                { name: "Tree nuts", alias: "Hidden as: vegan spread made with cashews" }
            ]
        }
    ];

    let userAllergens = [];
    let currentRound = 0;
    let hotspotsOn = false;

    // onboarding
    const backdrop = document.getElementById("modal-backdrop");
    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");

    // open on load
    document.addEventListener("DOMContentLoaded", () => {
        backdrop.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    });

    document.getElementById("btn-yes").addEventListener("click", () => {
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
    });

    document.getElementById("btn-back").addEventListener("click", () => {
        step2.classList.add("hidden");
        step1.classList.remove("hidden");
    });

    document.getElementById("btn-no").addEventListener("click", () => {
        step1.classList.add("hidden");

        const all = ["milk", "eggs", "peanuts", "tree nuts", "soy", "wheat", "fish", "shellfish", "sesame"];
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        userAllergens = shuffled.slice(0, Math.floor(Math.random() * 4) + 1);

        const tagRow = document.getElementById("assigned-tags");
        tagRow.innerHTML = "";
        userAllergens.forEach(a => {
            const t = document.createElement("p");
            t.className = "tag";
            t.textContent = a;
            tagRow.appendChild(t);
        });

        step3.classList.remove("hidden");
    });

    document.getElementById("btn-confirm").addEventListener("click", () => {
        const checked = document.querySelectorAll("#check-grid input:checked");
        userAllergens = Array.from(checked).map(c => c.value);
        if (userAllergens.length === 0) userAllergens = ["milk"];
        closeOnboarding();
    });

    document.getElementById("btn-assigned-confirm").addEventListener("click", closeOnboarding);

    function closeOnboarding() {
        backdrop.classList.add("hidden");
        document.body.style.overflow = "";
        renderAllergenBar();
        loadRound(0);
    }


    // persistent allergen bar
    function renderAllergenBar() {
        const bar = document.getElementById("allergen-bar");
        bar.innerHTML = "";
        userAllergens.forEach(a => {
            const t = document.createElement("p");
            t.className = "tag";
            t.textContent = a;
            bar.appendChild(t);
        });
    }

    // rounds
    function loadRound(index) {
        currentRound = index;
        hotspotsOn = false;

        const food = foods[index];
        document.getElementById("round-label").textContent = `Round ${index + 1} of ${foods.length}`;
        document.getElementById("food-img").src = food.img;
        document.getElementById("food-img").alt = food.name;

        // callout names + aliases
        food.callouts.forEach((c, i) => {
            const n = i + 1;
            document.getElementById(`c${n}-name`).textContent = c.name;
            document.getElementById(`c${n}-alias`).textContent = c.alias;
        });

        // round dots
        document.querySelectorAll(".round-dot").forEach((dot, i) => {
            dot.classList.remove("active", "done");
            if (i < index) dot.classList.add("done");
            else if (i === index) dot.classList.add("active");
        });

        // reset hotspots + callouts
        document.querySelectorAll(".callout").forEach(c => c.classList.remove("peek"));
        document.querySelectorAll(".hotspot").forEach(h => {
            h.classList.remove("visible");
            gsap.set(h, { scale: 0 });
        });

        // reset buttons
        const btns = document.getElementById("guess-btns");
        btns.style.pointerEvents = "all";
        gsap.set(btns, { opacity: 1, y: 0 });

        document.getElementById("hover-hint").classList.add("hidden");
    }

    function isSafe() {
        const food = foods[currentRound];
        return !userAllergens.some(a => food.allergens.includes(a));
    }

    // hotspots
    function activateHotspots() {
        hotspotsOn = true;
        document.querySelectorAll(".hotspot").forEach(hs => {
            hs.classList.add("visible");
            hs.addEventListener("mouseenter", () => {
                if (!hotspotsOn) return;
                document.getElementById(hs.dataset.callout).classList.add("peek");
            });
            hs.addEventListener("mouseleave", () => {
                document.getElementById(hs.dataset.callout).classList.remove("peek");
            });
        });
        document.getElementById("hover-hint").classList.remove("hidden");
    }

    // wrong / correct
    function triggerWrong() {
        gsap.to("body", {
            backgroundColor: "#0d6b70",
            duration: 0.08,
            yoyo: true,
            repeat: 5,
            ease: "power1.inOut",
            onComplete: () => gsap.set("body", { backgroundColor: "" })
        });

        const stage = document.getElementById("stage");
        stage.classList.add("shaking");
        stage.addEventListener("animationend", () => stage.classList.remove("shaking"), { once: true });

        gsap.to("#guess-btns", {
            opacity: 0,
            y: 8,
            duration: 0.3,
            onComplete: () => {
                document.getElementById("guess-btns").style.pointerEvents = "none";
            }
        });

        setTimeout(activateHotspots, 600);

        setTimeout(() => {
            const ov = document.getElementById("overlay-wrong");
            ov.classList.add("active");
            gsap.from(".overlay-wrong .overlay-box", { scale: 0.92, opacity: 0, duration: 0.4, ease: "back.out(1.5)" });
        }, 900);
    }

    function triggerCorrect() {
        gsap.to("#guess-btns", {
            opacity: 0, y: 8, duration: 0.3,
            onComplete: () => {
                document.getElementById("guess-btns").style.pointerEvents = "none";
            }
        });

        activateHotspots();

        setTimeout(() => {
            const ov = document.getElementById("overlay-correct");
            ov.classList.add("active");
            gsap.from(".overlay-correct .overlay-box", { scale: 0.92, opacity: 0, duration: 0.4, ease: "back.out(1.5)" });
        }, 500);
    }

    // reset
    function resetRound() {
        document.getElementById("overlay-correct").classList.remove("active");
        document.getElementById("overlay-wrong").classList.remove("active");
        loadRound(currentRound);
    }

    function nextRound() {
        document.getElementById("overlay-correct").classList.remove("active");
        const next = currentRound + 1;
        if (next < foods.length) {
            loadRound(next);
        } else {
            document.getElementById("stats").scrollIntoView({ behavior: "smooth" });
        }
    }

    // button events
    document.getElementById("btn-safe").addEventListener("click", () => {
        isSafe() ? triggerCorrect() : triggerWrong();
    });

    document.getElementById("btn-unsafe").addEventListener("click", () => {
        !isSafe() ? triggerCorrect() : triggerWrong();
    });

    document.getElementById("btn-continue").addEventListener("click", nextRound);
    document.getElementById("btn-retry").addEventListener("click", resetRound);

    // initial gsap states
    gsap.set(".callout", { opacity: 0 });
    gsap.set(".hotspot", { scale: 0 });

})();