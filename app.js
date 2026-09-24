'use strict';
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.hash.slice(1));
const recipient = (params.get('voor') || '').trim().slice(0,40);
if (recipient) { $('dedication').textContent = `Voor ${recipient}`; $('giftTitle').textContent = `Voor ${recipient}`; }
function openDialog(id) { $(id).showModal(); }
$('settingsButton').onclick = () => openDialog('settingsDialog');
$('giftButton').onclick = () => openDialog('giftDialog');
$('noteButton').onclick = () => openDialog('noteDialog');
$('foldButton').onclick = () => {
  $('noteDialog').close();
  $('noteButton').innerHTML = $('note').value.trim() ? '<span aria-hidden="true">▱</span> Mijn briefje' : '<span aria-hidden="true">▱</span> Iets neerleggen';
  $('status').textContent = $('note').value.trim() ? 'Je briefje is dichtgevouwen. Je kunt het weer openen.' : '';
};
$('clearButton').onclick = () => { $('note').value = ''; $('noteButton').innerHTML = '<span aria-hidden="true">▱</span> Iets neerleggen'; $('note').focus(); };
function rest(value) { document.body.classList.toggle('rest',value); $('returnButton').hidden = !value; (value ? $('returnButton') : $('restButton')).focus(); }
$('restButton').onclick = () => rest(true);
$('returnButton').onclick = () => rest(false);
document.addEventListener('keydown',e => { if(e.key === 'Escape' && document.body.classList.contains('rest')) rest(false); });
$('dim').onchange = e => document.body.classList.toggle('dim',e.target.checked);
$('motion').onchange = e => document.body.classList.toggle('moving',e.target.checked);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function syncMotion() { if(reducedMotion.matches) { $('motion').checked=false; document.body.classList.remove('moving'); } $('motion').disabled=reducedMotion.matches; }
syncMotion(); reducedMotion.addEventListener('change',syncMotion);
let context, gain, source, playing = false, busy = false;
function soundLabel() { $('soundButton').innerHTML = `<span aria-hidden="true">≈</span> Geruis ${playing?'uit':'aan'}`; $('soundButton').setAttribute('aria-pressed',String(playing)); }
async function stopSound() {
  playing=false; soundLabel();
  if(context?.state==='running') { gain.gain.cancelScheduledValues(context.currentTime); gain.gain.setTargetAtTime(0,context.currentTime,.12); await new Promise(resolve=>setTimeout(resolve,450)); if(!playing) await context.suspend(); }
}
$('soundButton').onclick = async () => {
  if(busy) return; busy=true; $('soundButton').disabled=true;
  try {
    if(playing) await stopSound();
    else {
      if(!context) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if(!Audio) throw new Error('Audio unavailable');
        context=new Audio(); gain=context.createGain(); gain.gain.value=0;
        const buffer=context.createBuffer(1,context.sampleRate*8,context.sampleRate), data=buffer.getChannelData(0);
        let last=0; for(let i=0;i<data.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;data[i]=last*3.5;}
        // Crossfade the join to avoid a click when the noise buffer loops.
        const seam=Math.floor(context.sampleRate*.1); for(let i=0;i<seam;i++){const mix=i/seam;data[i]=data[data.length-seam+i]*(1-mix)+data[i]*mix;}
        source=context.createBufferSource();source.buffer=buffer;source.loop=true;
        const lowpass=context.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=850;
        source.connect(lowpass);lowpass.connect(gain);gain.connect(context.destination);source.start();
      }
      await context.resume();
      if(document.hidden){await context.suspend();return;}
      playing=true;gain.gain.cancelScheduledValues(context.currentTime);gain.gain.setTargetAtTime(Number($('volume').value)/100,context.currentTime,1.2);soundLabel();
    }
  } catch(error){playing=false;soundLabel();$('status').textContent='Geruis is in deze browser niet beschikbaar.';}
  finally{busy=false;$('soundButton').disabled=false;}
};
$('volume').oninput = e => {if(playing)gain.gain.setTargetAtTime(Number(e.target.value)/100,context.currentTime,.2);};
document.addEventListener('visibilitychange',()=>{if(document.hidden && playing)void stopSound();});
window.addEventListener('pagehide',()=>{playing=false;if(context)void context.suspend();});
if('serviceWorker' in navigator && location.protocol!=='file:') navigator.serviceWorker.register('./sw.js').catch(()=>{});
