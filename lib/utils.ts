// lib/utils.ts
export function makeShortCode(length = 8) {
const nums = '0123456789';
let out = '';
for (let i = 0; i < length; i++) out += nums[Math.floor(Math.random() * nums.length)];
return out;
}


export function nowISO() { return new Date().toISOString(); }
