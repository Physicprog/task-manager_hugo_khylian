import { useState, useRef } from 'react';

export function useDragScroll() {
    const scrollContainerRef = useRef(null); //permet de scroll en referençant le composant sans reload
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    function handleMouseDown(e) {
        //pas de drag sur ces zones (evite des problemes de scroll horizontal)
        const target = e.target;
        if (target.closest('[data-dnd-kit-sortable]') || //bloque sur les card et colonnes
            target.closest('button') || 
            target.closest('input') || 
            target.closest('textarea')) {
            return;
        }

        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft); //  la souris par rapport au conteneur
        setScrollLeft(scrollContainerRef.current.scrollLeft); // le scroll actuelle 
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft; //x bouge par rapport au conteneur
        const walkpeed = (x - startX) * 1; 
        scrollContainerRef.current.scrollLeft = scrollLeft - walkpeed;
    }

    function stopDragging() {
        setIsDragging(false);
    }

    return { scrollContainerRef, handleMouseDown, handleMouseMove, handleMouseUp: stopDragging, handleMouseLeave: stopDragging };
}