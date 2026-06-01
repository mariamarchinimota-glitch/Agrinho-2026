// RPG ampliado: suporte a múltiplas culturas com propriedades, ações e eventos

let rpgRunning = false;
let canvas, ctx;
const cols = 12;
const rows = 6;
const tileSize = 48;

// cada célula terá um objeto: { crop:null|key, growth:0..days, water:level, pest:false }
let cells = [];

const CROPS = {
    milho: { name: 'Milho', days: 6, waterNeed: 2, resistance: 0.6, yield: 10, price: 10 },
    trigo: { name: 'Trigo', days: 4, waterNeed: 1, resistance: 0.8, yield: 5, price: 6 },
    soja: { name: 'Soja', days: 6, waterNeed: 2, resistance: 0.65, yield: 9, price: 11 },
    cover: { name: 'Cobertura', days: 4, waterNeed: 1, resistance: 1.0, yield: 0 }
};
const ALLOWED_CROPS = ['milho', 'trigo', 'soja'];

let player = { x: 0, y: 0, direction: 'right', headerLower: 0 };
let foodCount = 0;
let growInterval;
let selectedCrop = 'milho';
let machineSpray = { type: null, timer: 0 };

function initMap() {
    cells = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const c = { x, y, crop: 'milho', growth: CROPS['milho'].days, water: 5, pest: false, soilState: 'tilled', lastCrop: null, rotationBonus: false };
            cells.push(c);
        }
    }
}

function initRPG() {
    if (rpgRunning) return;
    rpgRunning = true;
    document.getElementById('rpgSection').style.display = 'block';
    canvas = document.getElementById('rpgCanvas');
    ctx = canvas.getContext('2d');
    initMap();
    populateCropSelect();
    autoHarvestAt(player.x, player.y);
    draw();

    window.addEventListener('keydown', handleKey);

    growInterval = setInterval(growTick, 2500);
}

function stopRPG() {
    rpgRunning = false;
    document.getElementById('rpgSection').style.display = 'none';
    clearInterval(growInterval);
    window.removeEventListener('keydown', handleKey);
}

function populateCropSelect(){
    const sel = document.getElementById('rpgCropSelect'); sel.innerHTML='';
    for(const k of ALLOWED_CROPS){ const o=document.createElement('option'); o.value=k; o.innerText=CROPS[k].name; sel.appendChild(o); }
    sel.value = selectedCrop; sel.onchange = ()=> selectedCrop = sel.value;
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // grid
    for(const c of cells){
        const tx = c.x * tileSize; const ty = c.y * tileSize;
        // solo marrom para a plantação
        if(c.soilState === 'tilled'){
            ctx.fillStyle = '#8B5A2B';
        } else if(c.soilState === 'fallow'){
            ctx.fillStyle = '#7a4d2a';
        } else if(c.soilState === 'cover'){
            ctx.fillStyle = '#6a8f55';
        } else {
            ctx.fillStyle = '#8B5A2B';
        }
        roundRect(ctx, tx+1, ty+1, tileSize-2, tileSize-2, 6, true, false);
        ctx.strokeStyle='#6E3E1F'; ctx.lineWidth=1; roundRect(ctx, tx+1, ty+1, tileSize-2, tileSize-2, 6, false, true);
        if(c.crop){
            const cropDef = CROPS[c.crop];
            const mature = c.growth >= cropDef.days;
            if(c.crop === 'trigo'){
                drawWheat(tx+tileSize/2, ty+tileSize-6, Math.min(1, c.growth / cropDef.days));
            } else if(c.crop === 'milho'){
                drawCorn(tx+tileSize/2, ty+tileSize-6, Math.min(1, c.growth / cropDef.days));
            } else if(c.crop === 'cover'){
                drawCoverCrop(tx+tileSize/2, ty+tileSize-12, Math.min(1, c.growth / cropDef.days));
            } else {
                if(mature) ctx.fillStyle='#f1c40f';
                else if(c.growth>0) ctx.fillStyle='#27ae60';
                else ctx.fillStyle='#9b59b6';
                ctx.fillRect(tx+6,ty+10,tileSize-12,tileSize-18);
            }
            if(c.pest){ ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(tx+2,ty+2,12,12); }
        }
    }
    drawCombine(player.x*tileSize+tileSize/2, player.y*tileSize+tileSize/2);
    document.getElementById('foodCount').innerText = foodCount;

    // draw spray effects from the combine
    drawSpray();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof radius === 'undefined') radius = 5;
    if (typeof radius === 'number') radius = {tl: radius, tr: radius, br: radius, bl: radius};
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function drawFarmer(cx, cy){
    // simple farmer sprite (smaller to fit on combine)
    ctx.save();
    ctx.translate(cx, cy);
    // legs
    ctx.fillStyle = '#3b3b3b'; ctx.fillRect(-4,8,3,8); ctx.fillRect(1,8,3,8);
    // body
    ctx.fillStyle = '#5a8f46'; ctx.fillRect(-6,-2,12,12);
    // arms
    ctx.fillStyle = '#7b5a3c'; ctx.fillRect(-10,-2,4,3); ctx.fillRect(6,-2,4,3);
    // head
    ctx.beginPath(); ctx.fillStyle='#f1c27d'; ctx.arc(0,-8,5,0,Math.PI*2); ctx.fill();
    // hat
    ctx.fillStyle='#8b3e2f'; ctx.fillRect(-6,-14,12,5); ctx.fillRect(-4,-16,8,3);
    ctx.restore();
}

