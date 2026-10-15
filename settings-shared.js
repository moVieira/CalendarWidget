// Padrões e temas compartilhados entre o widget e a janela de personalização.
const DEFAULT_SETTINGS = {
    theme: "garden",
    frame: "image",
    decor: "plants",
    stickers: ["butterfly", "mushroom", "cat", "tulip"],
    opacity: 100,
    font: "Pixelify Sans",
    titleText: "Gui's Calendar",
    showTitle: true,
    language: "en",
    monthFormat: "long",
    numberScale: 100,
    colors: {
        frameBg: "#9bbf7a",
        frameBorder: "#657D50",
        innerBg: "#3f5a35",
        titleBg: "#F7FAD1",
        titleText: "#6E9144",
        numberColor: "#C8DDAF",
        numberStroke: "#151615"
    }
};

// [canto sup. direito, inf. esquerdo, inf. centro, inf. direito]
const DECOR_SETS = {
    cute: ["butterfly", "mushroom", "cat", "tulip"],
    sweet: ["star", "heart", "strawberry", "heart"],
    sky: ["cloud", "star", "butterfly", "star"]
};

const THEMES = {
    garden: { label: "Jardim", frame: "image", decor: "plants", colors: DEFAULT_SETTINGS.colors },
    dark: {
        label: "Escuro", frame: "flat", decor: "stickers", stickers: DECOR_SETS.cute,
        colors: { frameBg: "#1e1f26", frameBorder: "#4b4e5e", innerBg: "#12131a", titleBg: "#2a2c38", titleText: "#e6e8f2", numberColor: "#f2f3fa", numberStroke: "#000000" }
    },
    pastel: {
        label: "Pastel rosa", frame: "flat", decor: "stickers", stickers: DECOR_SETS.sweet,
        colors: { frameBg: "#f7c6d9", frameBorder: "#d9779f", innerBg: "#fde8f0", titleBg: "#fff5f9", titleText: "#c04f7d", numberColor: "#f4a3c2", numberStroke: "#8a2f56" }
    },
    ocean: {
        label: "Oceano", frame: "flat", decor: "stickers", stickers: DECOR_SETS.sky,
        colors: { frameBg: "#9fd3e6", frameBorder: "#2f7a99", innerBg: "#1f5673", titleBg: "#e3f6fc", titleText: "#1f6a8a", numberColor: "#d8f1fa", numberStroke: "#0b2a3a" }
    },
    minimal: {
        label: "Minimalista", frame: "flat", decor: "none",
        colors: { frameBg: "#ffffff", frameBorder: "#222222", innerBg: "#ffffff", titleBg: "#ffffff", titleText: "#222222", numberColor: "#222222", numberStroke: "#ffffff" }
    }
};

const FONTS = ["Pixelify Sans", "Press Start 2P", "VT323", "Silkscreen", "Quicksand", "Pacifico", "Inter"];

const MONTHS = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
};

const DECORS = {
    plants: "Plantinhas (jardim)",
    stickers: "Imagens fofinhas",
    none: "Nenhum"
};

const SET_LABELS = { cute: "Bichinhos fofos", sweet: "Docinhos", sky: "Céu" };
const SPRITE_LABELS = { heart: "Coração", star: "Estrela", tulip: "Tulipa", mushroom: "Cogumelo", cat: "Gatinho", cloud: "Nuvem", butterfly: "Borboleta", strawberry: "Morango" };
const SLOT_LABELS = ["Canto superior direito", "Embaixo à esquerda", "Embaixo no centro", "Embaixo à direita"];

// pixel-art: cada letra é uma cor da paleta, "." é transparente
const SPRITE_PALETTE = { k: "#4a3a3a", r: "#f0506e", w: "#ffffff", y: "#ffd84a", p: "#ff9ec4", g: "#6fbf5f", b: "#f6e3c4", s: "#ffe98a" };

const SPRITES = {
    heart: ["..kkk.kkk..", ".krrrkrrrk.", "krwrrrrrrrk", "krrrrrrrrrk", "krrrrrrrrrk", ".krrrrrrrk.", "..krrrrrk..", "...krrrk...", "....krk....", ".....k....."],
    star: [".....k.....", "....kyk....", "....kyk....", "kkkkkykkkkk", "kyyyyyyyyyk", ".kyywyyyyk.", "..kyyyyyk..", "..kyyyyyk..", ".kyyykyyyk.", ".kyykkkyyk.", ".kkk...kkk."],
    tulip: ["..k.....k..", ".kpk...kpk.", ".kppk.kppk.", ".kpppkpppk.", ".kpppppppk.", "..kpppppk..", "...kkkkk...", ".....g.....", "..gg.g.....", "...ggg.....", ".....g....."],
    mushroom: ["...kkkkk...", "..krrwrrk..", ".krwwrrrrk.", "krrwwrrwrrk", "krrrrrrwwrk", "kkkkkkkkkkk", "..kbbbbbk..", "..kbbbbbk..", "..kbbbbbk..", "...kkkkk..."],
    cat: [".k.......k.", "kwk.....kwk", "kwwkkkkkwwk", "kwwwwwwwwwk", "kwwkwwwkwwk", "kwwwwpwwwwk", ".kwwwkwwwk.", "..kwwwwwk..", "..kkkkkkk.."],
    cloud: ["....kkk......", "...kwwwk.kk..", ".kkkwwwkkwwk.", "kwwwwwwwwwwwk", "kwwwwwwwwwwwk", ".kkkkkkkkkkk."],
    butterfly: ["kkk.....kkk", "kppk.k.kppk", "kpppkkkpppk", "kpwpkkkpwpk", ".kpppkpppk.", ".kppkkkppk.", "..kpk.kpk..", "...k...k..."],
    strawberry: ["...gg.gg...", "....ggg....", ".kkkkkkkkk.", "krrrrrrrrrk", "krsrrrrsrrk", "krrrrsrrrrk", ".krrsrrrrk.", ".krrrrrsrk.", "..krsrrrk..", "...krrrk...", "....kkk...."]
};

const spriteCache = {};
function spriteURL(name) {
    if (spriteCache[name]) return spriteCache[name];
    const rows = SPRITES[name];
    let rects = "";
    rows.forEach((row, y) => {
        [...row].forEach((ch, x) => {
            if (SPRITE_PALETTE[ch]) rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${SPRITE_PALETTE[ch]}"/>`;
        });
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges">${rects}</svg>`;
    return (spriteCache[name] = "data:image/svg+xml;utf8," + encodeURIComponent(svg));
}

function mergeSettings(saved) {
    if (saved && saved.decor === undefined && saved.plants !== undefined) {
        saved = { ...saved, decor: saved.plants ? "plants" : "none" };
    }
    if (saved && DECOR_SETS[saved.decor]) {
        saved = { ...saved, stickers: DECOR_SETS[saved.decor], decor: "stickers" };
    }
    return {
        ...DEFAULT_SETTINGS,
        ...saved,
        colors: { ...DEFAULT_SETTINGS.colors, ...(saved && saved.colors) }
    };
}
