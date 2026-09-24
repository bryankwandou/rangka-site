// Build-time facts read from the skill repo, so the site's numbers cannot drift from it.
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
// cwd is site-astro/ during astro build; import.meta.url points into the bundle, so do not use it
const root = pathToFileURL(path.resolve(process.cwd(), "..") + path.sep);
const NAMES = { ui:"UI", ugm:"UGM", itb:"ITB", unhas:"Unhas", its:"ITS", binus:"Binus", unm:"UNM", umi:"UMI", unair:"Unair", ub:"UB", ipb:"IPB", unpad:"Unpad", undip:"Undip", uns:"UNS", uny:"UNY", "uin-alauddin":"UIN Alauddin", unismuh:"Unismuh", telkom:"Telkom", uii:"UII", "uin-jakarta":"UIN Jakarta", umy:"UMY", upi:"UPI" };
const ORDER = Object.keys(NAMES);
let files = [];
try { files = fs.readdirSync(new URL("references/", root)); } catch {}
const slugs = files.map(f => (f.match(/^campus-([a-z-]+)\.md$/)||[])[1]).filter(Boolean);
slugs.sort((a,b)=>(ORDER.indexOf(a)+1||99)-(ORDER.indexOf(b)+1||99)||a.localeCompare(b));
export const campuses = slugs.map(s => NAMES[s] || s.toUpperCase());
let evals = 0, pass = 0, total = 0;
try { const e = JSON.parse(fs.readFileSync(new URL("evals/evals.json", root),"utf8")); evals = (e.evals||e).length; } catch {}
try { for (const m of fs.readFileSync(new URL("evals/runs/grading.md", root),"utf8").matchAll(/Total:\s*(\d+)\/(\d+)/g)) { pass += +m[1]; total += +m[2]; } } catch {}
export const stats = { evals, pass, total, langs: 22 };
