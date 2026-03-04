let desc = "14 Febrero; 13 y 31 Marzo; 9 y 19 Abril";
let newDesc = desc.replace(/(?:\d{1,2}(?:,\s*\d{1,2})*(?:\s*y\s*\d{1,2})*\s*(?:de\s*)?)?(febrero|feb\b)(?:\s*(?:de\s*)?\d{4})?(?:\s*\([^)]*\))?/gi, "");
console.log(newDesc);
