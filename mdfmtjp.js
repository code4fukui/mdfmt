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
  const ss = s2.split("\n");
  for (let i = 0; i < ss.length; i++) {
    const line = ss[i];
    let n;
    if (n = line.match(/^([#[\s-]*)(\d+)\.(\S.*)/)) {
      //console.log(f.name, "x", n[1], line);
      ss[i] = n[1] + n[2] + ". " + n[3];
    }
    if (n = line.match(/^([#[\s-]*)(\d+)([^\d\.].*)/)) {
      //console.log(f.name, "y", n[1], line);
      ss[i] = n[1] + n[2] + ". " + n[3];
    }
  }
  s2 = ss.join("\n");

  if (s != s2) {
    console.log("modified: " + f.name);
    await Deno.writeTextFile(f.name, s2);
  }
}
