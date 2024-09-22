document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(move);
    };

    // Handle mouse movement
    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    // Handle touch movement for mobile devices
    window.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            tgX = event.touches[0].clientX;
            tgY = event.touches[0].clientY;
        }
    });

    move();
});
