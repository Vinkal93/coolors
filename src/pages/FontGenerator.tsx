import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Search, Type } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Unicode font transformations for various styles
const fontStyles: { name: string; transform: (text: string) => string }[] = [
  // Bold styles
  { name: 'Bold', transform: (t) => transformText(t, '𝗮', '𝗔', '𝟬') },
  { name: 'Bold Italic', transform: (t) => transformText(t, '𝒂', '𝑨', '0') },
  { name: 'Italic', transform: (t) => transformText(t, '𝘢', '𝘈', '0') },
  { name: 'Bold Serif', transform: (t) => transformText(t, '𝐚', '𝐀', '𝟎') },
  { name: 'Italic Serif', transform: (t) => transformText(t, '𝑎', '𝐴', '0') },
  
  // Script styles
  { name: 'Script', transform: (t) => transformText(t, '𝒶', '𝒜', '0') },
  { name: 'Bold Script', transform: (t) => transformText(t, '𝓪', '𝓐', '0') },
  
  // Fraktur styles
  { name: 'Fraktur', transform: (t) => transformText(t, '𝔞', '𝔄', '0') },
  { name: 'Bold Fraktur', transform: (t) => transformText(t, '𝖆', '𝕬', '0') },
  
  // Double-struck
  { name: 'Double-struck', transform: (t) => transformText(t, '𝕒', '𝔸', '𝟘') },
  
  // Monospace
  { name: 'Monospace', transform: (t) => transformText(t, '𝚊', '𝙰', '𝟶') },
  
  // Sans-serif
  { name: 'Sans-serif', transform: (t) => transformText(t, '𝖺', '𝖠', '𝟢') },
  { name: 'Sans Bold', transform: (t) => transformText(t, '𝗮', '𝗔', '𝟬') },
  { name: 'Sans Italic', transform: (t) => transformText(t, '𝘢', '𝘈', '0') },
  { name: 'Sans Bold Italic', transform: (t) => transformText(t, '𝙖', '𝘼', '0') },
  
  // Special styles
  { name: 'Circled', transform: (t) => transformToCircled(t) },
  { name: 'Circled Negative', transform: (t) => transformToCircledNegative(t) },
  { name: 'Squared', transform: (t) => transformToSquared(t) },
  { name: 'Squared Negative', transform: (t) => transformToSquaredNegative(t) },
  { name: 'Parenthesized', transform: (t) => transformToParenthesized(t) },
  
  // Decorative
  { name: 'Small Caps', transform: (t) => transformToSmallCaps(t) },
  { name: 'Subscript', transform: (t) => transformToSubscript(t) },
  { name: 'Superscript', transform: (t) => transformToSuperscript(t) },
  
  // Fancy styles
  { name: 'Underline', transform: (t) => t.split('').join('̲') },
  { name: 'Strikethrough', transform: (t) => t.split('').join('̶') },
  { name: 'Slashed', transform: (t) => t.split('').join('̷') },
  { name: 'Overline', transform: (t) => t.split('').join('̅') },
  { name: 'Double Underline', transform: (t) => t.split('').join('̳') },
  
  // Regional indicator
  { name: 'Fullwidth', transform: (t) => transformToFullwidth(t) },
  
  // Bubble and aesthetic
  { name: 'Upside Down', transform: (t) => transformToUpsideDown(t) },
  { name: 'Mirror', transform: (t) => transformToMirror(t) },
  
  // Aesthetic modifications
  { name: 'Spaced', transform: (t) => t.split('').join(' ') },
  { name: 'Dotted', transform: (t) => t.split('').join('·') },
  { name: 'Star Spaced', transform: (t) => t.split('').join('⋆') },
  { name: 'Heart Spaced', transform: (t) => t.split('').join('♡') },
  
  // Currency and symbols
  { name: 'Currency Style', transform: (t) => `【${t}】` },
  { name: 'Fancy Brackets', transform: (t) => `『${t}』` },
  { name: 'Corner Brackets', transform: (t) => `「${t}」` },
  { name: 'Double Angle', transform: (t) => `《${t}》` },
  { name: 'Black Lenticular', transform: (t) => `【${t}】` },
  { name: 'White Lenticular', transform: (t) => `〖${t}〗` },
  
  // Decorative borders
  { name: 'Stars', transform: (t) => `✦ ${t} ✦` },
  { name: 'Sparkles', transform: (t) => `✨ ${t} ✨` },
  { name: 'Hearts', transform: (t) => `♥ ${t} ♥` },
  { name: 'Flowers', transform: (t) => `✿ ${t} ✿` },
  { name: 'Diamonds', transform: (t) => `◆ ${t} ◆` },
  { name: 'Arrows', transform: (t) => `➤ ${t} ➤` },
  { name: 'Lightning', transform: (t) => `⚡ ${t} ⚡` },
  { name: 'Fire', transform: (t) => `🔥 ${t} 🔥` },
  { name: 'Crown', transform: (t) => `👑 ${t} 👑` },
  { name: 'Clover', transform: (t) => `☘ ${t} ☘` },
  
  // Wave and special
  { name: 'Wavy Top', transform: (t) => t.split('').map(c => c + '̃').join('') },
  { name: 'Dots Above', transform: (t) => t.split('').map(c => c + '̈').join('') },
  { name: 'Ring Above', transform: (t) => t.split('').map(c => c + '̊').join('') },
  { name: 'Hook Above', transform: (t) => t.split('').map(c => c + '̉').join('') },
  { name: 'Caron', transform: (t) => t.split('').map(c => c + '̌').join('') },
  { name: 'Breve', transform: (t) => t.split('').map(c => c + '̆').join('') },
  { name: 'Dot Below', transform: (t) => t.split('').map(c => c + '̣').join('') },
  { name: 'Cedilla', transform: (t) => t.split('').map(c => c + '̧').join('') },
  { name: 'Ogonek', transform: (t) => t.split('').map(c => c + '̨').join('') },
  { name: 'Macron', transform: (t) => t.split('').map(c => c + '̄').join('') },
  
  // Zalgo style
  { name: 'Glitchy', transform: (t) => transformToGlitchy(t) },
  { name: 'Zalgo Lite', transform: (t) => transformToZalgoLite(t) },
  
  // Emoji style
  { name: 'Emoji Letters', transform: (t) => transformToEmojiLetters(t) },
  
  // Box styles
  { name: 'Box Top', transform: (t) => `┌${'─'.repeat(t.length + 2)}┐\n│ ${t} │` },
  { name: 'Box Full', transform: (t) => `╔${'═'.repeat(t.length + 2)}╗\n║ ${t} ║\n╚${'═'.repeat(t.length + 2)}╝` },
  { name: 'Simple Box', transform: (t) => `[ ${t} ]` },
  { name: 'Pipe Box', transform: (t) => `| ${t} |` },
  
  // Artistic
  { name: 'Medieval', transform: (t) => `⚔ ${transformText(t, '𝔞', '𝔄', '0')} ⚔` },
  { name: 'Fancy Script', transform: (t) => `✦ ${transformText(t, '𝓪', '𝓐', '0')} ✦` },
  { name: 'Royal', transform: (t) => `♔ ${transformText(t, '𝕒', '𝔸', '0')} ♔` },
  
  // More decorative
  ...generateMoreStyles()
];

