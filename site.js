const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");

function closeNavigation() {
  menuToggle?.setAttribute("aria-expanded", "false");
  mainNav?.classList.remove("open");
}

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  mainNav?.classList.toggle("open", !open);
});

mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

const menuDialog = document.querySelector(".menu-dialog");
document.querySelector("[data-open-menu]")?.addEventListener("click", () => {
  menuDialog?.showModal();
  document.body.classList.add("menu-open");
});

function closeMenuDialog() {
  menuDialog?.close();
  document.body.classList.remove("menu-open");
}

document.querySelector("[data-close-menu]")?.addEventListener("click", closeMenuDialog);
menuDialog?.addEventListener("click", (event) => {
  if (event.target === menuDialog) closeMenuDialog();
});
menuDialog?.addEventListener("close", () => document.body.classList.remove("menu-open"));

// The regular schedule is shown in the venue's local time. Event nights may run later.
const hoursStatus = document.querySelector("[data-hours-status]");
function updateHoursStatus() {
  if (!hoursStatus) return;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type)?.value;
  const weekday = part("weekday");
  const minutes = Number(part("hour")) * 60 + Number(part("minute"));
  const open = weekday === "Tue" || weekday === "Wed"
    ? minutes >= 14 * 60 && minutes < 21 * 60
    : weekday !== "Mon" && minutes >= 10 * 60 && minutes < 23 * 60;
  hoursStatus.textContent = open ? "Aperto ora" : "Chiuso secondo gli orari";
  hoursStatus.dataset.open = String(open);
}
updateHoursStatus();
setInterval(updateHoursStatus, 60 * 1000);
