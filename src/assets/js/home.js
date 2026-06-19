import "lite-youtube-embed";
import BasePage from "./base-page";
import Lightbox from "fslightbox";
window.fslightbox = Lightbox;

class Home extends BasePage {
    onReady() {
        this.initFeaturedTabs();
        this.initJawliner();
    }

    /**
     * used in views/components/home/featured-products-style*.twig
     */
    initFeaturedTabs() {
        app.all('.tab-trigger', el => {
            el.addEventListener('click', ({ currentTarget: btn }) => {
                let id = btn.dataset.componentId;
                app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'is-active opacity-0 translate-y-3', 'inactive', tab => tab.id == btn.dataset.target)
                    .toggleClassIf(`#${id} .tab-trigger`, 'is-active', 'inactive', tabBtn => tabBtn == btn);

                setTimeout(() => app.toggleClassIf(`#${id} .tabs-wrapper>div`, 'opacity-100 translate-y-0', 'opacity-0 translate-y-3', tab => tab.id == btn.dataset.target), 100);
            })
        });
        document.querySelectorAll('.s-block-tabs').forEach(block => block.classList.add('tabs-initialized'));
    }

    initJawliner() {
        const root = document.querySelector('.jawliner-home');
        if (!root) return;

        this.initFaq(root);
        this.initComparisonSlider();
    }

    initFaq(root) {
        app.all('.faq-btn', el => {
            if (!root.contains(el)) return;
            el.addEventListener('click', () => {
                const faq = el.closest('.single-faq');
                const isOpen = faq.classList.contains('open');
                root.querySelectorAll('.single-faq.open').forEach(o => o.classList.remove('open'));
                if (!isOpen) faq.classList.add('open');
            });
        });
    }

    initComparisonSlider() {
        const divider = document.getElementById('jawliner-divider');
        const container = document.getElementById('jawliner-comparison-container');
        const beforeImg = document.getElementById('jawliner-before');
        const afterImg = document.getElementById('jawliner-after');

        if (!divider || !container || !beforeImg || !afterImg) return;

        let dragging = false;

        const updateSlider = (x) => {
            const rect = container.getBoundingClientRect();
            const pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
            divider.style.left = pct + '%';
            beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            afterImg.style.clipPath = `inset(0 0 0 ${pct}%)`;
        };

        divider.addEventListener('mousedown', (e) => {
            dragging = true;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (dragging) updateSlider(e.clientX);
        });
        document.addEventListener('mouseup', () => {
            dragging = false;
        });
        divider.addEventListener('touchstart', (e) => {
            dragging = true;
            e.preventDefault();
        });
        document.addEventListener('touchmove', (e) => {
            if (dragging && e.touches[0]) updateSlider(e.touches[0].clientX);
        });
        document.addEventListener('touchend', () => {
            dragging = false;
        });
    }
}

Home.initiateWhenReady(['index']);
