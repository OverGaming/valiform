import type { LocaleMessages } from '../types';

export const es: LocaleMessages = {
  required: 'Este campo es obligatorio',
  email: 'Por favor ingresa un email válido',
  min: ({ value }) => `Debe ser al menos ${value}`,
  max: ({ value }) => `Debe ser como máximo ${value}`,
  matches: 'El formato no es válido',
  number: 'Debe ser un número válido',
  accepted: 'Debe ser aceptado',
  alpha: 'Debe contener solo caracteres alfabéticos',
  alphanumeric: 'Debe contener solo letras y números',
  alphaSpaces: 'Debe contener solo letras y espacios',
  between: ({ min, max }) => `Debe estar entre ${min} y ${max}`,
  confirm: ({ fieldName }) => `Debe coincidir con ${fieldName}`,
  containsAlpha: 'Debe contener al menos una letra',
  containsAlphanumeric: 'Debe contener al menos una letra o número',
  containsAlphaSpaces: 'Debe contener al menos una letra o espacio',
  containsLowercase: 'Debe contener al menos una letra minúscula',
  containsNumeric: 'Debe contener al menos un número',
  containsSymbol: 'Debe contener al menos un símbolo',
  containsUppercase: 'Debe contener al menos una letra mayúscula',
  dateAfter: ({ date }) => (date ? `Debe ser posterior a ${date}` : 'Debe ser posterior a hoy'),
  dateAfterOrEqual: ({ date }) =>
    date ? `Debe ser posterior o igual a ${date}` : 'Debe ser posterior o igual a hoy',
  dateBefore: ({ date }) => (date ? `Debe ser anterior a ${date}` : 'Debe ser anterior a hoy'),
  dateBeforeOrEqual: ({ date }) =>
    date ? `Debe ser anterior o igual a ${date}` : 'Debe ser anterior o igual a hoy',
  dateBetween: ({ startDate, endDate }) => `Debe estar entre ${startDate} y ${endDate}`,
  dateFormat: ({ format }) => `Debe coincidir con el formato ${format}`,
  endsWith: ({ suffix }) => {
    if (Array.isArray(suffix)) {
      return `Debe terminar con uno de: ${suffix.map((s) => `"${s}"`).join(', ')}`;
    }
    return `Debe terminar con "${suffix}"`;
  },
  is: ({ allowedValues }) =>
    `Debe ser uno de: ${Array.isArray(allowedValues) ? allowedValues.join(', ') : allowedValues}`,
  length: ({ value, min, max }) => {
    if (min !== undefined && max !== undefined) {
      return `Debe tener entre ${min} y ${max} caracteres`;
    } else if (value !== undefined) {
      return `Debe tener exactamente ${value} caracteres`;
    }
    return 'Longitud inválida';
  },
  lowercase: 'Debe contener solo caracteres en minúscula',
  not: ({ disallowedValues }) =>
    `No debe ser uno de: ${Array.isArray(disallowedValues) ? disallowedValues.join(', ') : disallowedValues}`,
  startsWith: ({ prefix }) => {
    if (Array.isArray(prefix)) {
      return `Debe comenzar con uno de: ${prefix.join(', ')}`;
    }
    return `Debe comenzar con "${prefix}"`;
  },
  symbol: 'Debe contener solo símbolos',
  uppercase: 'Debe contener solo caracteres en mayúscula',
  url: 'Debe ser una URL válida'
};
