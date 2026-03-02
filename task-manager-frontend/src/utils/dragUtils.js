import { useState, useRef } from 'react';

export function useDragScroll() {
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    function handleMouseDown(e) {
        const target = e.target;
        if (target.closest('button') || target.closest('input') || target.closest('textarea')) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft); //on prend la position de la souris par rapport au container de scroll pour que le scroll suive la souris
        setScrollLeft(scrollContainerRef.current.scrollLeft); //ce code permet que le scroll suive la souris
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft; //x vaut la position de la souris par rapport au container de scroll
        const walk = (x - startX) * 1; //permet de changer le coefficient de glissement
        scrollContainerRef.current.scrollLeft = scrollLeft - walk; //scrollLeft est la position de départ du scroll, walk est la distance parcourue par la souris depuis le début du drag, on soustrait walk pour que le scroll suive la souris
    }

    function stopDragging() {
        setIsDragging(false);
    }

    return { scrollContainerRef, handleMouseDown, handleMouseMove, handleMouseUp: stopDragging, handleMouseLeave: stopDragging };
}
