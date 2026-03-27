// SUPPORT PANEL (Say It Marketing)
function injectSupportPanel() {
  const container = document.body;
  if (document.getElementById('supportPanel')) return;

  const panel = document.createElement('div');
  panel.id = 'supportPanel';
  panel.style.marginTop = '2.5rem';
  panel.style.padding = '1.5rem';
  panel.style.border = '1px solid rgba(0,0,0,0.08)';
  panel.style.borderRadius = '18px';
  panel.style.textAlign = 'center';
  panel.style.background = '#faf9f6';

  panel.innerHTML = `
    <p style="font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; color:#999;">Need Help?</p>
    <h3 style="margin:0.5rem 0 0.8rem;">Say It Marketing</h3>
    <p style="font-size:0.9rem; margin-bottom:1rem;">Reach out to Super Shawn for updates or changes</p>
    <p style="font-size:0.85rem;">
      🌐 sayitmarketing.com<br/>
      📧 hello@sayitmarketing.com<br/>
      📞 (520) 222-6308
    </p>
    <button style="margin-top:1rem; padding:0.75rem 1.5rem; border-radius:999px; border:1px solid #c9a96e; background:#c9a96e; color:#111;">
      Request Help
    </button>
  `;

  container.appendChild(panel);
}

document.addEventListener('DOMContentLoaded', injectSupportPanel);
