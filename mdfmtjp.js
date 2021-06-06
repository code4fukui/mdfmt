const normarize = {
  "．": ".",
  ",": "、",
  "｡": "。",
  "　": " ",
  "＃": "#",
};

const dir = Deno.readDir("./");
for await (const f of dir) {
  if (!f.name.endsWith(".md")) {
    continue;
  }
  const s = await Deno.readTextFile(f.name);

  // normalize char
  let s2 = s;
  for (const src in normarize) {
    const dst = normarize[src];
    s2 = s2.replace(new RegExp(src, "g"), dst);
  }

  // fmt num list
  const ss = s.split("\n");
  for (const line of ss) {
    const n = line.match(/[#\s-](\d+)\S/);
    if (n) {
      console.log(n[1], line);
    }
  }

  if (s != s2) {
    console.log("modified: " + f.name);
    await Deno.writeTextFile(f.name, s2);
  }
}