// Helper function to transform text using Unicode character offsets
function transformText(text: string, aStart: string, AStart: string, zeroStart: string): string {
  const aCode = aStart.codePointAt(0)! - 97;
  const ACode = AStart.codePointAt(0)! - 65;
  const zeroCode = zeroStart.codePointAt(0)! - 48;
  
  return Array.from(text).map(char => {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) { // lowercase
      return String.fromCodePoint(code + aCode);
    } else if (code >= 65 && code <= 90) { // uppercase
      return String.fromCodePoint(code + ACode);
    } else if (code >= 48 && code <= 57 && zeroStart !== '0') { // numbers
      return String.fromCodePoint(code + zeroCode);
    }
    return char;
  }).join('');
}

function transformToCircled(text: string): string {
  const lower = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ';
  const upper = 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ';
  const nums = '⓪①②③④⑤⑥⑦⑧⑨';
  return transformWithMaps(text, lower, upper, nums);
}

function transformToCircledNegative(text: string): string {
  const upper = '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩';
  return transformWithMaps(text, upper, upper, '⓿❶❷❸❹❺❻❼❽❾');
}

function transformToSquared(text: string): string {
  const letters = '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉';
  return transformWithMaps(text, letters, letters, '0123456789');
}

function transformToSquaredNegative(text: string): string {
  const letters = '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉';
  return transformWithMaps(text, letters, letters, '0123456789');
}

