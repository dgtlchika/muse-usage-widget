// Muse 使用量ウィジェット（Scriptable用）
// GitHub非公開リポジトリの usage.json を読み取り専用トークンで取得して表示する。
// 設定：下の TOKEN に、muse-usage-widget 専用の読み取り専用トークンを貼る。

const TOKEN = "YOUR_READ_ONLY_TOKEN";;
const URL = "https://raw.githubusercontent.com/dgtlchika/muse-usage-widget/main/usage.json";

async function main() {
  const w = new ListWidget();
  w.backgroundColor = new Color("#111111");

  let data = null;
  try {
    const req = new Request(URL);
    req.headers = {
      "Authorization": "Bearer " + TOKEN,
      "Accept": "application/vnd.github.raw+json",
    };
    data = await req.loadJSON();
  } catch (e) {
    const t = w.addText("Muse 使用量");
    t.textColor = Color.white();
    const e2 = w.addText("データ取得に失敗しました");
    e2.textColor = new Color("#ff6666");
    e2.font = Font.systemFont(11);
    Script.setWidget(w);
    Script.complete();
    return;
  }

  const remain = data.remaining_percent;
  const small = config.widgetFamily === "small";
  let color = new Color("#7ee787"); // 緑
  if (remain < 10) color = new Color("#ff6666"); // 赤
  else if (remain < 25) color = new Color("#ffd166"); // 黄

  const title = w.addText("Muse 残り利用枠");
  title.textColor = new Color("#aaaaaa");
  title.font = Font.systemFont(11);
  w.addSpacer(4);

  const pct = w.addText(remain + "%");
  pct.textColor = color;
  pct.font = Font.boldSystemFont(small ? 30 : 34);
  w.addSpacer(6);

  // 残量バー（小サイズは10マス、通常は17マス。空きマスはドットで崩れ防止）
  const cells = small ? 10 : 17;
  const filled = Math.round((remain / 100) * cells);
  const bar = w.addText("█".repeat(filled) + "·".repeat(cells - filled));
  bar.textColor = color;
  bar.font = Font.systemFont(10);
  w.addSpacer(6);

  const plan = w.addText(small
    ? (data.plan || "-") + "（使用 " + data.used_percent + "%）"
    : "プラン: " + (data.plan || "-") + "（使用 " + data.used_percent + "%）");
  plan.textColor = Color.white();
  plan.font = Font.systemFont(11);

  const reset = w.addText("リセット: " + data.reset_display);
  reset.textColor = Color.white();
  reset.font = Font.systemFont(11);

  const upd = w.addText("最終更新: " + data.updated_display);
  upd.textColor = new Color("#888888");
  upd.font = Font.systemFont(10);

  w.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000);
  Script.setWidget(w);
  Script.complete();
}

await main();
