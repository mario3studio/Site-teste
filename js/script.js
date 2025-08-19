function menuMobile() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuList = document.querySelector('.menu-container');
    const body = document.body;

    if (menuToggle && menuList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuList.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Adiciona ou remove a classe 'no-scroll' do body
            body.classList.toggle('no-scroll');
        });
        
        // Seleciona todos os links dentro do menu
        const menuLinks = menuList.querySelectorAll('a');

        // Adiciona um evento de clique a cada link do menu
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Fecha o menu
                menuList.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');

                // Remove a classe 'no-scroll' do body para permitir a rolagem novamente
                body.classList.remove('no-scroll');
            });
        });
    }
}
menuMobile();


function slides(){
    document.addEventListener('DOMContentLoaded', () => {
    // Função para clonar os elementos do slider
    function setupSliderClones(selector) {
        const track = document.querySelector(selector);
        if (track) {
            const elements = [...track.children];
            elements.forEach(element => {
                const clone = element.cloneNode(true);
                track.appendChild(clone);
            });
        }
    }
    
    setupSliderClones('.slider-track');
    setupSliderClones('.slider-galery-track');
    setupSliderClones('.slider-track-servicos');

});
}slides();

function faq(){
    document.addEventListener('DOMContentLoaded', () => {
        // ... (Mantenha todos os códigos anteriores aqui: slider, menu mobile, etc.) ...
        
        // --- NOVO CÓDIGO para a seção FAQ (agora mais performático) ---
        const faqQuestions = document.querySelectorAll('.faq-question');
    
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const parentItem = question.closest('.faq-item');
                const answer = parentItem.querySelector('.faq-answer');
    
                // Verifica se o item clicado já está ativo
                const isActive = parentItem.classList.contains('active');
    
                // --- NOVO CÓDIGO AQUI ---
                // Fecha todos os outros itens da FAQ
                faqQuestions.forEach(otherQuestion => {
                    const otherParentItem = otherQuestion.closest('.faq-item');
                    const otherAnswer = otherParentItem.querySelector('.faq-answer');
    
                    // Se o item for diferente do que foi clicado, e estiver aberto, fecha
                    if (otherParentItem !== parentItem && otherParentItem.classList.contains('active')) {
                        otherParentItem.classList.remove('active');
                        otherAnswer.style.maxHeight = 0;
                    }
                });
                
                if (isActive) {
                    // Se o item clicado já estava ativo, ele será fechado
                    answer.style.maxHeight = 0;
                } else {
                    // Se o item clicado não estava ativo, ele será aberto
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
    
                // Alterna a classe 'active' apenas no item clicado
                parentItem.classList.toggle('active');
            });
        });
    
    });
}
faq();

function btnContato(){
    const btnContato = document.getElementById('btn-contact');
    if (btnContato) {
        btnContato.addEventListener('click', () => {
            window.location.href = 'http://wa.me/+553597769586'; 
        });
    }

    const btnContato2 = document.getElementById('btn-contact2');
    if (btnContato2) {
        btnContato2.addEventListener('click', () => {
            window.location.href = 'http://wa.me/+553597769586'; 
        });
    }

    const btnChamada = document.getElementById('btn-chamada1');
    if (btnChamada) {
        btnChamada.addEventListener('click', () => {
            window.location.href = 'mockup.html'; 
        });
    }

    const btnContato3 = document.getElementById('btn-3d1');
    if (btnContato3) {
        btnContato3.addEventListener('click', () => {
            window.location.href = 'mockup.html'; 
        });
    }

    const btnContato4 = document.getElementById('btn-3d2');
    if (btnContato4) {
        btnContato4.addEventListener('click', () => {
            window.location.href = 'mockup.html'; 
        });
    }
}btnContato();