function drawCombine(cx, cy){
    const lower = player.headerLower * 4;
    const dir = player.direction;
    const header = { x: 14, y: -4, w: 8, h: 14 };
    let sideHeader = false;

    if(dir === 'right'){
        header.x = 14; header.y = -4 + lower; sideHeader = false;
    } else if(dir === 'left'){
        header.x = -22; header.y = -4 + lower; sideHeader = false;
    } else if(dir === 'up'){
        header.x = -4 + lower; header.y = -22; sideHeader = true;
    } else if(dir === 'down'){
        header.x = -4 + lower; header.y = 14; sideHeader = true;
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#b03a2e'; ctx.strokeStyle='#78281f'; ctx.lineWidth=2;
    roundRect(ctx, -14, -12, 28, 18, 5, true, true);
    ctx.fillStyle = '#5dade2'; roundRect(ctx, -10, -22, 18, 10, 3, true, true);
    ctx.fillStyle = '#fdfefe'; roundRect(ctx, -8, -20, 14, 8, 2, true, false);
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(-9, 10, 5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(9, 10, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#777'; ctx.beginPath(); ctx.arc(-9, 10, 2.5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(9, 10, 2.5, 0, Math.PI*2); ctx.fill();

    // cabeçote de colheita com movimento para baixo
    ctx.fillStyle = '#f39c12';
    if(sideHeader){
        ctx.fillRect(header.x, header.y, 10, 18);
        ctx.strokeStyle = '#d68910'; ctx.lineWidth = 2;
        for(let i=0;i<4;i++){
            const xx = header.x + 2 + i*2;
            ctx.beginPath(); ctx.moveTo(xx, header.y); ctx.lineTo(xx+2, header.y+16); ctx.stroke();
        }
    } else {
        ctx.beginPath();
        ctx.moveTo(header.x, header.y);
        ctx.lineTo(header.x + (dir==='left'? -12 : 12), header.y + 4);
        ctx.lineTo(header.x + (dir==='left'? -12 : 12), header.y + header.h + 4);
        ctx.lineTo(header.x, header.y + header.h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#d68910'; ctx.lineWidth = 2;
        for(let i=0;i<4;i++){
            const yy = header.y + 2 + i*4;
            ctx.beginPath(); ctx.moveTo(header.x + (dir==='left'? -10 : 2), yy);
            ctx.lineTo(header.x + (dir==='left'? -2 : 10), yy+2);
            ctx.stroke();
        }
    }

    drawFarmer(0, -24);

    // caçamba de colheita na traseira
    ctx.fillStyle = '#a569bd';
    roundRect(ctx, -14, -10, 12, 8, 3, true, true);
    ctx.fillStyle = '#f4d03f'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(foodCount, -8, -4);
    ctx.restore();
}

function drawSpray(){
    if(machineSpray.timer <= 0) return;
    const cx = player.x * tileSize + tileSize/2;
    const cy = player.y * tileSize + tileSize/2;
    let color = 'rgba(135,206,250,0.7)';
    color = 'rgba(135,206,250,0.7)';
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    for(let i=0;i<5;i++){
        const angle = Math.PI*0.45 + i * 0.15;
        const len = 28 + i * 2;
        ctx.beginPath(); ctx.moveTo(cx + 10, cy - 8); ctx.lineTo(cx + 10 + Math.cos(angle)*len, cy - 8 - Math.sin(angle)*len); ctx.stroke();
    }
    machineSpray.timer--;
}

function drawWheat(cx, baseY, t){
    // t: stage 0..1
    ctx.save();
    ctx.translate(cx, baseY);
    ctx.strokeStyle = '#6b3'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-18 - t*10); ctx.stroke();
    const grains = 6;
    for(let i=0;i<grains;i++){
        const y = -4 - (i*( (18 + t*10)/grains));
        ctx.beginPath(); ctx.fillStyle = '#f1c40f'; ctx.ellipse(-4, y, 3, 5, -0.4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = '#f1c40f'; ctx.ellipse(4, y-1, 3, 5, 0.4, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
}

function drawCorn(cx, baseY, t){
    ctx.save();
    ctx.translate(cx, baseY);
    const height = -20 - t*12;
    ctx.strokeStyle = '#38761d'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,height); ctx.stroke();
    ctx.fillStyle = '#6aa84f';
    for(let i=0;i<4;i++){
        const y = -8 - i*6;
        ctx.beginPath(); ctx.ellipse(-6, y, 5, 8, -0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(6, y, 5, 8, 0.3, 0, Math.PI*2); ctx.fill();
    }
    if(t >= 0.7){
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.ellipse(0, height+8, 7, 10, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
}

function handleKey(e){
    if(!rpgRunning) return;
    const key = e.key;
    let moved=false;
    if(key==='ArrowUp' && player.y>0){ player.y--; player.direction='up'; moved=true; }
    if(key==='ArrowDown' && player.y<rows-1){ player.y++; player.direction='down'; moved=true; }
    if(key==='ArrowLeft' && player.x>0){ player.x--; player.direction='left'; moved=true; }
    if(key==='ArrowRight' && player.x<cols-1){ player.x++; player.direction='right'; moved=true; }
    if(key==='p' || key==='P'){ plantAt(player.x,player.y); moved=true; }
    if(key==='h' || key==='H'){ harvestAt(player.x,player.y); moved=true; }
    if(moved){
        if(key.startsWith('Arrow')){
            player.headerLower = 1;
            autoHarvestAt(player.x, player.y);
        }
        draw();
    }
}

function getCell(x,y){ return cells[y*cols + x]; }

function plantAt(x,y){ const c=getCell(x,y); if(c.crop) return; c.crop=selectedCrop; c.growth=0; c.water=0; c.pest=false; c.rotationBonus = c.lastCrop && c.lastCrop !== selectedCrop; c.soilState='planted'; draw(); }

function getNeighbors(cell) {
    const results = [];
    for(let dy=-1; dy<=1; dy++){
        for(let dx=-1; dx<=1; dx++){
            if(dx===0 && dy===0) continue;
            const nx = cell.x + dx; const ny = cell.y + dy;
            if(nx>=0 && nx<cols && ny>=0 && ny<rows){ results.push(getCell(nx,ny)); }
        }
    }
    return results;
}

function actionWater(){ const c=getCell(player.x,player.y); if(!c.crop) return; c.water = Math.min(10, c.water + 2); getNeighbors(c).forEach(n => n.water = Math.min(10, n.water + 0.4)); machineSpray = { type:'water', timer: 8 }; draw(); }
function actionHarvest(){ harvestAt(player.x,player.y); draw(); }


function harvestAt(x,y){ const c=getCell(x,y); if(!c.crop) return; const def=CROPS[c.crop]; if(c.growth < def.days) return; const yieldAmt = def.yield; foodCount += yieldAmt; c.lastCrop = c.crop; c.crop=null; c.growth=0; c.water=0; c.pest=false; c.soilState='bare'; c.rotationBonus=false; }

function autoHarvestAt(x,y){ const c=getCell(x,y); if(!c.crop) return; const def=CROPS[c.crop]; if(c.growth < def.days) return; harvestAt(x,y); }

function growTick(){
    // crescimento e eventos de pragas aleatórias
    for(const c of cells){
        if(c.crop){
            const def = CROPS[c.crop];
            if(c.pest){ c.growth = Math.max(0, c.growth - 0.5); continue; }
            const waterFactor = Math.min(1, c.water / def.waterNeed);
            const rotation = c.rotationBonus ? 1.2 : 1.0;
            c.growth += 0.5 * waterFactor * rotation;
            if(c.water < def.waterNeed && Math.random() < 0.06) c.pest = true;
            c.water = Math.max(0, c.water - 0.3);
        }
    }
    if(player.headerLower > 0) player.headerLower = Math.max(0, player.headerLower - 0.12);
    draw();
}


// Expor funções para HTML
window.initRPG = initRPG; window.stopRPG = stopRPG;
window.actionWater = actionWater; window.actionHarvest = actionHarvest;
