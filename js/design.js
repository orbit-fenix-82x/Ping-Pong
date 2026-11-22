/* design.js · estilos y piezas visuales nuevas (marcador con avatares, efectos activos, punto de partido y pantalla de resultado).
   Se activa solo al importarlo: crea una hoja de estilos y exporta avTag() / oppTag(). */
import { AVS } from './data/avatars.js';

const CSS = `
/* ---------- avatares pequeños (marcador y resultado) ---------- */
.xav{--s:26px;display:inline-flex;align-items:center;justify-content:center;flex:none;width:var(--s);height:var(--s);border-radius:50%;background-color:#16206a;background-size:cover;background-position:center;border:2px solid rgba(255,255,255,.75);box-shadow:0 0 10px rgba(120,160,255,.45);font-size:calc(var(--s)*.48);font-weight:900;color:#fff;line-height:1;transition:transform .2s,box-shadow .2s,border-color .2s}
.xav.bot{background-image:none;background:linear-gradient(135deg,#3a1a8a,#14246a)}

/* ---------- marcador ---------- */
.score3d .pl{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:44px}
.score3d .pl .nm{font-size:9px;max-width:58px}
.score3d .pl.pt .xav{animation:avPt .65s ease-out}
.score3d .pl.mp .xav{border-color:var(--gold);box-shadow:0 0 16px var(--gold)}
@keyframes avPt{0%{transform:scale(1)}30%{transform:scale(1.35);box-shadow:0 0 22px var(--gold)}100%{transform:scale(1)}}

/* ---------- punto de partido + efectos activos ---------- */
#hud #hStack{position:absolute;left:0;right:0;top:calc(var(--sat) + 104px);display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none}
.mpb{display:inline-block;padding:4px 16px;border-radius:99px;font-size:13px;font-weight:900;font-style:italic;letter-spacing:.1em;white-space:nowrap;color:#1a1000;background:linear-gradient(180deg,#ffe27a,#ffb000);box-shadow:0 3px 0 #8a5a00,0 0 18px rgba(255,190,0,.7);animation:mpPulse .9s ease-in-out infinite}
.mpb.bad{color:#fff;background:linear-gradient(180deg,#ff6b81,#d01030);box-shadow:0 3px 0 #6a0a1a,0 0 18px rgba(255,45,79,.7)}
@keyframes mpPulse{50%{transform:scale(1.07)}}
#hud .fxcol{position:absolute;top:calc(var(--sat) + 96px);display:flex;flex-direction:column;gap:5px;pointer-events:none}
#hud #hFxL{left:calc(var(--sal) + 12px)}
#hud #hFxR{right:calc(var(--sar) + 12px);align-items:flex-end}
#hud #hFxC{display:flex;gap:6px;pointer-events:none}
.fxc{--c:#fff;display:flex;align-items:center;gap:5px;padding:3px 9px 3px 6px;border-radius:99px;background:rgba(4,6,30,.74);border:1.5px solid var(--c);box-shadow:0 0 9px var(--c);animation:fxIn .25s ease-out}
.fxc span{font-size:15px;line-height:1}
.fxc i{display:block;width:34px;height:5px;border-radius:5px;background:rgba(255,255,255,.18);overflow:hidden}
.fxc b{display:block;height:100%;width:100%;background:var(--c);border-radius:5px}
@keyframes fxIn{0%{opacity:0;transform:scale(.6)}100%{opacity:1;transform:scale(1)}}

/* ---------- pantalla de resultado ---------- */
#result>*{position:relative;z-index:1}
#result.win{background:radial-gradient(ellipse at 50% 34%,rgba(255,190,40,.5),rgba(40,14,70,.94) 68%)}
#result.lose{background:radial-gradient(ellipse at 50% 38%,rgba(22,58,160,.55),rgba(2,3,16,.96) 70%)}
#result.win::before{content:'';position:absolute;left:50%;top:36%;width:170vmax;height:170vmax;margin:-85vmax 0 0 -85vmax;z-index:0;pointer-events:none;
  background:repeating-conic-gradient(rgba(255,214,90,.2) 0 7deg,transparent 7deg 20deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 55%);mask-image:radial-gradient(circle,#000 0,transparent 55%);animation:rsRays 24s linear infinite}
@keyframes rsRays{to{transform:rotate(360deg)}}
#result.win h2{animation:rsPop .7s cubic-bezier(.2,1.4,.3,1) both}
#result.lose h2{animation:rsDrop .6s ease-out both}
@keyframes rsPop{0%{opacity:0;transform:scale(.4)}100%{opacity:1;transform:scale(1)}}
@keyframes rsDrop{0%{opacity:0;transform:translateY(-18px)}100%{opacity:1;transform:none}}
#result .vs{display:flex;align-items:center;justify-content:center;gap:14px;margin:6px 0 2px;animation:rsUp .5s .25s both}
#result .vp{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:800;color:#cfe0ff;max-width:88px}
#result .vp .nmx{max-width:88px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#result .vsc{display:flex;align-items:center;gap:10px;font-size:clamp(40px,12vw,56px);font-weight:900;font-style:italic;line-height:1;color:#9fb0e6;text-shadow:0 4px 0 rgba(0,0,0,.5)}
#result .vsc .me{color:var(--gold);text-shadow:0 4px 0 rgba(0,0,0,.5),0 0 20px var(--gold)}
#result.lose .vsc .me{color:#ff9aa8;text-shadow:0 4px 0 rgba(0,0,0,.5),0 0 20px #ff4d6d}
#result .vsc .op{color:#7fb0ff}
#result .stats{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:2px 0;animation:rsUp .5s .45s both}
#result .stats .chip b{color:var(--gold)}
#result .rew{animation:rsUp .5s .6s both}
#result .btns{animation:rsUp .5s .8s both}
@keyframes rsUp{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
`;

(function inject() {
  if (typeof document === 'undefined' || document.getElementById('dsg')) return;
  const s = document.createElement('style'); s.id = 'dsg'; s.textContent = CSS; document.head.appendChild(s);
})();

const ex = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* avatar del jugador (el que eligió en su perfil) */
export const avTag = (i, size = 26) => '<span class="xav" style="--s:' + size + 'px;background-image:url(&quot;' + (AVS[i || 0] || AVS[0]) + '&quot;)"></span>';
/* rival: 🤖 si es el bot, o la inicial de su nombre (o el texto que se pida) */
export const oppTag = (name, bot, size = 26, label = '') =>
  '<span class="xav' + (bot ? ' bot' : '') + '" style="--s:' + size + 'px">' + ex(label || (bot ? '🤖' : String(name || '?').trim().charAt(0).toUpperCase())) + '</span>';
