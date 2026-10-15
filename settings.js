const COLOR_LABELS = {
    frameBg: "Fundo da moldura",
    frameBorder: "Borda",
    innerBg: "Fundo do calendário",
    titleBg: "Fundo do título",
    titleText: "Texto do título",
    numberColor: "Cor do número e mês",
    numberStroke: "Contorno do número"
};

let settings = mergeSettings();

const $ = (id) => document.getElementById(id);

function save() {
    window.api.saveSettings(settings);
}

function refreshActiveTheme() {
    for (const btn of $("themes").children) {
        btn.classList.toggle("active", btn.dataset.theme === settings.theme);
    }
}

function fillControls() {
    $("frame").value = settings.frame;
    $("decor").value = settings.decor;
    $("opacity").value = settings.opacity;
    $("stickerSet").value = "";
    settings.stickers.forEach((name, i) => ($("slot-" + i).value = name));
    $("font").value = settings.font;
    $("numberScale").value = settings.numberScale;
    $("showTitle").checked = settings.showTitle;
    $("titleText").value = settings.titleText;
    $("language").value = settings.language;
    $("monthFormat").value = settings.monthFormat;
    for (const key of Object.keys(COLOR_LABELS)) $("color-" + key).value = settings.colors[key];
    refreshActiveTheme();
}

function bind(id, key, read) {
    $(id).addEventListener("input", () => {
        settings[key] = read($(id));
        if (key === "frame" || key === "decor") settings.theme = "custom";
        refreshActiveTheme();
        save();
    });
}

// temas
for (const [name, theme] of Object.entries(THEMES)) {
    const btn = document.createElement("button");
    btn.textContent = theme.label;
    btn.dataset.theme = name;
    btn.addEventListener("click", () => {
        settings.theme = name;
        settings.frame = theme.frame;
        settings.decor = theme.decor;
        settings.stickers = [...(theme.stickers || DEFAULT_SETTINGS.stickers)];
        settings.colors = { ...theme.colors };
        fillControls();
        save();
    });
    $("themes").appendChild(btn);
}

// enfeites
for (const [value, label] of Object.entries(DECORS)) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    $("decor").appendChild(opt);
}

// conjuntos prontos e imagens de cada posição
const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Escolher…";
$("stickerSet").appendChild(placeholder);
for (const [name, label] of Object.entries(SET_LABELS)) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = label;
    $("stickerSet").appendChild(opt);
}
$("stickerSet").addEventListener("change", () => {
    if (!DECOR_SETS[$("stickerSet").value]) return;
    settings.stickers = [...DECOR_SETS[$("stickerSet").value]];
    settings.decor = "stickers";
    settings.theme = "custom";
    fillControls();
    save();
});

SLOT_LABELS.forEach((label, i) => {
    const row = document.createElement("label");
    row.textContent = label;
    const select = document.createElement("select");
    select.id = "slot-" + i;
    const none = document.createElement("option");
    none.value = "none";
    none.textContent = "Nenhuma";
    select.appendChild(none);
    for (const [name, text] of Object.entries(SPRITE_LABELS)) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = text;
        select.appendChild(opt);
    }
    select.addEventListener("input", () => {
        settings.stickers = [...settings.stickers];
        settings.stickers[i] = select.value;
        settings.decor = "stickers";
        settings.theme = "custom";
        fillControls();
        save();
    });
    row.appendChild(select);
    $("slots").appendChild(row);
});

// fontes
for (const font of FONTS) {
    const opt = document.createElement("option");
    opt.value = font;
    opt.textContent = font;
    opt.style.fontFamily = `"${font}"`;
    $("font").appendChild(opt);
}

// cores
for (const [key, label] of Object.entries(COLOR_LABELS)) {
    const row = document.createElement("label");
    row.textContent = label;
    const input = document.createElement("input");
    input.type = "color";
    input.id = "color-" + key;
    input.addEventListener("input", () => {
        settings.colors[key] = input.value;
        settings.theme = "custom";
        refreshActiveTheme();
        save();
    });
    row.appendChild(input);
    $("colors").appendChild(row);
}

bind("frame", "frame", (el) => el.value);
bind("decor", "decor", (el) => el.value);
bind("opacity", "opacity", (el) => Number(el.value));
bind("font", "font", (el) => el.value);
bind("numberScale", "numberScale", (el) => Number(el.value));
bind("showTitle", "showTitle", (el) => el.checked);
bind("titleText", "titleText", (el) => el.value);
bind("language", "language", (el) => el.value);
bind("monthFormat", "monthFormat", (el) => el.value);

$("reset").addEventListener("click", async () => {
    settings = mergeSettings(await window.api.resetSettings());
    fillControls();
});

window.api.getSettings().then((saved) => {
    settings = mergeSettings(saved);
    fillControls();
});
