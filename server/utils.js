export function generateId(len) {
  var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charlen = chars.length,
      length = len ;
      
  for (var i = 0; i < length; i++) {
      buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
  }
  
  return buf.join('');
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}