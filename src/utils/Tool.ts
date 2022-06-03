// 字符全角转半角
function ToCDB(str: string): string {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) == 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
      continue;
    } else if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
}

// 判断字符是否全角
export function isC(char: string): boolean {
  return /[\uff00-\uffff]/g.test(char); //全角
}
export function px2number(numberLike: string): number {
  return Number(numberLike.replace(/px$/, ""));
}
