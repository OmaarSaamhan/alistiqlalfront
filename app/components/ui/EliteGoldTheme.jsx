"use client";

import { useEffect } from "react";

function parseColor(value) {
  const hex = value.match(/^#([\da-f]{3,8})$/i);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3 || digits.length === 4) digits = [...digits].map((part) => part + part).join("");
    if (digits.length === 6 || digits.length === 8) {
      return {
        r: parseInt(digits.slice(0, 2), 16),
        g: parseInt(digits.slice(2, 4), 16),
        b: parseInt(digits.slice(4, 6), 16),
        a: digits.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1,
      };
    }
  }

  const rgb = value.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
  if (!rgb) return null;

  return {
    r: Number(rgb[1]),
    g: Number(rgb[2]),
    b: Number(rgb[3]),
    a: rgb[4] ? (rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : Number(rgb[4])) : 1,
  };
}

function mapColorTokens(value, property) {
  return value.replace(/#[\da-f]{3,8}\b|rgba?\([^)]*\)/gi, (token) => {
    const color = parseColor(token);
    if (!color || color.a === 0) return token;

    const luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
    const maximum = Math.max(color.r, color.g, color.b);
    const minimum = Math.min(color.r, color.g, color.b);
    const saturation = maximum === 0 ? 0 : (maximum - minimum) / maximum;

    let rgb;
    if (luminance > 0.84 && saturation < 0.22) rgb = [250, 249, 246];
    else if (luminance < 0.13 && saturation < 0.32) rgb = [23, 23, 23];
    else if (property === "color" && saturation < 0.12 && luminance < 0.74) rgb = [23, 23, 23];
    else if (property.includes("border") && saturation < 0.2) rgb = [23, 23, 23];
    else rgb = [217, 166, 44];

    return `rgba(${rgb.join(",")},${Math.max(0, Math.min(1, color.a)).toFixed(3)})`;
  });
}

function recolorRule(rule) {
  if (rule.cssRules) {
    for (const nestedRule of rule.cssRules) recolorRule(nestedRule);
    return;
  }

  if (!rule.style) return;
  for (const property of [...rule.style]) {
    if (!/(^color$|background|border|outline|shadow|fill|stroke|decoration|caret|column-rule)/i.test(property)) continue;
    const currentValue = rule.style.getPropertyValue(property);
    const nextValue = mapColorTokens(currentValue, property.toLowerCase());
    if (nextValue !== currentValue) {
      rule.style.setProperty(property, nextValue, rule.style.getPropertyPriority(property));
    }
  }
}

function applyEliteGoldTheme() {
  const root = document.documentElement;
  let tokenStyle = document.getElementById("elite-gold-public-theme");

  if (!tokenStyle) {
    tokenStyle = document.createElement("style");
    tokenStyle.id = "elite-gold-public-theme";
    tokenStyle.textContent = `
      :root, .site-page {
        --ink: #171717;
        --muted: rgba(23, 23, 23, .62);
        --paper: #FAF9F6;
        --white: #FAF9F6;
        --green: #171717;
        --lime: #D9A62C;
        --coral: #D9A62C;
        --line: rgba(23, 23, 23, .14);
        --gold: #D9A62C;
        --light: #FAF9F6;
      }
    `;
    document.head.append(tokenStyle);
  }

  for (const sheet of [...document.styleSheets]) {
    try {
      for (const rule of [...sheet.cssRules]) recolorRule(rule);
    } catch {
      // Skip inaccessible external stylesheets; same-origin site styles are recolored above.
    }
  }

  root.dataset.colorTheme = "elite-gold";
}

export default function EliteGoldTheme() {
  useEffect(() => {
    let scheduled = false;
    const scheduleApply = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        applyEliteGoldTheme();
      });
    };

    scheduleApply();
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.matches?.('link[rel="stylesheet"], style') || node.querySelector?.('link[rel="stylesheet"], style')) {
            scheduleApply();
            return;
          }
        }
      }
    });
    observer.observe(document.head, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
