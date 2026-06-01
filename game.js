// Protótipo simplificado do Império Agrícola Brasil
const ROWS = 6, COLS = 12;
const gridEl = document.getElementById('grid');
const moneyEl = document.getElementById('money');
const dayEl = document.getElementById('day');
const seasonEl = document.getElementById('season');
const weatherEl = document.getElementById('weather');
const infoEl = document.getElementById('info');
const cropSelect = document.getElementById('cropSelect');
const marketEl = document.getElementById('market');
const machinesEl = document.getElementById('machines');
const animalsEl = document.getElementById('animals');

let state = {
  money: 1000,
  day: 1,
  season: 0, // 0: Verão,1: Outono,2: Inverno,3: Primavera
  weather: 'Ensolarado',
  map: [],
  foodStock: {},
  machines: {tractor:0, harvester:0},
  animals: {cow:0, chicken:0},
};

const SEASONS = ['Verão','Outono','Inverno','Primavera'];

const CROPS = {
  milho:{name:'Milho',days:6,water:2,baseYield:10,price:10},
  feijao:{name:'Feijão',days:5,water:2,baseYield:6,price:8},
  trigo:{name:'Trigo',days:4,water:1,baseYield:5,price:6},
  arroz:{name:'Arroz',days:5,water:3,baseYield:8,price:9},
  batata:{name:'Batata',days:4,water:2,baseYield:7,price:7},
  soja:{name:'Soja',days:6,water:2,baseYield:9,price:11},
  cafe:{name:'Café',days:8,water:2,baseYield:4,price:20},
  cana:{name:'Cana',days:7,water:3,baseYield:12,price:5},
  laranja:{name:'Laranja',days:8,water:3,baseYield:6,price:14},
  uva:{name:'Uva',days:7,water:2,baseYield:5,price:16},
  maca:{name:'Maçã',days:7,water:2,baseYield:5,price:15},
  cacau:{name:'Cacau',days:9,water:2,baseYield:3,price:25}
};

const MARKET = {};
for(const k in CROPS) MARKET[k]={price:CROPS[k].price};

function init(){
  // construir mapa
  for(let y=0;y<ROWS;y++){
    for(let x=0;x<COLS;x++){
      const cell = {x,y,crop:null,growth:0};
      state.map.push(cell);
      const el = document.createElement('div');
      el.className='cell empty';
      el.dataset.x=x;el.dataset.y=y;
      el.addEventListener('click',()=>selectCell(cell,el));
      gridEl.appendChild(el);
      cell.el=el;
    }
  }
  // preencher select de culturas
  for(const k in CROPS){
    const o=document.createElement('option');o.value=k;o.innerText=CROPS[k].name;cropSelect.appendChild(o);
  }

  document.getElementById('plantBtn').onclick=plantSelected;
  document.getElementById('harvestBtn').onclick=harvestSelected;
  document.getElementById('nextDay').onclick=nextDay;

  renderMarket();renderMachines();renderAnimals();renderStats();
}

let selected=null;
function selectCell(cell,el){
  if(selected && selected.el) selected.el.classList.remove('selected');
  selected=cell;el.classList.add('selected');
  infoEl.innerText = cell.crop ? `Lote (${cell.x},${cell.y}) - ${CROPS[cell.crop].name} - Crescimento ${cell.growth}/${CROPS[cell.crop].days}` : `Lote (${cell.x},${cell.y}) vazio`;
}

function plantSelected(){
  if(!selected) return alert('Selecione um lote');
  if(selected.crop) return alert('Lote já plantado');
  const key=cropSelect.value; const cost=5; // preço semente fixo
  if(state.money<cost) return alert('Dinheiro insuficiente');
  state.money-=cost; selected.crop=key; selected.growth=0; updateCell(selected);
  renderStats();
}

function harvestSelected(){
  if(!selected || !selected.crop) return alert('Nada para colher');
  const crop=CROPS[selected.crop];
  if(selected.growth<crop.days) return alert('Ainda não está maduro');
  const yieldAmt = Math.floor(crop.baseYield * (1 + (state.machines.harvester*0.2)));
  state.foodStock[selected.crop]=(state.foodStock[selected.crop]||0)+yieldAmt;
  state.money += yieldAmt * MARKET[selected.crop].price;
  selected.crop=null; selected.growth=0; updateCell(selected); renderStats(); renderMarket();
}

function updateCell(cell){
  const el=cell.el; el.className='cell';
  if(!cell.crop) el.classList.add('empty');
  else{
    const stages = ['seed','g1','g2'];
    const stage = cell.growth>=CROPS[cell.crop].days ? 'g2' : (cell.growth>0 ? 'g1':'seed');
    el.classList.add(stage);
    el.innerText = cell.growth>0 ? cell.growth : '';
  }
}

function nextDay(){
  state.day++; if(state.day%30===0) state.season=(state.season+1)%4;
  // definir clima aleatório simples
  const r=Math.random(); state.weather = r<0.7?'Ensolarado':(r<0.85?'Chuva':'Seca');
  // crescer culturas
  state.map.forEach(cell=>{
    if(cell.crop){
      let growthRate = 1;
      if(state.weather==='Chuva') growthRate+=0.3;
      if(state.weather==='Seca') growthRate-=0.4;
      cell.growth = Math.min(CROPS[cell.crop].days, cell.growth + Math.max(0, growthRate));
      updateCell(cell);
    }
  });
  // animais produzem
  const milk = state.animals.cow * 2;
  state.foodStock['leite']=(state.foodStock['leite']||0)+milk;
  // atualiza preços (sazonal simples)
  for(const k in MARKET){
    const base=CROPS[k].price; MARKET[k].price = Math.max(1, Math.round(base*(0.8+Math.sin(state.day/10)+Math.random()*0.4)));
  }
  renderMarket(); renderStats();
}

function renderMarket(){
  marketEl.innerHTML='';
  for(const k in MARKET){
    const d=document.createElement('div'); d.innerText=`${CROPS[k].name}: R$ ${MARKET[k].price}`; marketEl.appendChild(d);
  }
}

function renderMachines(){
  machinesEl.innerHTML='';
  const buyTr=document.createElement('button'); buyTr.innerText='Comprar Colheitadeira R$500'; buyTr.onclick=()=>{ if(state.money<500) return alert('Sem dinheiro'); state.money-=500; state.machines.harvester++; renderMachines(); renderStats(); };
  machinesEl.appendChild(buyTr);
}

function renderAnimals(){
  animalsEl.innerHTML='';
  const buyCow=document.createElement('button'); buyCow.innerText='Comprar Vaca R$200'; buyCow.onclick=()=>{ if(state.money<200) return alert('Sem dinheiro'); state.money-=200; state.animals.cow++; renderAnimals(); renderStats(); };
  animalsEl.appendChild(buyCow);
}

function renderStats(){
  moneyEl.innerText = `R$ ${state.money}`;
  dayEl.innerText = `Dia ${state.day}`;
  seasonEl.innerText = `Estação: ${SEASONS[state.season]}`;
  weatherEl.innerText = `Tempo: ${state.weather}`;
}

init();
