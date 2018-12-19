/*
 * ScrollAnimate v1.0.0 (2018-12-01)
 * The javascript library for animation scroll interactions.
 * (c) 2018 Hammer Garita (@hammergarita)
 * Project Website: http://scrollanimate.com
 * @version 1.0.0
 * @license Dual licensed under MIT license and GPL.
 * @author Hammer Garita - contacto@hgarita.com
 *
 * @file ScrollAnimate main library.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object') {
    module.exports = factory
  } else {
    root.ScrollAnimate = factory()
  }
})(this, () => {
  'use strict'

  let ScrollAnimate = {}
  /*
    * @usage
    * - Inicializar Scroll Animate
    * scrollAnimate.init()
    * - Inicializar Scroll Animate con @parametros
    * scrollAnimate.init({
    *   scroll: 'vertical',
    *   disabled: ['mobile']
    * })
    */
  ScrollAnimate.init = (parametersObject) => {
    /*
      * ----------------------------------------------------------------
      * Private vars
      * ----------------------------------------------------------------
      */
    let _elementObject
    let _animationClassName
    let _offset = '10%'
    let _scroll = 'vertical'
    let _triggerOnce = true
    let _disabled = false
    let _hidde = false

    let _mobile
    let _tablet
    let _desktop

    let _elementPosition
    let _positionElementDisplayed

    let _globalContainer

    /*
     * ----------------------------------------------------------------
     * private functions
     * ----------------------------------------------------------------
     */

    /*
     * Valida las propiedades enviadas en el Objeto (parameters)
     * Propiedades aceptadas:
     * - scroll: 'horizontal' o 'vertical'
     * - disabled: ['mobile', 'tablet', 'desktop']
     */
    let validateParametersObject = (parameters) => {
      // Verifica que @parameters sea un Objeto, que no sea una función y que tenga propiedades
      if (parameters instanceof Object && typeof parameters !== 'function' && Object.keys(parameters).length !== 0) {
        // - Inicializa la validación de propiedades

        // Comprueba si se definio la propiedad scroll
        if (parameters.scroll) {
          // Comprueba que scroll contenga un valor valido
          parameters.scroll === 'horizontal' || parameters.scroll === 'vertical'
            ? _scroll = parameters.scroll
            : (function () { throw new TypeError(`{scroll: '${parameters.scroll}'} contiene un valor no valido.`) }())
        }

        // Comprueba si se definio la propiedad disabled y asigna true a los elementos que se hayan indicado
        if (parameters.disabled) {
          _disabled = true
          parameters.disabled.forEach((_device) => {
            if (_device === 'desktop') _desktop = true
            if (_device === 'tablet') _tablet = true
            if (_device === 'mobile') _mobile = true
          })
        }

      // Si parameters no es un objeto, comprueba que sea indefinido, de lo contrario arroja un error
      } else {
        if (parameters !== undefined) {
          throw new Error(parameters + ' no es un objeto valido')
        }
      }
    }

    // Se ejecuta la funcion validateParametersObject
    validateParametersObject(parametersObject)

    /*
     * ----------------------------------------------------------------
     * Configuración inicial
     *----------------------------------------------------------------
     */
    let initialSetup = () => {
      // Obtiene todos los elementos que contengan el atributo [data-sam]
      // <div data-sam="animationName"></div>
      _elementObject = document.querySelectorAll('[data-sam]')

      // Recorre la lista de elementos
      Array.from(_elementObject).forEach((_selectedItem) => {
        // Obtiene la clase definida en el atributo [data-sam]
        _animationClassName = _selectedItem.dataset.sam
        // Obtiene el valor del atributo [data-sam-offset] y comprueba que tenga un valor valido
        _selectedItem.dataset.samOffset ? _offset = parseFloat(_selectedItem.dataset.samOffset) : _offset = parseFloat('10%')
        isNaN(_offset) || (_offset - Math.floor(_offset)) !== 0
          ? (function () { throw new TypeError(`{offset: '${_offset}'} contiene un valor no valido.`) }())
          : _offset /= 100.0

        // Obtiene el valor del atributo [data-sam-hidde] y comprueba que tenga un valor valido
        _selectedItem.dataset.samHidde === 'true' || _selectedItem.dataset.samHidde === 'false'
          ? _hidde = JSON.parse(_selectedItem.dataset.samHidde)
          : _selectedItem.dataset.samHidde === undefined
            ? _hidde = false
            : (function () { throw new TypeError(`{triggerOnce: '${_selectedItem.dataset.samHidde}'} contiene un valor no valido.`) }())
        // Obtiene las cordenadas del elemento
        _elementPosition = _selectedItem.getBoundingClientRect()
        // Verifica si los elementos están dentro del espacio visible de la pantalla dependiendo el scroll
        if ((_scroll === 'vertical' && _elementPosition.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
            (_scroll === 'horizontal' && _elementPosition.left <= (window.innerWidth || document.documentElement.clientWidth))) {
          // Si esta en el ViewPort le agrega la clase definida en el atributo [data-sam]
          _selectedItem.classList.add(_animationClassName)
        } else {
          // Si no esta en el ViewPort comprueba si el usuario activo la opcion de ocultar
          if (_hidde) _selectedItem.style.visibility = 'hidden'
        }
        _selectedItem.addEventListener('animationend', () => {
          console.log('termino')
        }, false)
      //
      })
    }

    /*
     * ----------------------------------------------------------------
     * Animaciones en Scroll Vertical
     *----------------------------------------------------------------
     */
    let initAnimations = () => {
      _scroll === 'vertical' ? _globalContainer = window : _globalContainer = document.querySelector('.scroll-horizontal-container')
      _globalContainer.addEventListener('scroll', () => {
        Array.from(_elementObject).forEach((_selectedItem) => {
          // Obtiene la clase definida en el atributo [data-sam]
          _animationClassName = _selectedItem.dataset.sam
          // Obtiene las coordenadas del elemento
          _elementPosition = _selectedItem.getBoundingClientRect()
          console.log(_animationClassName + ':' + _elementPosition.right)
          // Obtiene el valor del atributo [data-sam-once] y comprueba que tenga un valor valido
          _selectedItem.dataset.samOnce === 'true' || _selectedItem.dataset.samOnce === 'false'
            ? _triggerOnce = JSON.parse(_selectedItem.dataset.samOnce)
            : _selectedItem.dataset.samOnce === undefined
              ? _triggerOnce = true
              : (function () { throw new TypeError(`{triggerOnce: '${_selectedItem.dataset.samOnce}'} contiene un valor no valido.`) }())
          // Obtiene el valor del atributo [data-sam-hidde]
          _selectedItem.dataset.samHidde ? _hidde = _selectedItem.dataset.samHidde : _hidde = false
          // Calcula la posición del elemento en relacion al offset
          _scroll === 'vertical'
            ? _positionElementDisplayed = _elementPosition.top + (_selectedItem.offsetHeight * _offset)
            : _positionElementDisplayed = _elementPosition.left + (_selectedItem.offsetWidth * _offset)
          // Verifica que se encuentre dentro del espacio visible de la ventana
          if ((_scroll === 'vertical' && _positionElementDisplayed <= (window.innerHeight || document.documentElement.clientHeight)) ||
              (_scroll === 'horizontal' && _positionElementDisplayed <= (window.innerWidth || document.documentElement.clientWidth))) {
            // console.log('In the viewport!')
            if (_hidde) _selectedItem.style.visibility = 'visible'
            _selectedItem.classList.add(_animationClassName)
          } else {
            // console.log('Not in the viewport...')
            if ((!_triggerOnce && _elementPosition.top >= window.innerHeight && _scroll === 'vertical') ||
                (!_triggerOnce && _elementPosition.left >= window.innerWidth && _scroll === 'horizontal')) {
              if (_hidde) _selectedItem.style.visibility = 'hidden'
              _selectedItem.classList.remove(_animationClassName)
            }
          }
        })
      })
    }

    /*
     * ----------------------------------------------------------------
     * Analiza los dispositivos aceptados y ejecuta las animaciones
     *----------------------------------------------------------------
     */

    let animationResponsive = () => {
      if (_disabled) {
        if (
          (_mobile && window.innerWidth <= 576) ||
          (_tablet && window.innerWidth <= 768 && window.innerWidth >= 576) ||
          (_desktop && window.innerWidth >= 768)
        ) { console.log('SocrollAnimate: Animaciones desactivadas para este dispositivo') }
      } else {
        initialSetup()
        initAnimations()
      }
    }

    animationResponsive()
  }

  return ScrollAnimate
})
