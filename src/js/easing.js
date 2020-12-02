export const linear = t => t

export const easeInQuad = t => Math.pow(t, 2)
export const easeOutQuad = t => 1 - easeInQuad(1 - t)
export const easeInOutQuad = t => t < .5 ? easeInQuad(t * 2) / 2 : easeOutQuad(t * 2 - 1) / 2 + .5

export const easeInCubic = t => Math.pow(t, 3)
export const easeOutCubic = t => 1 - easeInCubic(1 - t)
export const easeInOutCubic = t => t < .5 ? easeInCubic(t * 2) / 2 : easeOutCubic(t * 2 - 1) / 2 + .5

export const easeInQuart = t => Math.pow(t, 4)
export const easeOutQuart = t => 1 - easeInQuart(1 - t)
export const easeInOutQuart = t => t < .5 ? easeInQuart(t * 2) / 2 : easeOutQuart(t * 2 - 1) / 2 + .5

export const easeInQuint = t => Math.pow(t, 5)
export const easeOutQuint = t => 1 - easeInQuint(1 - t)
export const easeInOutQuint = t => t < .5 ? easeInQuint(t * 2) / 2 : easeOutQuint(t * 2 - 1) / 2 + .5
