// Mobile Nav Toggle
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        primaryNav.classList.toggle('nav-open');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(evt) {
        evt.preventDefault();
        const destId = this.getAttribute('href');
        if (destId === '#') return;

        const destEl = document.querySelector(destId);
        if (destEl) {
            destEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Auto close mobile nav
            if (primaryNav && primaryNav.classList.contains('nav-open')) {
                primaryNav.classList.remove('nav-open');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {

    // Subscription Type Toggle
    const optSingle = document.querySelector('.opt-single');
    const optDouble = document.querySelector('.opt-double');
    const panelSingle = document.querySelector('.details-single');
    const panelDouble = document.querySelector('.details-double');
    const radSingle = document.querySelector('input[value="single"]');
    const radDouble = document.querySelector('input[value="double"]');

    const revealSingle = () => {
        if (optSingle) optSingle.classList.add('active');
        if (optDouble) optDouble.classList.remove('active');
        
        if (panelSingle) {
            panelSingle.classList.remove('block-active');
            setTimeout(() => {
                panelSingle.style.display = 'block';
                setTimeout(() => panelSingle.classList.add('block-active'), 10);
            }, 10);
        }
        if (panelDouble) {
            panelDouble.classList.remove('block-active');
            setTimeout(() => {
                panelDouble.style.display = 'none';
            }, 400);
        }
    };

    const revealDouble = () => {
        if (optDouble) optDouble.classList.add('active');
        if (optSingle) optSingle.classList.remove('active');
        
        if (panelDouble) {
            panelDouble.classList.remove('block-active');
            setTimeout(() => {
                panelDouble.style.display = 'block';
                setTimeout(() => panelDouble.classList.add('block-active'), 10);
            }, 10);
        }
        if (panelSingle) {
            panelSingle.classList.remove('block-active');
            setTimeout(() => {
                panelSingle.style.display = 'none';
            }, 400);
        }
    };

    // Default init
    revealSingle();

    if (optSingle) {
        optSingle.addEventListener('click', () => {
            if (radSingle) radSingle.checked = true;
            revealSingle();
        });
    }

    if (optDouble) {
        optDouble.addEventListener('click', () => {
            if (radDouble) radDouble.checked = true;
            revealDouble();
        });
    }

    if (radSingle) radSingle.addEventListener('change', () => { if (radSingle.checked) revealSingle(); });
    if (radDouble) radDouble.addEventListener('change', () => { if (radDouble.checked) revealDouble(); });

    // Fragrance selection logic
    const allFragItems = document.querySelectorAll('.frag-item');
    allFragItems.forEach(item => {
        item.addEventListener('click', () => {
            const gridParent = item.closest('.frag-grid');
            if (gridParent) {
                gridParent.querySelectorAll('.frag-item').forEach(el => el.classList.remove('active'));
            }
            item.classList.add('active');
            const radioInp = item.querySelector('input[type="radio"]');
            if (radioInp) radioInp.checked = true;
            refreshCartURL();
        });
    });

    // Dynamic Add to Cart URL logic
    const refreshCartURL = () => {
        const mode = document.querySelector('input[name="purchaseMode"]:checked')?.value || 'single';
        let generatedURL = '/cart?type=' + mode;

        if (mode === 'single') {
            const choice = document.querySelector('input[name="fragSingle"]:checked')?.value || 'original';
            generatedURL += '&fragrance=' + choice;
        } else if (mode === 'double') {
            const bot1 = document.querySelector('input[name="fragDbl1"]:checked')?.value || 'original';
            const bot2 = document.querySelector('input[name="fragDbl2"]:checked')?.value || 'original';
            generatedURL += '&fragrance1=' + bot1 + '&fragrance2=' + bot2;
        }

        console.log('Cart URL ->', generatedURL);
        return generatedURL;
    };

    const btnCart = document.querySelector('.btn-addToCart');
    if (btnCart) {
        btnCart.addEventListener('click', (e) => {
            e.preventDefault();
            const targetStr = refreshCartURL();
            // Just updating visually based on requirement
            window.location.href = 'cart.html?' + targetStr.split('?')[1];
            return false;
        });
    }

    document.querySelectorAll('input[type="radio"][name="purchaseMode"]').forEach(r => r.addEventListener('change', refreshCartURL));
    document.querySelectorAll('input[type="radio"][name="fragSingle"]').forEach(r => r.addEventListener('change', refreshCartURL));
    document.querySelectorAll('input[type="radio"][name="fragDbl1"]').forEach(r => r.addEventListener('change', refreshCartURL));
    document.querySelectorAll('input[type="radio"][name="fragDbl2"]').forEach(r => r.addEventListener('change', refreshCartURL));

    refreshCartURL();

    // Image Gallery System
    const pics = document.querySelectorAll('.pic');
    const totalPics = pics.length;
    let currIdx = 0;

    const displayPic = (idx) => {
        pics.forEach(p => p.classList.remove('active'));
        if (pics[idx]) pics[idx].classList.add('active');
        refreshDots(idx);
        refreshThumbs(idx);
    };

    const buildDots = () => {
        const pDots = document.getElementById('pagerDots');
        if (!pDots) return;
        pDots.innerHTML = '';
        for (let j = 0; j < totalPics; j++) {
            const d = document.createElement('div');
            d.className = `pager-dot ${j === 0 ? 'active' : ''}`;
            d.addEventListener('click', () => {
                currIdx = j;
                displayPic(j);
            });
            pDots.appendChild(d);
        }
    };

    const refreshDots = (idx) => {
        document.querySelectorAll('.pager-dot').forEach((d, k) => {
            d.classList.toggle('active', k === idx);
        });
    };

    const allThumbs = document.querySelectorAll('.thumb');
    allThumbs.forEach((tm, i) => {
        // the grid has more thumbnails than main pics due to original structure, limit interaction somewhat
        tm.addEventListener('click', () => {
            const datIdx = parseInt(tm.getAttribute('data-idx'));
            if (!isNaN(datIdx) && datIdx < totalPics) {
                currIdx = datIdx;
                displayPic(datIdx);
            }
        });
    });

    const refreshThumbs = (idx) => {
        document.querySelectorAll('.thumb').forEach((tm) => {
            const di = parseInt(tm.getAttribute('data-idx'));
            tm.classList.toggle('pic-active', di === idx);
        });
    };

    const btnBack = document.getElementById('btnPrev');
    const btnFwd = document.getElementById('btnNext');

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            currIdx = (currIdx - 1 + totalPics) % totalPics;
            displayPic(currIdx);
        });
    }
    if (btnFwd) {
        btnFwd.addEventListener('click', () => {
            currIdx = (currIdx + 1) % totalPics;
            displayPic(currIdx);
        });
    }

    if (totalPics > 0) buildDots();

    // Collection Accordion
    document.querySelectorAll('.acc-row').forEach(row => {
        const head = row.querySelector('.acc-head');
        if (head) {
            head.addEventListener('click', () => {
                const bdy = row.querySelector('.acc-body');
                const icn = row.querySelector('.acc-icon');
                if (bdy) bdy.classList.toggle('expand');
                if (icn) icn.textContent = bdy.classList.contains('expand') ? '−' : '+';
            });
        }
    });

    // Stats Animation Engine
    const runNumAnim = (domEl, destVal, appendStr = '') => {
        let startObj = 0;
        const stepAmt = destVal / 50;
        
        const timerId = setInterval(() => {
            startObj += stepAmt;
            if (startObj >= destVal) {
                domEl.textContent = destVal + appendStr;
                clearInterval(timerId);
            } else {
                domEl.textContent = Math.floor(startObj) + appendStr;
            }
        }, 30);
    };

    // Hero stat anim on load
    document.querySelectorAll('.val').forEach(el => {
        const endp = parseInt(el.dataset.endpoint);
        const postfix = el.dataset.append || '';
        if (endp) runNumAnim(el, endp, postfix);
    });

    // Scroll stat anim
    const setupNumObservers = () => {
        const statNodes = document.querySelectorAll('.info-num');
        const viewOpts = { threshold: 0.5 };

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting && !en.target.dataset.runYet) {
                    const eVal = parseInt(en.target.dataset.endpoint);
                    const fx = en.target.dataset.append || '';
                    runNumAnim(en.target, eVal, fx);
                    en.target.dataset.runYet = 'true';
                }
            });
        }, viewOpts);

        statNodes.forEach(node => obs.observe(node));
    };

    setupNumObservers();

    // Comparison Table Column Switcher
    const cols = document.querySelectorAll('.col-prod');

    const redrawColIcons = (cIdx, fillTrue) => {
        const tableCells = document.querySelectorAll(`td[data-col="${cIdx}"]`);
        tableCells.forEach(tc => {
            const visual = tc.querySelector('img');
            if (visual) {
                const srcPath = visual.getAttribute('src');
                if (fillTrue) {
                    if (srcPath.includes('correct.svg') && !srcPath.includes('filled')) {
                        visual.setAttribute('src', srcPath.replace('correct.svg', 'correct-filled.svg'));
                    } else if (srcPath.includes('incorrect.svg') && !srcPath.includes('filled')) {
                        visual.setAttribute('src', srcPath.replace('incorrect.svg', 'incorrect-filled.svg'));
                    }
                } else {
                    if (srcPath.includes('correct-filled.svg')) {
                        visual.setAttribute('src', srcPath.replace('correct-filled.svg', 'correct.svg'));
                    } else if (srcPath.includes('incorrect-filled.svg')) {
                        visual.setAttribute('src', srcPath.replace('incorrect-filled.svg', 'incorrect.svg'));
                    }
                }
            }
        });
    };

    cols.forEach(cl => {
        cl.addEventListener('click', function() {
            const cInd = this.dataset.col;
            const pastSel = document.querySelector('.col-prod.col-active');
            const pastInd = pastSel ? pastSel.dataset.col : null;

            document.querySelectorAll('.col-prod.col-active, td.cell-active').forEach(ex => {
                ex.classList.remove('col-active', 'cell-active');
            });

            if (pastInd) redrawColIcons(pastInd, false);

            this.classList.add('col-active');
            document.querySelectorAll(`td[data-col="${cInd}"]`).forEach(tc => tc.classList.add('cell-active'));
            redrawColIcons(cInd, true);
        });
    });

    const primaryCol = document.querySelector('.col-prod[data-col="1"]');
    if (primaryCol) primaryCol.click();

});