function transformToParenthesized(text: string): string {
  const lower = '⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵';
  const upper = '⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵'.toUpperCase();
  return transformWithMaps(text, lower, lower, '⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽');
}

function transformToSmallCaps(text: string): string {
  const lower = 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ';
  return transformWithMaps(text, lower, lower, '0123456789');
}

function transformToSubscript(text: string): string {
  const nums = '₀₁₂₃₄₅₆₇₈₉';
  return text.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 48 && code <= 57) return nums[code - 48];
    return c;
  }).join('');
}

function transformToSuperscript(text: string): string {
  const map: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
    'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
    'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
    'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
    'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ'
  };
  return text.split('').map(c => map[c.toLowerCase()] || c).join('');
}

function transformToFullwidth(text: string): string {
  return text.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) {
      return String.fromCharCode(code + 65248);
    }
    return c;
  }).join('');
}

function transformToUpsideDown(text: string): string {
  const map: Record<string, string> = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ',
    'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o',
    'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ',
    'F': 'Ⅎ', 'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ',
    'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O',
    'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴚ', 'S': 'S', 'T': '⊥',
    'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
    '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ',
    '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
    '.': '˙', ',': "'", "'": ',', '"': '„', '!': '¡', '?': '¿'
  };
  return text.split('').map(c => map[c] || c).reverse().join('');
}

function transformToMirror(text: string): string {
  const map: Record<string, string> = {
    'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ',
    'f': 'ʇ', 'g': 'ǫ', 'h': 'ʜ', 'i': 'i', 'j': 'ꞁ',
    'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'ᴎ', 'o': 'o',
    'p': 'q', 'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 'ƚ',
    'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z'
  };
  return text.split('').map(c => map[c.toLowerCase()] || c).reverse().join('');
}

function transformToGlitchy(text: string): string {
  const zalgo = ['̸', '̵', '̴', '̢', '̧', '̨', '͘', '̕'];
  return text.split('').map(c => {
    const extra = zalgo[Math.floor(Math.random() * zalgo.length)];
    return c + extra;
  }).join('');
}

function transformToZalgoLite(text: string): string {
  const up = ['̍', '̎', '̄', '̅', '̿', '̑', '̆'];
  const down = ['̖', '̗', '̘', '̙', '̜', '̝', '̞'];
  return text.split('').map(c => {
    return c + up[Math.floor(Math.random() * up.length)] + down[Math.floor(Math.random() * down.length)];
  }).join('');
}

function transformToEmojiLetters(text: string): string {
  return text.toUpperCase().split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(0x1F1E6 + code - 65);
    }
    return c;
  }).join('');
}

function transformWithMaps(text: string, lower: string, upper: string, nums: string): string {
  const lowerArr = Array.from(lower);
  const upperArr = Array.from(upper);
  const numsArr = Array.from(nums);
  
  return Array.from(text).map(char => {
    const code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) return lowerArr[code - 97] || char;
    if (code >= 65 && code <= 90) return upperArr[code - 65] || char;
    if (code >= 48 && code <= 57) return numsArr[code - 48] || char;
    return char;
  }).join('');
}

