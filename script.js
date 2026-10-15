let settings = mergeSettings();

function applySettings() {
    const root = document.documentElement;
    const c = settings.colors;

    root.style.setProperty("--frame-bg", c.frameBg);
    root.style.setProperty("--frame-border", c.frameBorder);
    root.style.setProperty("--inner-bg", c.innerBg);
    root.style.setProperty("--title-bg", c.titleBg);
    root.style.setProperty("--title-text", c.titleText);
    root.style.setProperty("--number-color", c.numberColor);
    root.style.setProperty("--number-stroke", c.numberStroke);
    root.style.setProperty("--font", `"${settings.font}", sans-serif`);
    root.style.setProperty("--number-scale", settings.numberScale / 100);

    document.body.dataset.frame = settings.frame;
    document.body.dataset.decor = settings.decor;
    document.querySelectorAll(".sticker").forEach((img, i) => {
        const name = settings.stickers[i];
        img.hidden = !SPRITES[name];
        if (SPRITES[name]) img.src = spriteURL(name);
    });
    root.style.setProperty("--opacity", settings.opacity / 100);

    const title = document.getElementById("title");
    document.getElementById("title-text").textContent = settings.titleText;
    title.hidden = !settings.showTitle;

    updateCalendar();
    document.fonts.load(`16px "${settings.font}"`).then(fitText, fitText);
}

// encolhe o texto até caber, para qualquer fonte ficar dentro da moldura
function fitOne(el, base, maxWidth) {
    el.style.fontSize = base + "px";
    const width = el.getBoundingClientRect().width;
    if (width > maxWidth) el.style.fontSize = Math.max(8, Math.floor(base * maxWidth / width)) + "px";
}

function fitText() {
    // o encaixe do mês sob o número foi calibrado para a Pixelify Sans
    document.getElementById("month").style.marginTop = settings.font === "Pixelify Sans" ? "-10px" : "4px";
    const scale = settings.numberScale / 100;
    fitOne(document.getElementById("day"), 95 * scale, 148);
    fitOne(document.getElementById("month"), 37 * scale, 148);
    fitOne(document.getElementById("title-text"), 20, 132);
}

function updateCalendar() {
    const now = new Date();
    let month = MONTHS[settings.language][now.getMonth()];
    if (settings.monthFormat === "short") month = month.slice(0, 3);

    document.getElementById("day").textContent = now.getDate();
    document.getElementById("month").textContent = month;
    fitText();
}

window.api.getSettings().then((saved) => {
    settings = mergeSettings(saved);
    applySettings();
});
window.api.onSettings((saved) => {
    settings = mergeSettings(saved);
    applySettings();
});

document.getElementById("settings-btn").addEventListener("click", () => window.api.openSettings());

applySettings();
setInterval(updateCalendar, 60 * 1000);
