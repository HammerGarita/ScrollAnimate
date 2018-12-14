(function () {
  // let element = document.querySelector('.scroll-horizontal-container')
  // element.addEventListener('wheel', (e) => {
  //   if (e.deltaY !== 0) {
  //     e.preventDefault()
  //     window.requestAnimationFrame(() => {
  //       element.scrollLeft += e.deltaY
  //     })
  //   }
  // })

  ScrollAnimate.add({
    selector: '.animated',
    animationClassName: 'fadeInUp',
    offset: '10%',
    scroll: 'vertical',
    triggerOnce: false,
    disabled: ['tablet', 'mobile'],
    delay: 0,
    duration: '1000',
    iterationCount: '1'
  })
  //
})()
