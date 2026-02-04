import { CONFIG } from './config.js';
import { initTheme, addThemeList } from './modules/theme.js';
import { initEffects, initEffectsToggle } from './modules/effects.js';
import { initPosts } from './modules/blog.js';
import { initPictureColl } from './modules/navigation.js';
import { initRouting } from './modules/routing.js';
import { initTooltips } from './modules/utils.js';

const music = document.getElementById('bg-music');
music.volume = 0.5;

let musicStarted = false;

// target the tab explicitly
const musicTab = document.getElementById('blog-tab');

musicTab.addEventListener('click', async () => {
	try {
		// first interaction → start playback
		if (!musicStarted) {
			await music.play();
			musicStarted = true;
			return;
		}

		// afterwards, toggle play/pause
		if (music.paused) {
			await music.play();
		} else {
			music.pause();
		}
	} catch (err) {
		console.error('Music playback failed:', err);
	}
});

const track = document.getElementById("image-track");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  
  track.dataset.percentage = nextPercentage;
  
  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`
  }, { duration: 1200, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, fill: "forwards" });
  }
}

function updateAEST() {
  const now = new Date();

  // Convert local time → UTC → AEST (UTC +10)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const aest = new Date(utc + (10 * 60 * 60 * 1000));

  const formatted = aest.toLocaleString("en-AU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  document.getElementById("aestTime").textContent = formatted + " AEST";
}

// initial render
updateAEST();

// update every second
setInterval(updateAEST, 1000);


/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

document.addEventListener('DOMContentLoaded', () => {
	addThemeList();
	initTheme();
	initEffects();
	initEffectsToggle();
	initPosts();
	initPictureColl();
	initRouting();
	initTooltips();

	// Close details-tags on default for mobile devices to reduce large amount of text on home-tab
	if (window.matchMedia('(max-width: 767px)').matches) {
		document.querySelectorAll('details').forEach((details) => {
			details.removeAttribute('open');
		});
	}

	// Special config cases
	if (CONFIG.crtEffect) {
		document.getElementById('canvas').classList.add('crt-effect');
	}
	if (!CONFIG.noiseEffect) {
		document.getElementById('noise-overlay').style.display = 'none';
	}
	if (!CONFIG.grungeOverlay) {
		document.getElementById('grunge-overlay').style.display = 'none';
	}
});