// Generate more font styles to reach 1000+
function generateMoreStyles() {
  const decorations = [
    { name: 'Star Border', prefix: '★彡', suffix: '彡★' },
    { name: 'Moon Stars', prefix: '☾ ⋆*・゚', suffix: '゚・*⋆ ☽' },
    { name: 'Clouds', prefix: '☁️', suffix: '☁️' },
    { name: 'Rainbow', prefix: '🌈', suffix: '🌈' },
    { name: 'Music', prefix: '♪♫', suffix: '♫♪' },
    { name: 'Butterfly', prefix: '🦋', suffix: '🦋' },
    { name: 'Rose', prefix: '🌹', suffix: '🌹' },
    { name: 'Leaf', prefix: '🍃', suffix: '🍃' },
    { name: 'Sun', prefix: '☀️', suffix: '☀️' },
    { name: 'Moon', prefix: '🌙', suffix: '🌙' },
    { name: 'Snowflake', prefix: '❄️', suffix: '❄️' },
    { name: 'Wave', prefix: '〰️', suffix: '〰️' },
    { name: 'Leaf Border', prefix: '🌿', suffix: '🌿' },
    { name: 'Cherry', prefix: '🍒', suffix: '🍒' },
    { name: 'Sakura', prefix: '🌸', suffix: '🌸' },
    { name: 'Gaming', prefix: '🎮', suffix: '🎮' },
    { name: 'Trophy', prefix: '🏆', suffix: '🏆' },
    { name: 'Rocket', prefix: '🚀', suffix: '🚀' },
    { name: 'Ghost', prefix: '👻', suffix: '👻' },
    { name: 'Alien', prefix: '👽', suffix: '👽' },
    { name: 'Robot', prefix: '🤖', suffix: '🤖' },
    { name: 'Devil', prefix: '😈', suffix: '😈' },
    { name: 'Angel', prefix: '😇', suffix: '😇' },
    { name: 'Cool', prefix: '😎', suffix: '😎' },
    { name: 'Nerd', prefix: '🤓', suffix: '🤓' },
    { name: 'Party', prefix: '🎉', suffix: '🎉' },
    { name: 'Gift', prefix: '🎁', suffix: '🎁' },
    { name: 'Cake', prefix: '🎂', suffix: '🎂' },
    { name: 'Coffee', prefix: '☕', suffix: '☕' },
    { name: 'Wine', prefix: '🍷', suffix: '🍷' },
    { name: 'Pizza', prefix: '🍕', suffix: '🍕' },
    { name: 'Taco', prefix: '🌮', suffix: '🌮' },
    { name: 'Burger', prefix: '🍔', suffix: '🍔' },
    { name: 'Sushi', prefix: '🍣', suffix: '🍣' },
    { name: 'Candy', prefix: '🍬', suffix: '🍬' },
    { name: 'Cookie', prefix: '🍪', suffix: '🍪' },
    { name: 'Donut', prefix: '🍩', suffix: '🍩' },
    { name: 'Ice Cream', prefix: '🍦', suffix: '🍦' },
    { name: 'Strawberry', prefix: '🍓', suffix: '🍓' },
    { name: 'Lemon', prefix: '🍋', suffix: '🍋' },
    { name: 'Peach', prefix: '🍑', suffix: '🍑' },
    { name: 'Apple', prefix: '🍎', suffix: '🍎' },
    { name: 'Pear', prefix: '🍐', suffix: '🍐' },
    { name: 'Grape', prefix: '🍇', suffix: '🍇' },
    { name: 'Watermelon', prefix: '🍉', suffix: '🍉' },
    { name: 'Pineapple', prefix: '🍍', suffix: '🍍' },
    { name: 'Coconut', prefix: '🥥', suffix: '🥥' },
    { name: 'Avocado', prefix: '🥑', suffix: '🥑' },
    { name: 'Cat', prefix: '🐱', suffix: '🐱' },
    { name: 'Dog', prefix: '🐶', suffix: '🐶' },
    { name: 'Fox', prefix: '🦊', suffix: '🦊' },
    { name: 'Bear', prefix: '🐻', suffix: '🐻' },
    { name: 'Panda', prefix: '🐼', suffix: '🐼' },
    { name: 'Koala', prefix: '🐨', suffix: '🐨' },
    { name: 'Lion', prefix: '🦁', suffix: '🦁' },
    { name: 'Tiger', prefix: '🐯', suffix: '🐯' },
    { name: 'Unicorn', prefix: '🦄', suffix: '🦄' },
    { name: 'Dragon', prefix: '🐉', suffix: '🐉' },
    { name: 'Phoenix', prefix: '🔥🐦', suffix: '🐦🔥' },
    { name: 'Dolphin', prefix: '🐬', suffix: '🐬' },
    { name: 'Whale', prefix: '🐳', suffix: '🐳' },
    { name: 'Octopus', prefix: '🐙', suffix: '🐙' },
    { name: 'Jellyfish', prefix: '🪼', suffix: '🪼' },
    { name: 'Crab', prefix: '🦀', suffix: '🦀' },
    { name: 'Shrimp', prefix: '🦐', suffix: '🦐' },
    { name: 'Bee', prefix: '🐝', suffix: '🐝' },
    { name: 'Ladybug', prefix: '🐞', suffix: '🐞' },
    { name: 'Spider', prefix: '🕷️', suffix: '🕷️' },
    { name: 'Scorpion', prefix: '🦂', suffix: '🦂' },
    { name: 'Snake', prefix: '🐍', suffix: '🐍' },
    { name: 'Turtle', prefix: '🐢', suffix: '🐢' },
    { name: 'Frog', prefix: '🐸', suffix: '🐸' },
    { name: 'Rabbit', prefix: '🐰', suffix: '🐰' },
    { name: 'Mouse', prefix: '🐭', suffix: '🐭' },
    { name: 'Hamster', prefix: '🐹', suffix: '🐹' },
    { name: 'Pig', prefix: '🐷', suffix: '🐷' },
    { name: 'Cow', prefix: '🐮', suffix: '🐮' },
    { name: 'Chicken', prefix: '🐔', suffix: '🐔' },
    { name: 'Penguin', prefix: '🐧', suffix: '🐧' },
    { name: 'Owl', prefix: '🦉', suffix: '🦉' },
    { name: 'Eagle', prefix: '🦅', suffix: '🦅' },
    { name: 'Parrot', prefix: '🦜', suffix: '🦜' },
    { name: 'Flamingo', prefix: '🦩', suffix: '🦩' },
    { name: 'Peacock', prefix: '🦚', suffix: '🦚' },
    { name: 'Swan', prefix: '🦢', suffix: '🦢' },
    { name: 'Dove', prefix: '🕊️', suffix: '🕊️' },
    { name: 'Heart Eyes', prefix: '😍', suffix: '😍' },
    { name: 'Wink', prefix: '😉', suffix: '😉' },
    { name: 'Kiss', prefix: '😘', suffix: '😘' },
    { name: 'Thinking', prefix: '🤔', suffix: '🤔' },
    { name: 'Laughing', prefix: '😂', suffix: '😂' },
    { name: 'Crying', prefix: '😢', suffix: '😢' },
    { name: 'Angry', prefix: '😠', suffix: '😠' },
    { name: 'Shocked', prefix: '😱', suffix: '😱' },
    { name: 'Sleeping', prefix: '😴', suffix: '😴' },
    { name: 'Sick', prefix: '🤢', suffix: '🤢' },
    { name: 'Rich', prefix: '🤑', suffix: '🤑' },
    { name: 'Hot', prefix: '🥵', suffix: '🥵' },
    { name: 'Cold', prefix: '🥶', suffix: '🥶' },
  ];

  const baseFonts = ['Bold', 'Script', 'Fraktur', 'Double-struck', 'Sans'];
  const generated: { name: string; transform: (text: string) => string }[] = [];

  // Generate emoji combinations
  decorations.forEach(dec => {
    generated.push({
      name: dec.name,
      transform: (t) => `${dec.prefix} ${t} ${dec.suffix}`
    });
  });

  // Generate combined styles
  baseFonts.forEach(font => {
    decorations.slice(0, 50).forEach(dec => {
      generated.push({
        name: `${font} ${dec.name}`,
        transform: (t) => {
          const baseStyle = fontStyles.find(f => f.name === font);
          const transformed = baseStyle ? baseStyle.transform(t) : t;
          return `${dec.prefix} ${transformed} ${dec.suffix}`;
        }
      });
    });
  });

  // Add more artistic combinations
  const artStyles = [
    { name: 'Aesthetic Wave', transform: (t: string) => `・:*:・゚'★,。・:*:・゚'☆ ${t} ☆'゚・:*:・。,★'゚・:*:・` },
    { name: 'Cute Japanese', transform: (t: string) => `✧･ﾟ: *✧･ﾟ:* ${t} *:･ﾟ✧*:･ﾟ✧` },
    { name: 'Sparkle Magic', transform: (t: string) => `・゚゚・。。・゚゚・。 ${t} 。・゚゚・。。・゚゚・` },
    { name: 'Retro Arrows', transform: (t: string) => `»»-----› ${t} ‹-----««` },
    { name: 'Classic Border', transform: (t: string) => `═══════════ ${t} ═══════════` },
    { name: 'Star Trail', transform: (t: string) => `☆.。.:*・°☆ ${t} ☆°・*:.。.☆` },
    { name: 'Love Hearts', transform: (t: string) => `♡´･ᴗ･\`♡ ${t} ♡´･ᴗ･\`♡` },
    { name: 'Flower Garden', transform: (t: string) => `✿.｡.:* ☆:**:. ${t} .:**:.☆*:.｡.✿` },
    { name: 'Ocean Waves', transform: (t: string) => `≋≋≋≋≋ ${t} ≋≋≋≋≋` },
    { name: 'Mountain Peak', transform: (t: string) => `⌒°⌒°⌒° ${t} °⌒°⌒°⌒` },
    { name: 'Cloud Nine', transform: (t: string) => `☁︎☁︎☁︎ ${t} ☁︎☁︎☁︎` },
    { name: 'Night Stars', transform: (t: string) => `·˚✧₊ ${t} ₊✧˚·` },
    { name: 'Magical Girl', transform: (t: string) => `⭑･ﾟﾟ･*:.｡..｡.:* ${t} *:.｡. .｡.:*･゜ﾟ･⭑` },
    { name: 'Celestial', transform: (t: string) => `✰✰✰ ${t} ✰✰✰` },
    { name: 'Diamond Shine', transform: (t: string) => `◇◆◇ ${t} ◇◆◇` },
    { name: 'Arrow Wings', transform: (t: string) => `»»——➤ ${t} ⬅——««` },
    { name: 'Royal Crown', transform: (t: string) => `👑✨ ${t} ✨👑` },
    { name: 'Pixel Heart', transform: (t: string) => `♥♡♥ ${t} ♥♡♥` },
    { name: 'Gaming Style', transform: (t: string) => `⊹⊱✿⊰⊹ ${t} ⊹⊱✿⊰⊹` },
    { name: 'Music Notes', transform: (t: string) => `♩♪♫♬ ${t} ♬♫♪♩` },
    { name: 'Tribal', transform: (t: string) => `◢◤ ${t} ◢◤` },
    { name: 'Nordic', transform: (t: string) => `ᛏᚢᚾᚷ ${t} ᚷᚾᚢᛏ` },
    { name: 'Greek', transform: (t: string) => `αβγ ${t} γβα` },
    { name: 'Matrix', transform: (t: string) => `【${t.split('').join('】【')}】` },
    { name: 'Binary', transform: (t: string) => `01 ${t} 10` },
    { name: 'Code', transform: (t: string) => `<${t}/>` },
    { name: 'Terminal', transform: (t: string) => `$ ${t} _` },
    { name: 'Hashtag', transform: (t: string) => `#${t}#` },
    { name: 'At Symbol', transform: (t: string) => `@${t}@` },
    { name: 'Ampersand', transform: (t: string) => `&${t}&` },
  ];

  generated.push(...artStyles);

  return generated;
}

const FontGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const displayText = inputText || 'Type your text here...';

  const filteredStyles = useMemo(() => {
    if (!searchQuery) return fontStyles;
    return fontStyles.filter(style => 
      style.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="text-tool-purple">Font</span> Generator
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Type or paste your text to get {fontStyles.length}+ awesome custom fonts to use on your socials.
            </p>
          </motion.div>

          {/* Input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here...."
              className="text-lg py-6 px-6 rounded-full border-2 border-primary/20 focus:border-primary/50 text-center"
            />
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search font styles..."
                className="pl-10 rounded-full"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <div className="text-center mb-6 text-sm text-muted-foreground">
            Showing {filteredStyles.length} of {fontStyles.length} font styles
          </div>

          {/* Font styles list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {filteredStyles.map((style, index) => {
              const transformedText = style.transform(displayText);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(0.3 + index * 0.01, 0.5) }}
                  className="group bg-card hover:bg-card/80 rounded-xl p-4 border border-border hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => inputText && copyToClipboard(transformedText, index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">{style.name}</div>
                      <div className="text-lg truncate break-all">
                        {transformedText}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inputText) copyToClipboard(transformedText, index);
                      }}
                      disabled={!inputText}
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredStyles.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No font styles found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FontGenerator;
