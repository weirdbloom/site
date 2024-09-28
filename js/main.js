import * as THREE from 'three'
console.log(THREE)
import { createThreeScene } from './render';

const initializeCursor = () => {
    const cursor = document.querySelector('.cursor');

    const updateCursorVisibility = () => {
        if (window.innerWidth <= 768) {
            cursor.style.display = 'none';
        } else {
            cursor.style.display = 'block';
        }
    };

    window.addEventListener('resize', updateCursorVisibility);
    updateCursorVisibility();

    document.addEventListener('mousemove', (event) => {
        const cursorWidth = cursor.offsetWidth;
        const cursorHeight = cursor.offsetHeight;
        cursor.style.left = `${event.clientX - cursorWidth / 2}px`;
        cursor.style.top = `${event.clientY - cursorHeight / 2}px`;
    });

    // Add hover effect for buttons and links
    const hoverTargets = document.querySelectorAll('button, a/*,.highlight*/');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseover', () => {
            cursor.classList.add('active');
        });
        target.addEventListener('mouseout', () => {
            cursor.classList.remove('active');
        });
    });
};

const initializeCheckers = () => {
    const checkers = document.querySelector('.checkers');
    const SQUARE_COUNT = 10;
    for (let i = 0; i < SQUARE_COUNT; i++) {
        const div = document.createElement('div');
        checkers.appendChild(div);
    }
};

const initializeGallery = () => {
    const gallery = document.querySelector('.gallery');
    const CONTENT_SOURCES = [
        // { type: 'image', src: '/assets/img/dysphoria.jpg' },
        // { type: 'image', src: '/assets/img/electric.jpg' },
        // { type: 'image', src: '/assets/img/bw.jpg' },
        // { type: 'video', src: '/assets/video/sample.mp4', attributes: { controls: true } },
        { type: 'three', src: ''}
    ];

    CONTENT_SOURCES.forEach(content => {
        let element;
        switch (content.type) {
            case 'image':
                element = document.createElement('img');
                element.src = content.src;
                break;
            case 'video':
                element = document.createElement('video');
                element.src = content.src;
                for (let attr in content.attributes) {
                    element[attr] = content.attributes[attr];
                }
                break;
            case 'audio':
                element = document.createElement('audio');
                element.src = content.src;
                for (let attr in content.attributes) {
                    element[attr] = content.attributes[attr];
                }
                break;
            case 'three':
                element = document.createElement('div');
                element.style.width = '100%';
                element.style.height = '400px';
                createThreeScene(element);  // Call the function to create the Three.js scene
                break;
            default:
                console.error(`Unsupported content type: ${content.type}`);
                return;
        }
        gallery.appendChild(element);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initializeCursor();
    initializeCheckers();
    initializeGallery();

    const yearSpan = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    const aboutButton = document.getElementById('aboutButton');
    const aboutDiv = document.querySelector('.about');

    aboutButton.addEventListener('click', function() {
        if (aboutDiv.style.display === 'flex') {
            aboutDiv.style.display = 'none';
        } else {
            aboutDiv.style.display = 'flex';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const highlightElement = document.querySelector('.highlight');
    const tooltipImage = document.getElementById('tooltip');

    highlightElement.addEventListener('mouseover', () => {
        tooltipImage.style.display = 'block';
    });

    highlightElement.addEventListener('mousemove', (event) => {
        tooltipImage.style.top = `${event.pageY + 10}px`;
        tooltipImage.style.left = `${event.pageX + 10}px`;
    });

    highlightElement.addEventListener('mouseout', () => {
        tooltipImage.style.display = 'none';
    });
});